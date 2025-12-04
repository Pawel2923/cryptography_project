use rand::rngs::OsRng;
use x25519_dalek::{PublicKey, StaticSecret};
use hkdf::Hkdf;
use sha2::Sha256;
use thiserror::Error;
use base64::{engine::general_purpose, Engine as _};

#[derive(Error, Debug)]
pub enum EcdhError {
    #[error("Invalid public key length")]
    InvalidPublicKey,
    #[error("Invalid key format")]
    InvalidKeyFormat,
    #[error("HKDF error")]
    KdfError,
}

pub struct PrivateKey {
    secret: StaticSecret,
}

pub struct PublicKeyBytes([u8; 32]);

impl PublicKeyBytes {
    pub fn as_bytes(&self) -> &[u8; 32] { &self.0 }
    pub fn to_base64(&self) -> String {
        general_purpose::STANDARD.encode(&self.0)
    }
    pub fn from_base64(s: &str) -> Result<Self, EcdhError> {
        let vec = general_purpose::STANDARD.decode(s).map_err(|_| EcdhError::InvalidKeyFormat)?;
        if vec.len() != 32 {
            return Err(EcdhError::InvalidPublicKey);
        }
        let mut arr = [0u8; 32];
        arr.copy_from_slice(&vec[..32]);
        Ok(PublicKeyBytes(arr))
    }
}

impl PrivateKey {
    pub fn generate() -> (Self, PublicKeyBytes) {
        let secret = StaticSecret::new(OsRng);
        let pubkey = PublicKey::from(&secret);
        let mut pk_bytes = [0u8; 32];
        pk_bytes.copy_from_slice(pubkey.as_bytes());
        (Self { secret }, PublicKeyBytes(pk_bytes))
    }

    pub fn to_base64(&self) -> String {
        general_purpose::STANDARD.encode(self.secret.to_bytes())
    }

    pub fn from_base64(s: &str) -> Result<Self, EcdhError> {
        let vec = general_purpose::STANDARD.decode(s).map_err(|_| EcdhError::InvalidKeyFormat)?;
        if vec.len() != 32 {
            return Err(EcdhError::InvalidKeyFormat);
        }
        let mut arr = [0u8; 32];
        arr.copy_from_slice(&vec[..32]);
        let secret = StaticSecret::from(arr);
        Ok(Self { secret })
    }

    pub fn compute_shared_secret(&self, peer: &PublicKeyBytes) -> Result<[u8; 32], EcdhError> {
        let mut pk_arr = [0u8; 32];
        pk_arr.copy_from_slice(peer.as_bytes());
        let pk = PublicKey::from(pk_arr);
        let shared = self.secret.diffie_hellman(&pk);
        Ok(*shared.as_bytes())
    }

    pub fn derive_key(
        shared_secret: &[u8],
        salt: Option<&[u8]>,
        info: Option<&[u8]>,
    ) -> Result<[u8; 32], EcdhError> {
        let hk = Hkdf::<Sha256>::new(salt, shared_secret);
        let mut okm = [0u8; 32];
        hk.expand(info.unwrap_or(&[]), &mut okm).map_err(|_| EcdhError::KdfError)?;
        Ok(okm)
    }
}

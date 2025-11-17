use crate::{error::CryptoError, traits::Algorithm, utils::file_handler};
use num_bigint::{BigInt, BigUint, RandBigInt, Sign};
use num_integer::Integer;
use num_traits::{One, Zero};
use rand::rngs::OsRng;
use serde::Deserialize;
use std::fs;
use std::path::Path;

const MR_ROUNDS: usize = 12;
const DEFAULT_E: u64 = 65_537;

pub struct RsaCipher {
    key: RsaKeyMaterial,
}

#[derive(Clone)]
struct RsaKeyMaterial {
    modulus: BigUint,
    public_exp: Option<BigUint>,
    private_exp: Option<BigUint>,
}

#[derive(Debug, Clone)]
pub struct RsaPublicKey {
    pub e: BigUint,
    pub n: BigUint,
}

#[derive(Debug, Clone)]
pub struct RsaPrivateKey {
    pub d: BigUint,
    pub n: BigUint,
}

#[derive(Debug, Clone)]
pub struct RsaKeyPair {
    pub public: RsaPublicKey,
    pub private: RsaPrivateKey,
}

#[derive(Deserialize)]
struct RsaKeyPayload {
    n: String,
    #[serde(default)]
    e: Option<String>,
    #[serde(default)]
    d: Option<String>,
}

impl RsaCipher {
    pub fn new(key_source: &str) -> Result<Self, CryptoError> {
        let payload = load_key_payload(key_source)?;
        let modulus = parse_biguint(&payload.n)?;
        let public_exp = match payload.e {
            Some(value) => Some(parse_biguint(&value)?),
            None => None,
        };
        let private_exp = match payload.d {
            Some(value) => Some(parse_biguint(&value)?),
            None => None,
        };

        Ok(Self {
            key: RsaKeyMaterial {
                modulus,
                public_exp,
                private_exp,
            },
        })
    }

    fn require_public_components(&self) -> Result<(&BigUint, &BigUint), CryptoError> {
        let exponent = self.key.public_exp.as_ref().ok_or_else(|| {
            CryptoError::InvalidKey(
                "Klucz publiczny RSA musi zawierać pole 'e' (eksponent publiczny)".to_string(),
            )
        })?;

        Ok((exponent, &self.key.modulus))
    }

    fn require_private_components(&self) -> Result<(&BigUint, &BigUint), CryptoError> {
        let exponent = self.key.private_exp.as_ref().ok_or_else(|| {
            CryptoError::InvalidKey(
                "Klucz prywatny RSA musi zawierać pole 'd' (eksponent prywatny)".to_string(),
            )
        })?;

        Ok((exponent, &self.key.modulus))
    }
}

impl Algorithm for RsaCipher {
    fn encrypt(&self, file_path: &str) -> Result<String, CryptoError> {
        let (public_exp, modulus) = self.require_public_components()?;

        let plaintext = file_handler::read_file(file_path)?;
        let message = BigUint::from_bytes_be(plaintext.as_bytes());

        if message >= *modulus {
            return Err(CryptoError::InvalidFormat(
                "Wiadomość jest większa lub równa modułowi RSA. Użyj większego klucza lub podziel dane na mniejsze bloki.".to_string(),
            ));
        }

        let ciphertext = encrypt_block(&message, public_exp, modulus);
        let cipher_hex = format!("{:x}", ciphertext);

        let output_path = file_handler::create_output_path_with_suffix(file_path, "_encrypted");
        file_handler::write_file(&output_path, &cipher_hex)?;
        Ok(output_path)
    }

    fn decrypt(&self, file_path: &str) -> Result<String, CryptoError> {
        let (private_exp, modulus) = self.require_private_components()?;

        let ciphertext_hex = file_handler::read_file(file_path)?;
        let cleaned: String = ciphertext_hex
            .chars()
            .filter(|c| !c.is_whitespace())
            .collect();
        if cleaned.is_empty() {
            return Err(CryptoError::InvalidFormat(
                "Plik z szyfrogramem jest pusty lub zawiera tylko białe znaki".to_string(),
            ));
        }

        let ciphertext = BigUint::parse_bytes(cleaned.as_bytes(), 16).ok_or_else(|| {
            CryptoError::InvalidFormat(
                "Nie można sparsować szyfrogramu w formacie heksadecymalnym".to_string(),
            )
        })?;

        if ciphertext >= *modulus {
            return Err(CryptoError::InvalidFormat(
                "Szyfrogram jest większy lub równy modułowi RSA. Dane są uszkodzone lub klucz jest niepoprawny.".to_string(),
            ));
        }

        let message = decrypt_block(&ciphertext, private_exp, modulus);
        let message_bytes = message.to_bytes_be();
        let plaintext = String::from_utf8(message_bytes).map_err(|_| {
            CryptoError::InvalidFormat(
                "Odszyfrowany tekst nie jest poprawnym UTF-8. Upewnij się, że szyfrowany plik zawierał tekst.".to_string(),
            )
        })?;

        let output_path = file_handler::create_output_path_with_suffix(file_path, "_decrypted");
        file_handler::write_file(&output_path, &plaintext)?;
        Ok(output_path)
    }
}

fn load_key_payload(key_source: &str) -> Result<RsaKeyPayload, CryptoError> {
    let trimmed = key_source.trim();
    let json_payload = if trimmed.starts_with('{') {
        trimmed.to_owned()
    } else {
        let path = Path::new(trimmed);
        if path.exists() {
            fs::read_to_string(path).map_err(|err| {
                CryptoError::InvalidKey(format!("Nie można odczytać klucza RSA z pliku: {}", err))
            })?
        } else {
            return Err(CryptoError::InvalidKey(
                "Klucz RSA musi być obiektem JSON lub ścieżką do pliku zawierającego JSON"
                    .to_string(),
            ));
        }
    };

    serde_json::from_str(&json_payload).map_err(|err| {
        CryptoError::InvalidKey(format!("Nie można sparsować klucza RSA z JSON: {}", err))
    })
}

fn parse_biguint(value: &str) -> Result<BigUint, CryptoError> {
    let trimmed = value.trim();
    let (radix, digits) = if let Some(rest) = trimmed.strip_prefix("0x") {
        (16, rest)
    } else if let Some(rest) = trimmed.strip_prefix("0X") {
        (16, rest)
    } else {
        (10, trimmed)
    };

    BigUint::parse_bytes(digits.as_bytes(), radix).ok_or_else(|| {
        CryptoError::InvalidKey(format!(
            "Nie można sparsować wartości liczbowej '{}'. Obsługiwane są zapis dziesiętny oraz szesnastkowy (0x).",
            value
        ))
    })
}

fn encrypt_block(message: &BigUint, exponent: &BigUint, modulus: &BigUint) -> BigUint {
    message.modpow(exponent, modulus)
}

fn decrypt_block(ciphertext: &BigUint, exponent: &BigUint, modulus: &BigUint) -> BigUint {
    ciphertext.modpow(exponent, modulus)
}

pub fn generate_keypair(bits: usize) -> Result<RsaKeyPair, CryptoError> {
    if bits < 16 {
        return Err(CryptoError::InvalidKey(
            "Długość klucza RSA musi wynosić co najmniej 16 bitów".to_string(),
        ));
    }

    loop {
        let p = gen_prime(bits);
        let q = gen_prime(bits);

        if p == q {
            continue;
        }

        let n = &p * &q;
        let phi = (&p - BigUint::one()) * (&q - BigUint::one());
        let e = BigUint::from(DEFAULT_E);

        if e.gcd(&phi) != BigUint::one() {
            continue;
        }

        let e_bi = BigInt::from_bytes_be(Sign::Plus, &e.to_bytes_be());
        let phi_bi = BigInt::from_bytes_be(Sign::Plus, &phi.to_bytes_be());

        if let Some(d_bi) = modinv(&e_bi, &phi_bi) {
            if d_bi.is_zero() {
                continue;
            }

            let d_bytes = d_bi.to_signed_bytes_be();
            let d = BigUint::from_bytes_be(&d_bytes);

            let public = RsaPublicKey {
                e: e.clone(),
                n: n.clone(),
            };
            let private = RsaPrivateKey { d, n: n.clone() };

            return Ok(RsaKeyPair { public, private });
        }
    }
}

fn gen_prime(bits: usize) -> BigUint {
    let mut rng = OsRng;
    let bit_size = u64::try_from(bits).unwrap_or(u64::MAX);

    loop {
        let mut candidate = rng.gen_biguint(bit_size);

        if bits > 1 {
            candidate.set_bit((bits - 1) as u64, true);
        }
        candidate.set_bit(0, true);

        if is_probable_prime(&candidate, MR_ROUNDS) {
            return candidate;
        }
    }
}

fn is_probable_prime(n: &BigUint, rounds: usize) -> bool {
    if *n < BigUint::from(2u8) {
        return false;
    }
    if *n == BigUint::from(2u8) || *n == BigUint::from(3u8) {
        return true;
    }
    if n.is_even() {
        return false;
    }

    let one = BigUint::one();
    let n_minus_one = n - &one;
    let mut d = n_minus_one.clone();
    let mut s = 0u32;
    while d.is_even() {
        d >>= 1;
        s += 1;
    }

    let mut rng = OsRng;
    'witness: for _ in 0..rounds {
        let a = rng.gen_biguint_range(&BigUint::from(2u8), &(n - &one));
        let mut x = a.modpow(&d, n);
        if x == one || x == n_minus_one {
            continue 'witness;
        }
        for _ in 1..s {
            x = x.modpow(&BigUint::from(2u8), n);
            if x == n_minus_one {
                continue 'witness;
            }
        }
        return false;
    }
    true
}

fn extended_gcd(a: BigInt, b: BigInt) -> (BigInt, BigInt, BigInt) {
    if b.is_zero() {
        (a.clone(), BigInt::one(), BigInt::zero())
    } else {
        let (g, x1, y1) = extended_gcd(b.clone(), a.clone() % b.clone());
        let x = y1.clone();
        let y = x1 - (a / b) * y1;
        (g, x, y)
    }
}

fn modinv(a: &BigInt, modulus: &BigInt) -> Option<BigInt> {
    let (g, x, _) = extended_gcd(a.clone(), modulus.clone());
    if g != BigInt::one() {
        return None;
    }
    let mut res = x % modulus;
    if res < BigInt::zero() {
        res += modulus;
    }
    Some(res)
}

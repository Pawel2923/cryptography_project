use crate::error::CryptoError;

pub trait Algorithm {
    fn encrypt(&self, file_path: &str) -> Result<String, CryptoError>;
    fn decrypt(&self, file_path: &str) -> Result<String, CryptoError>;
}

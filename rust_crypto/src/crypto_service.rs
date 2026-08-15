use once_cell::sync::Lazy;
use std::collections::HashMap;
use std::sync::RwLock;

use crate::algorithms::aes::AesCipher;
use crate::algorithms::caesar::CaesarCipher;
use crate::algorithms::rsa::RsaCipher;
use crate::algorithms::running_key_cipher::RunningKeyCipher;
use crate::algorithms::vigenere::VigenereCipher;
use crate::error::CryptoError;
use crate::traits::Algorithm;
use crate::utils::logger::{LogLevel, log};

pub type CipherConstructor =
    fn(key: &str, file_path: &str) -> Result<Box<dyn Algorithm>, CryptoError>;

static REGISTRY: Lazy<RwLock<HashMap<String, CipherConstructor>>> = Lazy::new(|| {
    let mut map: HashMap<String, CipherConstructor> = HashMap::new();
    map.insert("caesar-cipher".to_string(), |key, _| {
        Ok(Box::new(CaesarCipher::new(key)?))
    });
    map.insert("vigenere-cipher".to_string(), |key, _| {
        Ok(Box::new(VigenereCipher::new(key)?))
    });
    map.insert("rsa".to_string(), |key, _| {
        Ok(Box::new(RsaCipher::new(key)?))
    });
    map.insert("running-key-cipher".to_string(), |key, file_path| {
        Ok(Box::new(RunningKeyCipher::new(key, file_path)?))
    });
    map.insert("aes-gcm".to_string(), |key, _| {
        Ok(Box::new(AesCipher::new(key)?))
    });
    RwLock::new(map)
});

pub struct CryptoService;

impl CryptoService {
    pub fn register_algorithm(name: &str, constructor: CipherConstructor) {
        if let Ok(mut registry) = REGISTRY.write() {
            registry.insert(name.to_string(), constructor);
        }
    }

    pub fn registered_algorithms() -> Vec<String> {
        if let Ok(registry) = REGISTRY.read() {
            registry.keys().cloned().collect()
        } else {
            Vec::new()
        }
    }

    pub fn create_cipher(
        algorithm: &str,
        key: &str,
        file_path: &str,
    ) -> Result<Box<dyn Algorithm>, CryptoError> {
        let constructor = {
            let registry = REGISTRY
                .read()
                .map_err(|_| CryptoError::InvalidKey("Registry lock poisoned".to_string()))?;
            registry.get(algorithm).copied()
        };

        match constructor {
            Some(ctor) => ctor(key, file_path),
            None => Err(CryptoError::UnsupportedAlgorithm(algorithm.to_string())),
        }
    }

    pub fn encrypt(file_path: &str, key: &str, algorithm: &str) -> Result<String, CryptoError> {
        log(
            LogLevel::INFO,
            "CryptoService",
            &format!("Wybrano algorytm szyfrowania: {}", algorithm),
        );
        let cipher = Self::create_cipher(algorithm, key, file_path)?;
        cipher.encrypt(file_path)
    }

    pub fn decrypt(file_path: &str, key: &str, algorithm: &str) -> Result<String, CryptoError> {
        log(
            LogLevel::INFO,
            "CryptoService",
            &format!("Wybrano algorytm deszyfrowania: {}", algorithm),
        );
        let cipher = Self::create_cipher(algorithm, key, file_path)?;
        cipher.decrypt(file_path)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    struct MockCipher {
        tag: String,
    }

    impl Algorithm for MockCipher {
        fn encrypt(&self, _file_path: &str) -> Result<String, CryptoError> {
            Ok(format!("encrypted-with-{}", self.tag))
        }

        fn decrypt(&self, _file_path: &str) -> Result<String, CryptoError> {
            Ok(format!("decrypted-with-{}", self.tag))
        }
    }

    #[test]
    fn test_create_supported_ciphers() {
        assert!(CryptoService::create_cipher("caesar-cipher", "3", "").is_ok());
        assert!(CryptoService::create_cipher("vigenere-cipher", "key", "").is_ok());
        assert!(CryptoService::create_cipher("aes-gcm", "0123456789abcdef", "").is_ok());
    }

    #[test]
    fn test_unsupported_algorithm() {
        let result = CryptoService::create_cipher("non-existent", "key", "");
        assert!(matches!(result, Err(CryptoError::UnsupportedAlgorithm(_))));
    }

    #[test]
    fn test_open_closed_registration() {
        CryptoService::register_algorithm("custom-mock", |key, _| {
            Ok(Box::new(MockCipher {
                tag: key.to_string(),
            }))
        });

        let cipher = CryptoService::create_cipher("custom-mock", "test-key", "").unwrap();
        assert_eq!(cipher.encrypt("").unwrap(), "encrypted-with-test-key");
        assert_eq!(cipher.decrypt("").unwrap(), "decrypted-with-test-key");
    }

    #[test]
    fn test_registered_algorithms_contains_defaults() {
        let algos = CryptoService::registered_algorithms();
        assert!(algos.contains(&"caesar-cipher".to_string()));
        assert!(algos.contains(&"vigenere-cipher".to_string()));
        assert!(algos.contains(&"rsa".to_string()));
        assert!(algos.contains(&"running-key-cipher".to_string()));
        assert!(algos.contains(&"aes-gcm".to_string()));
    }
}

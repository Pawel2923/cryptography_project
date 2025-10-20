use crate::algorithms::caesar::CaesarCipher;
use crate::algorithms::vigenere::VigenereCipher;
use crate::traits::Algorithm;

pub struct AlgorithmAdapter;

impl AlgorithmAdapter {
    pub fn encrypt(
        file_path: String,
        key: String,
        algorithm: String,
    ) -> Result<String, std::io::Error> {
        match algorithm.as_str() {
            "caesar-cipher" => {
                let cipher = CaesarCipher::new(&key);
                cipher.encrypt(&file_path)
            }
            "vigenere-cipher" => {
                let cipher = VigenereCipher::new(&key)?;
                cipher.encrypt(&file_path)
            }
            "running-key-cipher" => {
                let cipher =
                    crate::algorithms::running_key_cipher::RunningKeyCipher::new(&key, &file_path)?;
                cipher.encrypt(&file_path)
            }
            _ => Err(std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                format!("Unsupported algorithm {}", algorithm),
            )),
        }
    }

    pub fn decrypt(
        file_path: String,
        key: String,
        algorithm: String,
    ) -> Result<String, std::io::Error> {
        match algorithm.as_str() {
            "caesar-cipher" => {
                let cipher = CaesarCipher::new(&key);
                cipher.decrypt(&file_path)
            }
            "vigenere-cipher" => {
                let cipher = VigenereCipher::new(&key)?;
                cipher.decrypt(&file_path)
            }
            "running-key-cipher" => {
                let cipher =
                    crate::algorithms::running_key_cipher::RunningKeyCipher::new(&key, &file_path)?;
                cipher.decrypt(&file_path)
            }
            _ => Err(std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                format!("Unsupported algorithm {}", algorithm),
            )),
        }
    }
}

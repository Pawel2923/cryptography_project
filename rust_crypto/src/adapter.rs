use crate::algorithms::caesar::CaesarCipher;
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
            _ => Err(std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                format!("Unsupported algorithm {}", algorithm),
            )),
        }
    }
}

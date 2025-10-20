use crate::{
    algorithms::vigenere::{Operation, vigenere},
    traits::Algorithm,
    utils::file_handler,
};
use std::io::{Error, ErrorKind};

pub struct RunningKeyCipher {
    key: String,
}

impl RunningKeyCipher {
    pub fn new(key: &str, file_path: &str) -> Result<Self, Error> {
        if key.is_empty() || !key.chars().any(|c| c.is_ascii_alphabetic()) {
            return Err(Error::new(
                ErrorKind::InvalidInput,
                "Key must be a non-empty string containing at least one alphabetic character.",
            ));
        }

        let text = file_handler::read_file(file_path)?;

        let filtered_key_len = key.chars().filter(|c| c.is_ascii_alphabetic()).count();
        let filtered_text_len = text.chars().filter(|c| c.is_ascii_alphabetic()).count();

        if filtered_key_len < filtered_text_len {
            return Err(Error::new(
                ErrorKind::InvalidInput,
                "Key must be at least as long as the text.",
            ));
        }

        Ok(RunningKeyCipher {
            key: key.to_string(),
        })
    }
}

impl Algorithm for RunningKeyCipher {
    fn encrypt(&self, file_path: &str) -> Result<String, Error> {
        let text = file_handler::read_file(file_path)?;

        let encrypted: String = vigenere(&text, &self.key, &Operation::Encrypt);

        let encrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_encrypted");
        file_handler::write_file(&encrypted_path_str, encrypted.as_str())?;
        Ok(encrypted_path_str)
    }

    fn decrypt(&self, file_path: &str) -> Result<String, Error> {
        let text = file_handler::read_file(file_path)?;

        let decrypted: String = vigenere(&text, &self.key, &Operation::Decrypt);

        let decrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_decrypted");
        file_handler::write_file(&decrypted_path_str, decrypted.as_str())?;
        Ok(decrypted_path_str)
    }
}

use crate::{traits::Algorithm, utils::file_handler};

pub struct CaesarCipher {
    key: String,
}

impl CaesarCipher {
    pub fn new(key: &str) -> Self {
        CaesarCipher {
            key: key.to_string(),
        }
    }
}

impl Algorithm for CaesarCipher {
    fn encrypt(&self, file_path: &str) -> Result<String, std::io::Error> {
        let text = file_handler::read_file(file_path)?;
        let key_num = self.key.parse::<i8>().map_err(|_| {
            std::io::Error::new(std::io::ErrorKind::InvalidInput, "Invalid key format")
        })?;

        let encrypted: String = text.chars().map(|c| caesar_shift(c, key_num)).collect();

        let encrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_encrypted");
        file_handler::write_file(&encrypted_path_str, encrypted.as_str())?;
        Ok(encrypted_path_str)
    }

    fn decrypt(&self, file_path: &str) -> Result<String, std::io::Error> {
        let text = file_handler::read_file(file_path)?;
        let key_num = self.key.parse::<i8>().map_err(|_| {
            std::io::Error::new(std::io::ErrorKind::InvalidInput, "Invalid key format")
        })?;

        let decrypted: String = text.chars().map(|c| caesar_shift(c, -key_num)).collect();

        let decrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_decrypted");
        file_handler::write_file(&decrypted_path_str, decrypted.as_str())?;
        Ok(decrypted_path_str)
    }
}

fn caesar_shift(c: char, key: i8) -> char {
    if c.is_ascii_uppercase() {
        let base = b'A';
        let shifted = (((c as u8).wrapping_sub(base) as i8 + key).rem_euclid(26) as u8) + base;
        shifted as char
    } else if c.is_ascii_lowercase() {
        let base = b'a';
        let shifted = (((c as u8).wrapping_sub(base) as i8 + key).rem_euclid(26) as u8) + base;
        shifted as char
    } else {
        c
    }
}

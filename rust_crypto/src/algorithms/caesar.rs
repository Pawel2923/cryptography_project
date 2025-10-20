use crate::{error::CryptoError, traits::Algorithm, utils::file_handler};

pub struct CaesarCipher {
    key: i8,
}

impl CaesarCipher {
    pub fn new(key: &str) -> Result<Self, CryptoError> {
        let key_num = key.parse::<i8>().map_err(|_| {
            CryptoError::InvalidKey("Klucz musi być liczbą całkowitą od 1 do 25".to_string())
        })?;

        if !(1..=25).contains(&key_num) {
            return Err(CryptoError::InvalidKey(
                "Klucz musi być w zakresie od 1 do 25".to_string(),
            ));
        }

        Ok(CaesarCipher { key: key_num })
    }
}

impl Algorithm for CaesarCipher {
    fn encrypt(&self, file_path: &str) -> Result<String, CryptoError> {
        let text = file_handler::read_file(file_path)?;

        let encrypted: String = text.chars().map(|c| caesar_shift(c, self.key)).collect();

        let encrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_encrypted");
        file_handler::write_file(&encrypted_path_str, encrypted.as_str())?;
        Ok(encrypted_path_str)
    }

    fn decrypt(&self, file_path: &str) -> Result<String, CryptoError> {
        let text = file_handler::read_file(file_path)?;

        let decrypted: String = text.chars().map(|c| caesar_shift(c, -self.key)).collect();

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

use crate::{error::CryptoError, traits::Algorithm, utils::file_handler};
use crate::utils::logger::{log, LogLevel};

pub struct CaesarCipher {
    key: i8,
}

impl CaesarCipher {
    pub fn new(key: &str) -> Result<Self, CryptoError> {
        let key_num = key.parse::<i8>().map_err(|_| {
            let msg = "Klucz musi być liczbą całkowitą od 1 do 25".to_string();
            log(
                LogLevel::ERROR,
                "Caesar",
                &format!("Błąd parsowania klucza: {}", msg),
            );
            CryptoError::InvalidKey(msg)
        })?;

        if !(1..=25).contains(&key_num) {
            let msg = "Klucz musi być w zakresie od 1 do 25".to_string();
            log(
                LogLevel::ERROR,
                "Caesar",
                &format!("Nieprawidłowy zakres klucza: {}", msg),
            );
            return Err(CryptoError::InvalidKey(msg));
        }

        Ok(CaesarCipher { key: key_num })
    }
}

impl Algorithm for CaesarCipher {
    fn encrypt(&self, file_path: &str) -> Result<String, CryptoError> {
        log(
            LogLevel::INFO,
            "Caesar",
            &format!("Rozpoczynanie szyfrowania Cezara dla pliku: {}", file_path),
        );

        let text = file_handler::read_file(file_path).map_err(|e| {
            log(
                LogLevel::ERROR,
                "Caesar",
                &format!("Błąd odczytu pliku: {}", e),
            );
            e
        })?;
        log(
            LogLevel::INFO,
            "Caesar",
            &format!("Wczytano plik, rozmiar: {} bajtów", text.len()),
        );

        log(
            LogLevel::INFO,
            "Caesar",
            &format!("Szyfrowanie z przesunięciem: {}", self.key),
        );

        let encrypted: String = text.chars().map(|c| caesar_shift(c, self.key)).collect();

        let encrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_encrypted");
        file_handler::write_file(&encrypted_path_str, encrypted.as_str()).map_err(|e| {
            log(
                LogLevel::ERROR,
                "Caesar",
                &format!("Błąd zapisu pliku: {}", e),
            );
            e
        })?;

        log(
            LogLevel::INFO,
            "Caesar",
            &format!(
                "Szyfrowanie zakończone. Zapisano do: {}",
                encrypted_path_str
            ),
        );

        Ok(encrypted_path_str)
    }

    fn decrypt(&self, file_path: &str) -> Result<String, CryptoError> {
        log(
            LogLevel::INFO,
            "Caesar",
            &format!("Rozpoczynanie deszyfrowania Cezara dla pliku: {}", file_path),
        );

        let text = file_handler::read_file(file_path).map_err(|e| {
            log(
                LogLevel::ERROR,
                "Caesar",
                &format!("Błąd odczytu pliku: {}", e),
            );
            e
        })?;
        log(
            LogLevel::INFO,
            "Caesar",
            &format!("Wczytano plik, rozmiar: {} bajtów", text.len()),
        );

        log(
            LogLevel::INFO,
            "Caesar",
            &format!("Deszyfrowanie z przesunięciem: -{}", self.key),
        );

        let decrypted: String = text.chars().map(|c| caesar_shift(c, -self.key)).collect();

        let decrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_decrypted");
        file_handler::write_file(&decrypted_path_str, decrypted.as_str()).map_err(|e| {
            log(
                LogLevel::ERROR,
                "Caesar",
                &format!("Błąd zapisu pliku: {}", e),
            );
            e
        })?;

        log(
            LogLevel::INFO,
            "Caesar",
            &format!(
                "Deszyfrowanie zakończone. Zapisano do: {}",
                decrypted_path_str
            ),
        );

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

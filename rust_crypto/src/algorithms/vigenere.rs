use crate::{error::CryptoError, traits::Algorithm, utils::file_handler};
use crate::utils::logger::{log, LogLevel};

pub struct VigenereCipher {
    key: String,
}

impl VigenereCipher {
    pub fn new(key: &str) -> Result<Self, CryptoError> {
        if key.is_empty() || !key.chars().any(|c| c.is_ascii_alphabetic()) {
            let msg = "Klucz musi zawierać co najmniej jedną literę alfabetu".to_string();
            log(
                LogLevel::ERROR,
                "Vigenere",
                &format!("Nieprawidłowy klucz: {}", msg),
            );
            return Err(CryptoError::InvalidKey(msg));
        }

        Ok(VigenereCipher {
            key: key.to_string(),
        })
    }
}

pub enum Operation {
    Encrypt,
    Decrypt,
}

impl Algorithm for VigenereCipher {
    fn encrypt(&self, file_path: &str) -> Result<String, CryptoError> {
        log(
            LogLevel::INFO,
            "Vigenere",
            &format!("Rozpoczynanie szyfrowania Vigenere'a dla pliku: {}", file_path),
        );
        let text = file_handler::read_file(file_path).map_err(|e| {
            log(
                LogLevel::ERROR,
                "Vigenere",
                &format!("Błąd odczytu pliku: {}", e),
            );
            e
        })?;
        log(
            LogLevel::INFO,
            "Vigenere",
            &format!("Wczytano plik, rozmiar: {} bajtów", text.len()),
        );

        log(
            LogLevel::INFO,
            "Vigenere",
            &format!("Klucz: {}", self.key),
        );
        let encrypted: String = vigenere(&text, &self.key, &Operation::Encrypt);

        let encrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_encrypted");
        file_handler::write_file(&encrypted_path_str, encrypted.as_str()).map_err(|e| {
            log(
                LogLevel::ERROR,
                "Vigenere",
                &format!("Błąd zapisu pliku: {}", e),
            );
            e
        })?;
        log(
            LogLevel::INFO,
            "Vigenere",
            &format!("Szyfrowanie zakończone. Zapisano do: {}", encrypted_path_str),
        );
        Ok(encrypted_path_str)
    }

    fn decrypt(&self, file_path: &str) -> Result<String, CryptoError> {
        log(
            LogLevel::INFO,
            "Vigenere",
            &format!("Rozpoczynanie deszyfrowania Vigenere'a dla pliku: {}", file_path),
        );
        let text = file_handler::read_file(file_path).map_err(|e| {
            log(
                LogLevel::ERROR,
                "Vigenere",
                &format!("Błąd odczytu pliku: {}", e),
            );
            e
        })?;
        log(
            LogLevel::INFO,
            "Vigenere",
            &format!("Wczytano plik, rozmiar: {} bajtów", text.len()),
        );

        log(
            LogLevel::INFO,
            "Vigenere",
            &format!("Klucz: {}", self.key),
        );
        let decrypted: String = vigenere(&text, &self.key, &Operation::Decrypt);

        let decrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_decrypted");
        file_handler::write_file(&decrypted_path_str, decrypted.as_str()).map_err(|e| {
            log(
                LogLevel::ERROR,
                "Vigenere",
                &format!("Błąd zapisu pliku: {}", e),
            );
            e
        })?;
        log(
            LogLevel::INFO,
            "Vigenere",
            &format!("Deszyfrowanie zakończone. Zapisano do: {}", decrypted_path_str),
        );
        Ok(decrypted_path_str)
    }
}

pub fn vigenere(text: &str, key: &str, operation: &Operation) -> String {
    let key_shifts: Vec<i8> = key
        .bytes()
        .filter(|b| b.is_ascii_alphabetic())
        .map(|b| (b.to_ascii_uppercase() - b'A') as i8)
        .collect();

    if key_shifts.is_empty() {
        return text.to_string();
    }

    let mut encrypted = String::with_capacity(text.len());
    let mut key_index: usize = 0;

    for c in text.chars() {
        if c.is_ascii_alphabetic() {
            let shift = key_shifts[key_index % key_shifts.len()];
            encrypted.push(shift_char(c, shift, operation));
            key_index += 1;
        } else {
            encrypted.push(c);
        }
    }

    encrypted
}

fn shift_char(c: char, key_shift: i8, operation: &Operation) -> char {
    let base = if c.is_ascii_lowercase() { b'a' } else { b'A' };

    let shifted = match operation {
        Operation::Encrypt => {
            (((c as u8).wrapping_sub(base) as i8 + key_shift).rem_euclid(26) as u8) + base
        }
        Operation::Decrypt => {
            (((c as u8).wrapping_sub(base) as i8 - key_shift).rem_euclid(26) as u8) + base
        }
    };
    shifted as char
}

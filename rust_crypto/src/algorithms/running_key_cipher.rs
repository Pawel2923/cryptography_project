use crate::{
    algorithms::vigenere::{Operation, vigenere},
    error::CryptoError,
    traits::Algorithm,
    utils::file_handler,
    utils::logger::{LogLevel, log},
};

pub struct RunningKeyCipher {
    key: String,
}

impl RunningKeyCipher {
    pub fn new(key: &str, file_path: &str) -> Result<Self, CryptoError> {
        if key.is_empty() || !key.chars().any(|c| c.is_ascii_alphabetic()) {
            let msg = "Klucz musi zawierać co najmniej jedną literę alfabetu".to_string();
            log(
                LogLevel::ERROR,
                "RunningKey",
                &format!("Nieprawidłowy klucz: {}", msg),
            );
            return Err(CryptoError::InvalidKey(msg));
        }

        let text = file_handler::read_file(file_path).map_err(|e| {
            log(
                LogLevel::ERROR,
                "RunningKey",
                &format!("Błąd odczytu pliku: {}", e),
            );
            e
        })?;

        let filtered_key_len = key.chars().filter(|c| c.is_ascii_alphabetic()).count();
        let filtered_text_len = text.chars().filter(|c| c.is_ascii_alphabetic()).count();

        if filtered_key_len < filtered_text_len {
            let msg = "Klucz musi być co najmniej tak długi jak tekst".to_string();
            log(
                LogLevel::ERROR,
                "RunningKey",
                &format!("Klucz zbyt krótki: {}", msg),
            );
            return Err(CryptoError::KeyTooShort(msg));
        }

        Ok(RunningKeyCipher {
            key: key.to_string(),
        })
    }
}

impl Algorithm for RunningKeyCipher {
    fn encrypt(&self, file_path: &str) -> Result<String, CryptoError> {
        log(
            LogLevel::INFO,
            "RunningKey",
            format!(
                "Rozpoczynanie szyfrowania Running Key dla pliku: {}",
                file_path
            ),
        );
        let text = file_handler::read_file(file_path).map_err(|e| {
            log(
                LogLevel::ERROR,
                "RunningKey",
                format!("Błąd odczytu pliku: {}", e),
            );
            e
        })?;
        log(
            LogLevel::INFO,
            "RunningKey",
            format!("Wczytano plik, rozmiar: {} bajtów", text.len()),
        );

        let encrypted: String = vigenere(&text, &self.key, &Operation::Encrypt);

        let encrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_encrypted");
        file_handler::write_file(&encrypted_path_str, encrypted.as_str()).map_err(|e| {
            log(
                LogLevel::ERROR,
                "RunningKey",
                format!("Błąd zapisu pliku: {}", e),
            );
            e
        })?;
        log(
            LogLevel::INFO,
            "RunningKey",
            format!(
                "Szyfrowanie zakończone. Zapisano do: {}",
                encrypted_path_str
            ),
        );
        Ok(encrypted_path_str)
    }

    fn decrypt(&self, file_path: &str) -> Result<String, CryptoError> {
        log(
            LogLevel::INFO,
            "RunningKey",
            format!(
                "Rozpoczynanie deszyfrowania Running Key dla pliku: {}",
                file_path
            ),
        );
        let text = file_handler::read_file(file_path).map_err(|e| {
            log(
                LogLevel::ERROR,
                "RunningKey",
                format!("Błąd odczytu pliku: {}", e),
            );
            e
        })?;
        log(
            LogLevel::INFO,
            "RunningKey",
            format!("Wczytano plik, rozmiar: {} bajtów", text.len()),
        );

        let decrypted: String = vigenere(&text, &self.key, &Operation::Decrypt);

        let decrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_decrypted");
        file_handler::write_file(&decrypted_path_str, decrypted.as_str()).map_err(|e| {
            log(
                LogLevel::ERROR,
                "RunningKey",
                format!("Błąd zapisu pliku: {}", e),
            );
            e
        })?;
        log(
            LogLevel::INFO,
            "RunningKey",
            format!(
                "Deszyfrowanie zakończone. Zapisano do: {}",
                decrypted_path_str
            ),
        );
        Ok(decrypted_path_str)
    }
}

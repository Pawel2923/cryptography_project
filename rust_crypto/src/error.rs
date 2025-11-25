use std::fmt;

#[derive(Debug)]
pub enum CryptoError {
    FileNotFound(String),
    FileReadError(String),
    FileWriteError(String),
    InvalidKey(String),
    UnsupportedAlgorithm(String),
    KeyTooShort(String),
    IoError(std::io::Error),
    DecryptionError(String),
    InvalidFormat(String),
    LogError(String),
}

impl fmt::Display for CryptoError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            CryptoError::FileNotFound(path) => {
                write!(f, "Nie znaleziono pliku: {}", path)
            }
            CryptoError::FileReadError(msg) => {
                write!(f, "Błąd odczytu pliku: {}", msg)
            }
            CryptoError::FileWriteError(msg) => {
                write!(f, "Błąd zapisu pliku: {}", msg)
            }
            CryptoError::InvalidKey(msg) => {
                write!(f, "Nieprawidłowy klucz: {}", msg)
            }
            CryptoError::UnsupportedAlgorithm(algo) => {
                write!(f, "Nieobsługiwany algorytm: {}", algo)
            }
            CryptoError::KeyTooShort(msg) => {
                write!(f, "Klucz jest za krótki: {}", msg)
            }
            CryptoError::IoError(err) => {
                write!(f, "Błąd wejścia/wyjścia: {}", err)
            }
            CryptoError::DecryptionError(msg) => {
                write!(f, "Błąd deszyfrowania: {}", msg)
            }
            CryptoError::InvalidFormat(msg) => {
                write!(f, "Nieprawidłowy format danych: {}", msg)
            }
            CryptoError::LogError(msg) => {
                write!(f, "Błąd logowania: {}", msg)
            }
        }
    }
}

impl std::error::Error for CryptoError {}

impl From<std::io::Error> for CryptoError {
    fn from(err: std::io::Error) -> Self {
        match err.kind() {
            std::io::ErrorKind::NotFound => CryptoError::FileNotFound(err.to_string()),
            std::io::ErrorKind::PermissionDenied => {
                CryptoError::FileReadError("Brak uprawnień do odczytu pliku".to_string())
            }
            _ => CryptoError::IoError(err),
        }
    }
}

impl From<CryptoError> for napi::Error {
    fn from(err: CryptoError) -> Self {
        napi::Error::from_reason(err.to_string())
    }
}

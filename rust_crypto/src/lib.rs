use napi_derive::napi;
use serde_json::json;

mod adapter;
mod algorithms;
mod error;
mod traits;
mod utils;
use adapter::AlgorithmAdapter;

use crate::utils::logger;

#[napi]
pub fn encrypt(file_path: String, key: String, algorithm: String) -> napi::Result<String> {
    match AlgorithmAdapter::encrypt(file_path, key, algorithm) {
        Ok(result) => Ok(result),
        Err(e) => {
            logger::log(
                logger::LogLevel::ERROR,
                "Encrypt",
                &format!("Błąd szyfrowania: {}", e),
            );
            Err(napi::Error::from(e))
        }
    }
}

#[napi]
pub fn decrypt(file_path: String, key: String, algorithm: String) -> napi::Result<String> {
    match AlgorithmAdapter::decrypt(file_path, key, algorithm) {
        Ok(result) => Ok(result),
        Err(e) => {
            logger::log(
                logger::LogLevel::ERROR,
                "Decrypt",
                &format!("Błąd deszyfrowania: {}", e),
            );
            Err(napi::Error::from(e))
        }
    }
}

#[napi]
pub fn generate_rsa_keypair(bits: u32) -> napi::Result<String> {
    match algorithms::rsa::generate_keypair(bits as usize) {
        Ok(keypair) => {
            let payload = json!({
                "public": {
                    "n": keypair.public.n.to_str_radix(10),
                    "e": keypair.public.e.to_str_radix(10)
                },
                "private": {
                    "n": keypair.private.n.to_str_radix(10),
                    "d": keypair.private.d.to_str_radix(10)
                }
            });
            Ok(payload.to_string())
        }
        Err(e) => {
            logger::log(
                logger::LogLevel::ERROR,
                "KeyGen",
                &format!("Błąd generowania kluczy RSA: {}", e),
            );
            Err(napi::Error::from(e))
        }
    }
}

#[napi]
pub fn export_logs() -> napi::Result<String> {
    let logs = logger::get_logs();
    let log_strings: Vec<String> = logs.iter().map(|entry| entry.format()).collect();
    Ok(log_strings.join("\n"))
}

#[napi]
pub fn clear_logs() {
    logger::clear_logs();
}

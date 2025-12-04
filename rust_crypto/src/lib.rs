use napi_derive::napi;
use serde_json::json;

mod adapter;
mod algorithms;
mod error;
mod traits;
mod utils;
use adapter::AlgorithmAdapter;
use base64::Engine;

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

#[napi]
pub fn generate_ecdh_keypair() -> napi::Result<String> {
    let (private, public) = algorithms::ecdh::PrivateKey::generate();
    let payload = json!({
        "private": private.to_base64(),
        "public": public.to_base64()
    });
    Ok(payload.to_string())
}

#[napi]
pub fn compute_ecdh_shared_secret(private_key: String, public_key: String) -> napi::Result<String> {
    let private = algorithms::ecdh::PrivateKey::from_base64(&private_key)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;
    let public = algorithms::ecdh::PublicKeyBytes::from_base64(&public_key)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let shared_secret = private.compute_shared_secret(&public)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    Ok(base64::engine::general_purpose::STANDARD.encode(shared_secret))
}

#[napi]
pub fn derive_ecdh_key(
    shared_secret: String,
    salt: Option<String>,
    info: Option<String>,
) -> napi::Result<String> {
    let secret_bytes = base64::engine::general_purpose::STANDARD
        .decode(&shared_secret)
        .map_err(|_| napi::Error::from_reason("Invalid base64 shared secret".to_string()))?;

    let salt_bytes = if let Some(s) = salt {
        Some(base64::engine::general_purpose::STANDARD
            .decode(&s)
            .map_err(|_| napi::Error::from_reason("Invalid base64 salt".to_string()))?)
    } else {
        None
    };

    let info_bytes = if let Some(i) = info {
        Some(base64::engine::general_purpose::STANDARD
            .decode(&i)
            .map_err(|_| napi::Error::from_reason("Invalid base64 info".to_string()))?)
    } else {
        None
    };

    let derived = algorithms::ecdh::PrivateKey::derive_key(
        &secret_bytes,
        salt_bytes.as_deref(),
        info_bytes.as_deref(),
    ).map_err(|e| napi::Error::from_reason(e.to_string()))?;

    Ok(base64::engine::general_purpose::STANDARD.encode(derived))
}

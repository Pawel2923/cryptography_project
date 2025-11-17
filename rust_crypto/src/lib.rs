use napi_derive::napi;
use serde_json::json;

mod adapter;
mod algorithms;
mod error;
mod traits;
mod utils;
use adapter::AlgorithmAdapter;

#[napi]
pub fn encrypt(file_path: String, key: String, algorithm: String) -> napi::Result<String> {
    AlgorithmAdapter::encrypt(file_path, key, algorithm).map_err(|e| napi::Error::from(e))
}

#[napi]
pub fn decrypt(file_path: String, key: String, algorithm: String) -> napi::Result<String> {
    AlgorithmAdapter::decrypt(file_path, key, algorithm).map_err(|e| napi::Error::from(e))
}

#[napi]
pub fn generate_rsa_keypair(bits: u32) -> napi::Result<String> {
    let keypair = algorithms::rsa::generate_keypair(bits as usize)?;
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

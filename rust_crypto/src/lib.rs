use napi_derive::napi;

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

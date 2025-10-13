use napi_derive::napi;

mod adapter;
mod algorithms;
mod traits;
mod utils;
use adapter::AlgorithmAdapter;

#[napi]
pub fn encrypt(file_path: String, key: String, algorithm: String) -> napi::Result<String> {
    Ok(AlgorithmAdapter::encrypt(file_path, key, algorithm)?)
}

#[napi]
pub fn decrypt(file_path: String, key: String, algorithm: String) -> napi::Result<String> {
    Ok(AlgorithmAdapter::decrypt(file_path, key, algorithm)?)
}

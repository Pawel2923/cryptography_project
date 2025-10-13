use napi_derive::napi;

mod algorithms;
mod utils;
use algorithms::caesar;

#[napi]
pub fn encrypt(file_path: String, key: String) -> napi::Result<String> {
    Ok(caesar::encrypt(&file_path, &key)?)
}

#[napi]
pub fn decrypt(file_path: String, key: String) -> napi::Result<String> {
    Ok(caesar::decrypt(&file_path, &key)?)
}

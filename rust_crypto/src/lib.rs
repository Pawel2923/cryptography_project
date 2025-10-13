use napi_derive::napi;

mod algorithms;
use algorithms::caesar;

#[napi]
pub fn encrypt(text: String, key: u8) -> String {
    caesar::encrypt(&text, key)
}

#[napi]
pub fn decrypt(text: String, key: u8) -> String {
    caesar::decrypt(&text, key)
}

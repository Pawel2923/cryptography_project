use napi_derive::napi;

mod algorithms;
use algorithms::caesar;

#[napi]
pub fn encrypt(text: String, key: String) -> String {
    caesar::encrypt(&text, &key)
}

#[napi]
pub fn decrypt(text: String, key: String) -> String {
    caesar::decrypt(&text, &key)
}

mod algorithms;
mod crypto_service;
mod error;
mod traits;
mod utils;
use crypto_service::CryptoService;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let text = utils::file_handler::read_file("./src/example.txt")?;
    println!("Read text: {}", text);

    let encryption_result = CryptoService::encrypt(
        "./src/example.txt",
        "kot",
        "vigenere-cipher",
    )?;
    println!("Encrypted: {}", encryption_result);

    let decryption_result = CryptoService::decrypt(
        "./src/example_encrypted.txt",
        "kot",
        "vigenere-cipher",
    )?;
    println!("Decrypted: {}", decryption_result);
    Ok(())
}

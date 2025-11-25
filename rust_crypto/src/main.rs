mod adapter;
mod algorithms;
mod error;
mod traits;
mod utils;
use adapter::AlgorithmAdapter;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let text = utils::file_handler::read_file("./src/example.txt")?;
    println!("Read text: {}", text);

    let encryption_result = AlgorithmAdapter::encrypt(
        "./src/example.txt".to_string(),
        "kot".to_string(),
        "vigenere-cipher".to_string(),
    )?;
    println!("Encrypted: {}", encryption_result);

    let decryption_result = AlgorithmAdapter::decrypt(
        "./src/example_encrypted.txt".to_string(),
        "kot".to_string(),
        "vigenere-cipher".to_string(),
    )?;
    println!("Decrypted: {}", decryption_result);
    Ok(())
}

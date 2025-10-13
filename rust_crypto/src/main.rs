mod algorithms;
use algorithms::caesar;

mod utils;
use utils::file_handler;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let text = file_handler::read_file("./src/example.txt")?;
    println!("Read text: {}", text);

    let encryption_result = caesar::encrypt("./src/example.txt", "3")?;
    println!("Encrypted: {}", encryption_result);

    let decryption_result = caesar::decrypt("./src/example.txt", "3")?;
    println!("Decrypted: {}", decryption_result);

    file_handler::write_file("./src/encrypted.txt", &encryption_result)?;
    println!("Encrypted text saved to ./src/encrypted.txt");

    Ok(())
}

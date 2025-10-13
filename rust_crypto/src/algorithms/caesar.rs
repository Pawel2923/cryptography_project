use crate::utils::file_handler;

pub fn encrypt(file_path: &str, key: &str) -> Result<String, std::io::Error> {
    let text = file_handler::read_file(file_path)?;
    let key_num = key
        .parse::<i8>()
        .map_err(|_| std::io::Error::new(std::io::ErrorKind::InvalidInput, "Invalid key format"))?;

    let encrypted: String = text.chars().map(|c| caesar_shift(c, key_num)).collect();

    file_handler::write_file(file_path, encrypted.as_str())?;
    Ok(encrypted)
}

pub fn decrypt(file_path: &str, key: &str) -> Result<String, std::io::Error> {
    let text = file_handler::read_file(file_path)?;
    let key_num = key
        .parse::<i8>()
        .map_err(|_| std::io::Error::new(std::io::ErrorKind::InvalidInput, "Invalid key format"))?;

    let decrypted: String = text.chars().map(|c| caesar_shift(c, -key_num)).collect();

    file_handler::write_file(file_path, decrypted.as_str())?;
    Ok(decrypted)
}

pub fn caesar_shift(c: char, key: i8) -> char {
    if c.is_ascii_uppercase() {
        let base = b'A';
        let shifted = (((c as u8).wrapping_sub(base) as i8 + key).rem_euclid(26) as u8) + base;
        shifted as char
    } else if c.is_ascii_lowercase() {
        let base = b'a';
        let shifted = (((c as u8).wrapping_sub(base) as i8 + key).rem_euclid(26) as u8) + base;
        shifted as char
    } else {
        c
    }
}

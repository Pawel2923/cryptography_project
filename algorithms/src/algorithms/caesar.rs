pub fn encrypt(text: &str, key: u8) -> String {
    text.chars().map(|c| caesar_shift(c, key as i8)).collect()
}

pub fn decrypt(text: &str, key: u8) -> String {
    text.chars()
        .map(|c| caesar_shift(c, -(key as i8)))
        .collect()
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

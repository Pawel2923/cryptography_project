use crate::algorithms::aes_constants::{BLOCK_SIZE, RCON, SBOX};
use crate::algorithms::aes_helpers::{gmul, rot_word, sub_word};
use crate::error::CryptoError;
use crate::traits::Algorithm;
use crate::utils::file_handler;
use crate::utils::logger::{log, LogLevel};
use rand::Rng;

pub type Block = [u8; BLOCK_SIZE];
pub type State = [u8; BLOCK_SIZE];
pub type RoundKeys = Vec<[u8; 16]>;

pub struct AesCipher {
    key: Vec<u8>,
}

impl AesCipher {
    pub fn new(key: &str) -> Result<Self, CryptoError> {
        let key_bytes = key.as_bytes();
        if key_bytes.len() != 16 {
            return Err(CryptoError::InvalidKey(
                "AES key must be exactly 16 bytes (AES-128)".to_string(),
            ));
        }

        Ok(AesCipher {
            key: key_bytes.to_vec(),
        })
    }
}

impl Algorithm for AesCipher {
    fn encrypt(&self, file_path: &str) -> Result<String, crate::error::CryptoError> {
        log(
            LogLevel::INFO,
            "AES-GCM",
            &format!("Rozpoczynanie szyfrowania AES-GCM dla pliku: {}", file_path),
        );

        let text =
            std::fs::read(&file_path).map_err(|e| CryptoError::FileReadError(e.to_string()))?;

        log(
            LogLevel::INFO,
            "AES-GCM",
            &format!("Wczytano plik, rozmiar: {} bajtów", text.len()),
        );

        let filename = std::path::Path::new(file_path)
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("");
        let aad = filename.as_bytes();
        let encrypted = aes_gcm_encrypt(&text, aad, &self.key);

        let encrypted_text = encrypted
            .iter()
            .map(|b| format!("{:02x}", b))
            .collect::<String>();

        let encrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_encrypted");
        std::fs::write(&encrypted_path_str, &encrypted_text)
            .map_err(|e| CryptoError::FileWriteError(e.to_string()))?;

        log(
            LogLevel::INFO,
            "AES-GCM",
            &format!(
                "Szyfrowanie zakończone. Zapisano do: {}",
                encrypted_path_str
            ),
        );
        Ok(encrypted_path_str)
    }

    fn decrypt(&self, file_path: &str) -> Result<String, crate::error::CryptoError> {
        log(
            LogLevel::INFO,
            "AES-GCM",
            &format!("Rozpoczynanie deszyfrowania AES-GCM dla pliku: {}", file_path),
        );

        let text = std::fs::read_to_string(&file_path)
            .map_err(|e| CryptoError::FileReadError(e.to_string()))?;

        log(
            LogLevel::INFO,
            "AES-GCM",
            &format!("Wczytano plik, rozmiar: {} bajtów", text.len()),
        );

        let encrypted_bytes: Vec<u8> = (0..text.len())
            .step_by(2)
            .map(|i| u8::from_str_radix(&text[i..i + 2], 16))
            .collect::<Result<Vec<u8>, _>>()
            .map_err(|e| CryptoError::InvalidFormat(format!("Invalid hex format: {}", e)))?;

        let path = std::path::Path::new(file_path);
        let file_stem = path
            .file_stem()
            .and_then(|n| n.to_str())
            .unwrap_or("")
            .replace("_encrypted", "");
        let extension = path.extension().and_then(|e| e.to_str()).unwrap_or("");

        let original_filename = if extension.is_empty() {
            file_stem
        } else {
            format!("{}.{}", file_stem, extension)
        };
        let aad = original_filename.as_bytes();
        let decrypted = aes_gcm_decrypt(&encrypted_bytes, aad, &self.key)
            .map_err(|e| CryptoError::DecryptionError(e.to_string()))?;

        let decrypted_text = decrypted
            .iter()
            .map(|&b| {
                if b.is_ascii() {
                    Ok(b as char)
                } else {
                    Err(CryptoError::InvalidFormat(format!(
                        "Non-ASCII byte found: {}",
                        b
                    )))
                }
            })
            .collect::<Result<String, _>>()?;

        let decrypted_path_str =
            file_handler::create_output_path_with_suffix(file_path, "_decrypted");
        std::fs::write(&decrypted_path_str, &decrypted_text)
            .map_err(|e| CryptoError::FileWriteError(e.to_string()))?;

        log(
            LogLevel::INFO,
            "AES-GCM",
            &format!(
                "Deszyfrowanie zakończone. Zapisano do: {}",
                decrypted_path_str
            ),
        );
        Ok(decrypted_path_str)
    }
}

pub fn sub_bytes(state: &mut State) {
    for i in 0..16 {
        state[i] = SBOX[state[i] as usize];
    }
}

pub fn shift_rows(state: &mut State) {
    let tmp = *state;
    for r in 0..4 {
        for c in 0..4 {
            state[c * 4 + r] = tmp[((c + r) % 4) * 4 + r];
        }
    }
}

pub fn mix_columns(state: &mut State) {
    for c in 0..4 {
        let a0 = state[c * 4 + 0];
        let a1 = state[c * 4 + 1];
        let a2 = state[c * 4 + 2];
        let a3 = state[c * 4 + 3];

        state[c * 4 + 0] = gmul(0x02, a0) ^ gmul(0x03, a1) ^ a2 ^ a3;
        state[c * 4 + 1] = a0 ^ gmul(0x02, a1) ^ gmul(0x03, a2) ^ a3;
        state[c * 4 + 2] = a0 ^ a1 ^ gmul(0x02, a2) ^ gmul(0x03, a3);
        state[c * 4 + 3] = gmul(0x03, a0) ^ a1 ^ a2 ^ gmul(0x02, a3);
    }
}

pub fn add_round_key(state: &mut State, round_key: &[u8; 16]) {
    for i in 0..16 {
        state[i] ^= round_key[i];
    }
}

pub fn key_expansion(key: &[u8]) -> RoundKeys {
    let nk = key.len() / 4;
    let nr = match nk {
        4 => 10,
        _ => panic!("Nieobsługiwany rozmiar klucza AES"),
    };
    let nb = 4;

    let total_words = nb * (nr + 1);
    let mut w: Vec<[u8; 4]> = vec![[0u8; 4]; total_words];

    for i in 0..nk {
        w[i] = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
    }

    for i in nk..total_words {
        let mut temp = w[i - 1];

        if i % nk == 0 {
            temp = sub_word(rot_word(temp));
            temp[0] ^= RCON[i / nk];
        } else if nk > 6 && i % nk == 4 {
            temp = sub_word(temp);
        }

        w[i] = [
            w[i - nk][0] ^ temp[0],
            w[i - nk][1] ^ temp[1],
            w[i - nk][2] ^ temp[2],
            w[i - nk][3] ^ temp[3],
        ];
    }

    let mut round_keys: RoundKeys = Vec::with_capacity(nr + 1);
    for r in 0..=nr {
        let mut round_key = [0u8; 16];
        for i in 0..4 {
            let word = &w[4 * r + i];
            round_key[4 * i] = word[0];
            round_key[4 * i + 1] = word[1];
            round_key[4 * i + 2] = word[2];
            round_key[4 * i + 3] = word[3];
        }
        round_keys.push(round_key);
    }

    round_keys
}

pub fn aes_encrypt_block(plaintext_block: Block, round_keys: &RoundKeys) -> Block {
    let nr = round_keys.len() - 1;
    let mut state = plaintext_block;

    add_round_key(&mut state, &round_keys[0]);

    for round in 1..nr {
        sub_bytes(&mut state);
        shift_rows(&mut state);
        mix_columns(&mut state);
        add_round_key(&mut state, &round_keys[round]);
    }

    sub_bytes(&mut state);
    shift_rows(&mut state);
    add_round_key(&mut state, &round_keys[nr]);

    state
}

/// Mnożenie w GF(2^128) dla GHASH
/// Używa redukcji z polinomem R = 0xe1 << 120 (x^128 + x^7 + x^2 + x + 1)
fn gf128_mul(x: u128, y: u128) -> u128 {
    let mut z = 0u128;
    let mut v = x;
    let mut y_bits = y;

    for _ in 0..128 {
        if (y_bits & 1) == 1 {
            z ^= v;
        }

        let lsb = v & 1;
        v >>= 1;

        if lsb == 1 {
            v ^= 0xe1000000000000000000000000000000u128;
        }

        y_bits >>= 1;
    }

    z
}

fn bytes_to_u128(bytes: &[u8]) -> u128 {
    let mut result = 0u128;
    for i in 0..16 {
        result = (result << 8) | (bytes[i] as u128);
    }
    result
}

fn u128_to_bytes(value: u128) -> [u8; 16] {
    let mut bytes = [0u8; 16];
    for i in 0..16 {
        bytes[15 - i] = ((value >> (i * 8)) & 0xff) as u8;
    }
    bytes
}

/// GHASH: funkcja autentykacji dla GCM
fn ghash(h: u128, aad: &[u8], ciphertext: &[u8]) -> u128 {
    let mut y = 0u128;

    for chunk in aad.chunks(16) {
        let mut block = [0u8; 16];
        block[..chunk.len()].copy_from_slice(chunk);
        let x = bytes_to_u128(&block);
        y = gf128_mul(y ^ x, h);
    }

    for chunk in ciphertext.chunks(16) {
        let mut block = [0u8; 16];
        block[..chunk.len()].copy_from_slice(chunk);
        let x = bytes_to_u128(&block);
        y = gf128_mul(y ^ x, h);
    }

    let aad_bits = (aad.len() as u128) * 8;
    let ct_bits = (ciphertext.len() as u128) * 8;
    let len_block = (aad_bits << 64) | ct_bits;
    y = gf128_mul(y ^ len_block, h);

    y
}

/// Wyprowadza J0 z nonce dla GCM
fn derive_j0(nonce: &[u8], h: u128) -> Block {
    if nonce.len() == 12 {
        let mut j0 = [0u8; 16];
        j0[..12].copy_from_slice(nonce);
        j0[15] = 0x01;
        j0
    } else {
        let ghash_result = ghash(h, &[], nonce);
        let nonce_bits = (nonce.len() as u128) * 8;
        let len_block = nonce_bits;
        let j0_value = gf128_mul(ghash_result ^ len_block, h);
        u128_to_bytes(j0_value)
    }
}

fn inc32(block: &mut Block) {
    let mut counter = u32::from_be_bytes([block[12], block[13], block[14], block[15]]);
    counter = counter.wrapping_add(1);
    let counter_bytes = counter.to_be_bytes();
    block[12..16].copy_from_slice(&counter_bytes);
}

fn constant_time_eq(a: &[u8], b: &[u8]) -> bool {
    if a.len() != b.len() {
        return false;
    }

    let mut result = 0u8;
    for i in 0..a.len() {
        result |= a[i] ^ b[i];
    }

    result == 0
}

pub fn aes_gcm_encrypt(plaintext: &[u8], aad: &[u8], key: &[u8]) -> Vec<u8> {
    log(LogLevel::INFO, "AES-GCM", "Generowanie nonce...");
    let mut rng = rand::thread_rng();
    let mut nonce = [0u8; 12];
    rng.fill(&mut nonce);

    log(LogLevel::INFO, "AES-GCM", "Rozszerzanie klucza...");
    let round_keys = key_expansion(key);

    let zero_block = [0u8; 16];
    let h_block = aes_encrypt_block(zero_block, &round_keys);
    let h = bytes_to_u128(&h_block);

    let j0 = derive_j0(&nonce, h);

    let mut counter_block = j0;
    inc32(&mut counter_block);

    let mut ciphertext = Vec::new();
    let mut current_counter = counter_block;

    log(LogLevel::INFO, "AES-GCM", "Szyfrowanie bloków...");
    for chunk in plaintext.chunks(BLOCK_SIZE) {
        let keystream = aes_encrypt_block(current_counter, &round_keys);

        for i in 0..chunk.len() {
            ciphertext.push(chunk[i] ^ keystream[i]);
        }

        inc32(&mut current_counter);
    }

    log(LogLevel::INFO, "AES-GCM", "Obliczanie GHASH...");
    let s = ghash(h, aad, &ciphertext);

    let ej0 = aes_encrypt_block(j0, &round_keys);
    let ej0_value = bytes_to_u128(&ej0);
    let tag_value = ej0_value ^ s;
    let tag = u128_to_bytes(tag_value);

    let mut result = Vec::new();
    result.extend_from_slice(&nonce);
    result.extend_from_slice(&ciphertext);
    result.extend_from_slice(&tag);

    result
}

pub fn aes_gcm_decrypt(data: &[u8], aad: &[u8], key: &[u8]) -> Result<Vec<u8>, &'static str> {
    if data.len() < 28 {
        return Err("Dane zbyt krótkie dla GCM");
    }

    let nonce = &data[0..12];
    let tag_start = data.len() - 16;
    let ciphertext = &data[12..tag_start];
    let received_tag = &data[tag_start..];

    log(LogLevel::INFO, "AES-GCM", "Rozszerzanie klucza...");
    let round_keys = key_expansion(key);

    let zero_block = [0u8; 16];
    let h_block = aes_encrypt_block(zero_block, &round_keys);
    let h = bytes_to_u128(&h_block);

    let j0 = derive_j0(nonce, h);

    let s = ghash(h, aad, ciphertext);

    let ej0 = aes_encrypt_block(j0, &round_keys);
    let ej0_value = bytes_to_u128(&ej0);
    let expected_tag_value = ej0_value ^ s;
    let expected_tag = u128_to_bytes(expected_tag_value);

    log(LogLevel::INFO, "AES-GCM", "Weryfikacja tagu GCM...");
    if !constant_time_eq(received_tag, &expected_tag) {
        return Err("Weryfikacja autentyczności nie powiodła się");
    }
    log(
        LogLevel::INFO,
        "AES-GCM",
        "Tag poprawny. Deszyfrowanie bloków...",
    );

    let mut counter_block = j0;
    inc32(&mut counter_block);

    let mut plaintext = Vec::new();
    let mut current_counter = counter_block;

    for chunk in ciphertext.chunks(BLOCK_SIZE) {
        let keystream = aes_encrypt_block(current_counter, &round_keys);

        for i in 0..chunk.len() {
            plaintext.push(chunk[i] ^ keystream[i]);
        }

        inc32(&mut current_counter);
    }

    Ok(plaintext)
}

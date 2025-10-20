use crate::error::CryptoError;

pub fn read_file(file_path: &str) -> Result<String, CryptoError> {
    use std::fs;

    fs::read_to_string(file_path).map_err(|e| {
        eprintln!("Błąd odczytu pliku: {}", e);
        CryptoError::from(e)
    })
}

pub fn write_file(file_path: &str, content: &str) -> Result<(), CryptoError> {
    use std::fs;
    use std::io::Write;

    let mut file = fs::File::create(file_path).map_err(|e| {
        eprintln!("Błąd tworzenia pliku: {}", e);
        CryptoError::FileWriteError(format!("Nie można utworzyć pliku: {}", e))
    })?;

    file.write_all(content.as_bytes()).map_err(|e| {
        eprintln!("Błąd zapisu do pliku: {}", e);
        CryptoError::FileWriteError(format!("Nie można zapisać do pliku: {}", e))
    })
}

pub fn create_output_path_with_suffix(input_path: &str, suffix: &str) -> String {
    use std::path::Path;

    let path = Path::new(input_path);
    let file_stem = path.file_stem().unwrap_or_default().to_string_lossy();
    let extension = path.extension().unwrap_or_default().to_string_lossy();
    let parent = path.parent().unwrap_or_else(|| Path::new("."));

    let new_file_name = if extension.is_empty() {
        format!("{}{}", file_stem, suffix)
    } else {
        format!("{}{}.{}", file_stem, suffix, extension)
    };

    parent.join(new_file_name).to_string_lossy().to_string()
}

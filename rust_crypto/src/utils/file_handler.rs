pub fn read_file(file_path: &str) -> Result<String, std::io::Error> {
    use std::fs;

    match fs::read_to_string(file_path) {
        Ok(contents) => Ok(contents),
        Err(e) => {
            eprintln!("Error reading file: {}", e);
            Err(e)
        }
    }
}

pub fn write_file(file_path: &str, content: &str) -> Result<(), std::io::Error> {
    use std::fs;
    use std::io::Write;

    match fs::File::create(file_path) {
        Ok(mut file) => {
            if let Err(e) = file.write_all(content.as_bytes()) {
                eprintln!("Error writing to file: {}", e);
                Err(e)
            } else {
                Ok(())
            }
        }
        Err(e) => {
            eprintln!("Error creating file: {}", e);
            Err(e)
        }
    }
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

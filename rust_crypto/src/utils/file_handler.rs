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

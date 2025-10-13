pub trait Algorithm {
    fn encrypt(&self, file_path: &str) -> Result<String, std::io::Error>;
    fn decrypt(&self, file_path: &str) -> Result<String, std::io::Error>;
}

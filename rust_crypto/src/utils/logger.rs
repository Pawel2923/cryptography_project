use crate::error::CryptoError;
use crate::utils::file_handler::write_file;
use chrono::Local;
use once_cell::sync::Lazy;
use std::fmt;
use std::sync::{Arc, Mutex};

#[derive(Clone, Debug)]
pub enum LogLevel {
    INFO,
    WARN,
    ERROR,
}

impl fmt::Display for LogLevel {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            LogLevel::INFO => "INFO",
            LogLevel::WARN => "WARN",
            LogLevel::ERROR => "ERROR",
        };
        write!(formatter, "{}", s)
    }
}

#[derive(Clone, Debug)]
pub struct LogEntry {
    pub timestamp: chrono::DateTime<Local>,
    pub level: LogLevel,
    pub context: String,
    pub message: String,
}

impl LogEntry {
    pub fn new<L, C, M>(level: L, context: C, message: M) -> Self
    where
        L: Into<LogLevel>,
        C: Into<String>,
        M: Into<String>,
    {
        LogEntry {
            timestamp: chrono::Local::now(),
            level: level.into(),
            context: context.into(),
            message: message.into(),
        }
    }

    pub fn format(&self) -> String {
        format!(
            "[{}] [{}] [{}] {}",
            self.timestamp.format("%Y-%m-%d %H:%M:%S"),
            self.level,
            self.context,
            self.message
        )
    }
}

struct Logger {
    entries: Arc<Mutex<Vec<LogEntry>>>,
}

impl Logger {
    fn new() -> Self {
        Logger {
            entries: Arc::new(Mutex::new(Vec::new())),
        }
    }

    fn log_internal<L, C, M>(&self, level: L, context: C, message: M)
    where
        L: Into<LogLevel>,
        C: Into<String>,
        M: Into<String>,
    {
        let entry = LogEntry::new(level, context, message);
        let mut entries = self.entries.lock().unwrap();
        entries.push(entry);
    }

    fn export_logs_internal(&self, path_prefix: &str) -> Result<(), CryptoError> {
        let filename = format!(
            "{}_{}.log",
            path_prefix,
            Local::now().format("%Y%m%d_%H%M%S")
        );
        let entries = self.entries.lock().unwrap();

        let mut log_content = String::new();
        for entry in entries.iter() {
            log_content.push_str(&entry.format());
            log_content.push('\n');
        }
        write_file(&filename, &log_content)?;
        Ok(())
    }

    fn clear_logs_internal(&self) {
        let mut entries = self.entries.lock().unwrap();
        entries.clear();
    }

    fn get_logs_internal(&self) -> Vec<LogEntry> {
        let entries = self.entries.lock().unwrap();
        entries.clone()
    }
}

static LOGGER: Lazy<Logger> = Lazy::new(|| Logger::new());

pub fn log<L, C, M>(level: L, context: C, message: M)
where
    L: Into<LogLevel>,
    C: Into<String>,
    M: Into<String>,
{
    LOGGER.log_internal(level, context, message);
}

pub fn export_logs(path_prefix: &str) -> Result<(), CryptoError> {
    LOGGER.export_logs_internal(path_prefix)
}

pub fn clear_logs() {
    LOGGER.clear_logs_internal();
}

pub fn get_logs() -> Vec<LogEntry> {
    LOGGER.get_logs_internal()
}

# Historia Zmian

Wszystkie znaczące zmiany w tym projekcie będą dokumentowane w tym pliku.

Format oparty jest na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a projekt stosuje się do [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2025-11-03

### Dodano

#### Frontend (Renderer)

- **Komponent AES-GCM**: Pełny interfejs użytkownika z konfiguracją klucza 128-bitowego
- **Walidacja klucza AES**: Sprawdzanie długości klucza (16 bajtów) i wymóg znaków ASCII
- **Informacje o trybie szyfrowania**: Wyświetlanie informacji o użyciu trybu GCM (Galois/Counter Mode) z autentykacją
- **Ikona zamka**: Nowa ikona dla algorytmu AES-GCM w interfejsie użytkownika

#### API (Proces Główny)

- **Obsługa algorytmu AES-GCM**: Integracja nowego algorytmu szyfrowania symetrycznego z autentykacją

#### Rust Crypto (Natywny Moduł)

- **AES-128 w trybie GCM**: Pełna implementacja Advanced Encryption Standard z 128-bitowym kluczem
  - Tryb GCM (Galois/Counter Mode) zapewniający szyfrowanie i autentykację (AEAD)
  - Automatyczna generacja losowego nonce (12 bajtów) dla każdej operacji szyfrowania
  - Funkcja GHASH dla autentykacji danych
  - Obsługa dodatkowych danych autentykowanych (AAD) - nazwa pliku
  - Weryfikacja integralności i autentyczności podczas deszyfrowania
  - Bezpieczne porównanie tagów autentykacji (constant-time comparison)
- **Kluczowe funkcje AES**:
  - `key_expansion`: Rozszerzanie klucza na klucze rundowe
  - `sub_bytes`: Podstawienie bajtów przy użyciu S-Box
  - `shift_rows`: Przesunięcie wierszy w macierzy stanu
  - `mix_columns`: Mieszanie kolumn z użyciem mnożenia w GF(2^8)
  - `add_round_key`: XOR z kluczem rundowym
- **Funkcje GCM**:
  - `gf128_mul`: Mnożenie w ciele Galois GF(2^128)
  - `ghash`: Funkcja haszująca dla autentykacji
  - `derive_j0`: Wyprowadzanie wartości początkowej licznika z nonce
  - `inc32`: Inkrementacja 32-bitowego licznika
  - `aes_gcm_encrypt`: Szyfrowanie z autentykacją
  - `aes_gcm_decrypt`: Deszyfrowanie z weryfikacją autentyczności
- **Moduły pomocnicze**:
  - `aes_constants.rs`: Tablice S-Box, RCON i stałe rozmiaru bloku
  - `aes_helpers.rs`: Funkcje pomocnicze (rot_word, sub_word, gmul)
- **Format wyjściowy**: Nonce (12 B) + Szyfrogram + Tag autentykacji (16 B) w formacie heksadecymalnym
- **Bezpieczeństwo**:
  - Kryptograficznie bezpieczny generator liczb losowych dla nonce
  - Weryfikacja autentyczności przed deszyfrowaniem
  - Ochrona przed atakami timing poprzez constant-time comparison

### Ulepszone

#### Rust Crypto (Natywny Moduł)

- **Rozszerzony adapter algorytmów**: Dodano obsługę AES-GCM w AlgorithmAdapter

---

## [1.1.0] - 2025-10-20

### Dodano

#### Frontend (Renderer)

- **Komponent szyfru Vigenere'a**: Pełny interfejs użytkownika z konfiguracją klucza
- **Komponent szyfru z Kluczem Bieżącym**: Interfejs do szyfrowania z kluczem o długości tekstu
- **Wybór operacji na stronie algorytmów**: Możliwość zmiany typu operacji (szyfrowanie/deszyfrowanie) bez powrotu do strony głównej
- **Przewijanie pionowe**: Automatyczne przewijanie dla zbyt dużych komponentów
- **Funkcja utility getAlgorithmComponent**: Dynamiczne ładowanie komponentów dodanych algorytmów
- **Ulepszone komunikaty o błędach**: Szczegółowe informacje zwrotne dla użytkownika w przypadku niepowodzeń operacji

#### API (Proces Główny)

- **Typ Result**: System obsługi wyników operacji z bezpiecznym typowaniem
- **Walidacja kluczy**: Sprawdzanie poprawności kluczy przed przetwarzaniem
- **Długość zawartości pliku**: Dodanie informacji o rozmiarze danych w FileData

#### Rust Crypto (Natywny Moduł)

- **Szyfr Vigenere'a**: Pełna implementacja algorytmu wieloalfabetowego
- **Szyfr z Kluczem Bieżącym (Running Key Cipher)**: Implementacja szyfrowania z kluczem jednorazowym
- **CryptoError**: Dedykowany typ błędów dla operacji kryptograficznych:
  - Obsługa błędów plików (odczyt/zapis/brak pliku)
  - Błędy walidacji klucza
  - Błędy nieobsługiwanych algorytmów
- **Ulepszona obsługa błędów**: Integracja Result utility we wszystkich operacjach na plikach i algorytmach

### Naprawiono

- Literówkę w placeholderze pola klucza

---

## [1.0.0] - 2025-10-13

### Dodano

#### Frontend (Renderer)

- **Nawigacja React Router**: Zaimplementowano routing po stronie klienta z oddzielnymi ścieżkami dla procesów szyfrowania i odszyfrowywania
- **Nowoczesny Framework UI**: Zbudowany z React 19, TypeScript i Vite dla szybkiego rozwoju i optymalnej wydajności
- **Stylowanie TailwindCSS**: Responsywny i nowoczesny interfejs użytkownika z frameworkiem CSS
- **Architektura SPA z routingiem**:
  - Strona główna z wyborem operacji (szyfrowanie/deszyfrowanie)
  - Strona wyboru algorytmów kryptograficznych
  - Strony konfiguracji poszczególnych algorytmów
  - Strona wyników do wyświetlania przetworzonych plików
- **Interfejs Obsługi Plików**: Przyjazny użytkownikowi interfejs wyboru i przetwarzania plików
- **Dynamiczne Tytuły Stron**: Kontekstowe tytuły okien zmieniające się w zależności od bieżącej operacji
- **Wsparcie Trybu Ciemnego**: Interfejs dostosowujący się do preferencji systemu operacyjnego użytkownika

#### API (Proces Główny)

- **Framework Electron**: Wieloplatformowa aplikacja desktopowa zbudowana w Electron
- **Integracja Systemu Plików**: Bezpieczna obsługa plików z odpowiednim zarządzaniem ścieżkami
- **Komunikacja IPC**: Komunikacja między procesami renderer i main
- **Wsparcie Auto-updater**: Wbudowane wsparcie dla automatycznych aktualizacji aplikacji
- **Ikony Specyficzne dla Platform**: Niestandardowe ikony aplikacji dla Windows (.ico), macOS (.icns) i Linux (.png)
- **Konfiguracja Bezpieczeństwa**: Odpowiednia Content Security Policy i uprawnienia macOS
- **Narzędzia Deweloperskie**: Hot Module Replacement (HMR) dla efektywnego przepływu pracy

#### Rust Crypto (Natywny Moduł)

- **Natywna Wydajność**: Wysokowydajne operacje kryptograficzne używające Rust
- **Integracja NAPI**: Operacja między JavaScript-Rust używając Node-API
- **Implementacja Wzorca Adapter**: Czysta architektura z projektowaniem opartym na trait dla rozszerzalnego wsparcia algorytmów
- **Implementacja Szyfru Cezara**: Pełna implementacja algorytmu szyfru Cezara z:
  - Konfigurowalnymi wartościami przesunięcia
  - Wsparciem dla szyfrowania i deszyfrowania
  - Odpowiednią obsługą znaków alfabetycznych
  - Zachowaniem znaków niealfabetycznych
- **Przetwarzanie Plików**: Natywne możliwości czytania i zapisywania plików
- **Architektura Modularna**:
  - Definicje trait dla algorytmów kryptograficznych
  - Oddzielne moduły algorytmów dla łatwego rozszerzania
  - Moduły utility do obsługi plików

### Szczegóły Techniczne

#### System Budowania

- **Electron Builder**: Profesjonalne pakowanie aplikacji dla wszystkich platform
- **Wsparcie TypeScript**: Pełne wsparcie TypeScript dla procesów main, renderer i preloader
- **Wielokrotne Cele Budowania**: Wsparcie dla instalatora NSIS (Windows), DMG (macOS) i AppImage (Linux)
- **Środowisko Deweloperskie**: Zoptymalizowane ustawienia rozwoju z live reloading

#### Zależności

- React 19 z wsparciem TypeScript
- React Router dla nawigacji po stronie klienta
- TailwindCSS do stylowania
- Electron z integracją Vite
- Rust z NAPI-RS dla modułów natywnych

#### Struktura Plików

- Czyste oddzielenie między procesem głównym, procesem renderer i modułami natywnymi
- Zorganizowana struktura komponentów w renderer
- Modularny kod Rust z jasnym rozdzieleniem obowiązków

### Instalacja

- Windows: Uruchom dostarczony plik wykonywalny Setup

---

## Wytyczne dla CHANGELOG.md

Przy aktualizowaniu tego changelog:

1. **Frontend (Renderer)**: Dokumentuj zmiany UI/UX, nowe komponenty React, aktualizacje routingu, ulepszenia stylowania
2. **API (Proces Główny)**: Dokumentuj zmiany procesu głównego Electron, aktualizacje IPC, integrację systemu plików, ulepszenia bezpieczeństwa
3. **Rust Crypto (Natywny Moduł)**: Dokumentuj nowe algorytmy kryptograficzne, optymalizacje wydajności, rozszerzenia wzorca adapter, zmiany natywnego API

Każda sekcja powinna skupiać się na zmianach widocznych dla użytkownika i ulepszeniach technicznych istotnych dla danej warstwy aplikacji.

# Historia Zmian

Wszystkie znaczące zmiany w tym projekcie będą dokumentowane w tym pliku.

Format oparty jest na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a projekt stosuje się do [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [Niewydane]

#### Dodano

##### Frontend (Renderer)

- [ ] Strona przetwarzania

##### API (Proces Główny)

- [ ] Śledzenie obecnego stanu przetwarzania pliku

##### Rust Crypto (Natywny Moduł)

- [ ] Nowe algorytmy kryptograficzne
- [ ] Wysyłanie informacji o stanie przetwarzania pliku

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

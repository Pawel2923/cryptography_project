# Aplikacja szyfrująca (Electron + Rust)

Aplikacja okienkowa stworzona w technologii **Electron** (z wykorzystaniem **React** i **TypeScript**) do szyfrowania i deszyfrowania tekstu oraz plików tekstowych.
Projekt stanowi bazę do dalszej rozbudowy o kolejne algorytmy kryptograficzne.
Pierwszym zaimplementowanym algorytmem jest **szyfr Cezara**.

---

## Opis projektu

Aplikacja umożliwia:

- szyfrowanie i deszyfrowanie **wprowadzonego tekstu**,
- szyfrowanie i deszyfrowanie **plików tekstowych (.txt)**,
- zapisanie wyników do pliku lub ich podgląd bezpośrednio w interfejsie,
- wybór liczby przesunięć (klucza szyfru Cezara).

Dzięki modularnej architekturze aplikacja pozwala na łatwe dodawanie kolejnych algorytmów kryptograficznych.

---

## Szyfr Cezara

**Szyfr Cezara** to jeden z najprostszych klasycznych algorytmów kryptograficznych.
Działa poprzez przesunięcie każdej litery tekstu o określoną liczbę pozycji w alfabecie.

### Przykład

Dla klucza `3`:

```
A → D
B → E
C → F
...
X → A
Y → B
Z → C
```

Dla deszyfrowania klucz jest odwracany (np. `-3`).

Aplikacja obsługuje zarówno **wielkie**, jak i **małe litery** alfabetu ASCII.

---

## Technologie

- **Electron** — środowisko uruchomieniowe aplikacji desktopowych
- **Electron-Vite** — szybkie bundlowanie kodu (frontend + backend)
- **React + TypeScript** — interfejs użytkownika
- **Rust (napi-rs)** — moduł natywny do szyfrowania i deszyfrowania
- **electron-builder** — tworzenie gotowych instalatorów aplikacji

---

## Struktura projektu

```
cryptography_project/
├─ rust_crypto/ # moduł natywny Rust i kod źródłowy
├─ src/
│ ├─ main/ # proces główny Electron
│ ├─ preload/ # skrypt preloader
│ ├─ renderer/ # interfejs React
├─ release/ # gotowe instalatory
├─ package.json
├─ electron.vite.config.ts
├─ README.md
├─ LICENSE.md
├─ CHANGELOG.md
├─ ...
```

---

## Uruchamianie projektu

### Tryb deweloperski

```bash
npm install
npm run dev
```

### Budowanie wersji produkcyjnej

```bash
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:linux # Linux
```

Gotowa aplikacja pojawi się w folderze `release/`.

## Architektura

| Warstwa              | Opis                                                         |
| -------------------- | ------------------------------------------------------------ |
| **Renderer (React)** | Interfejs graficzny i obsługa użytkownika                    |
| **Main (Electron)**  | Logika aplikacji, obsługa plików, komunikacja z modułem Rust |
| **Native (Rust)**    | Implementacja algorytmów szyfrowania/deszyfrowania           |

Dzięki wykorzystaniu Rust jako modułu natywnego, aplikacja zapewnia:

- wysoką wydajność,
- bezpieczeństwo pamięci,
- łatwe rozszerzanie o nowe algorytmy.

## Licencja

Projekt jest dostępny na licencji MIT. Szczegóły w pliku `LICENSE.md`.

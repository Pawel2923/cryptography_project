# Aplikacja szyfrująca (Electron + Rust)

Aplikacja okienkowa stworzona w technologii **Electron** (z wykorzystaniem **React** i **TypeScript**) do szyfrowania i deszyfrowania tekstu oraz plików tekstowych.
Projekt stanowi bazę do dalszej rozbudowy o kolejne algorytmy kryptograficzne.
Zaimplementowane algorytmy: **szyfr Cezara**, **szyfr Vigenere'a**, **szyfr z Kluczem Bieżącym (Running Key Cipher)** oraz **AES-GCM**.

---

## Opis projektu

Aplikacja umożliwia:

- szyfrowanie i deszyfrowanie **wprowadzonego tekstu**,
- szyfrowanie i deszyfrowanie **plików tekstowych (.txt)**,
- zapisanie wyników do pliku lub ich podgląd bezpośrednio w interfejsie,
- konfigurację kluczy/parametrów algorytmów (np. przesunięcie dla Cezara, klucz dla Vigenere'a).

Dzięki modularnej architekturze aplikacja pozwala na łatwe dodawanie kolejnych algorytmów kryptograficznych.

---

## Szyfr Cezara

**Szyfr Cezara** to jeden z najprostszych klasycznych algorytmów kryptograficznych.
Działa poprzez przesunięcie każdej litery tekstu o określoną liczbę pozycji w alfabecie.

### Przykład (Cezar)

Dla klucza `3`:

```text
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

## Szyfr Vigenere'a

Szyfr Vigenere'a to wieloalfabetowy szyfr podstawieniowy, w którym każda litera tekstu jawnego jest przesuwana o wartość odpowiadającą literze klucza (klucz powtarza się cyklicznie).
Zapewnia większą odporność na analizę częstotliwości niż szyfr Cezara.

### Przykład (Vigenere)

Dla tekstu `TAJNA WIADOMOSC` i klucza `KOT`:

```text
Tekst:     TAJNA WIADOMOSC
Klucz:     KOTKO TKOTKOTKO
Rezultat: DOCXO PSOWYAHCQ
```

---

## Szyfr z Kluczem Bieżącym (Running Key Cipher)

Wariant szyfru Vigenere'a, w którym klucz ma długość co najmniej równą tekstowi (np. fragment książki/gazety) i nie powtarza się.
Każda litera jest przesuwana o odpowiadającą jej literę długiego klucza, co utrudnia analizę częstotliwości.

### Przykład (Klucz bieżący)

Dla tekstu `TAJNA WIADOMOSC` i klucza `LOREMIPSUMDOLOR` (pierwsze 12 znaków):

```text
Tekst:     TAJNA WIADOMOSC
Klucz:     LOREMIPSUMDOLOR
Rezultat: EOARM EXSXAPCDQ
```

---

## AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)

**AES-GCM** to nowoczesny symetryczny algorytm szyfrowania blokowego z autentykacją (AEAD - Authenticated Encryption with Associated Data).
Łączy szyfrowanie AES w trybie licznikowym (CTR) z funkcją autentykacji GHASH opartą na ciele Galois.

### Cechy AES-GCM

- **Rozmiar klucza**: 128 bitów (16 bajtów)
- **Tryb**: GCM (Galois/Counter Mode)
- **Autentykacja**: AEAD - szyfrowanie z weryfikacją integralności
- **Nonce**: 12 bajtów, generowany losowo dla każdej operacji
- **Tag autentykacji**: 16 bajtów (128 bitów)
- **Dodatkowe dane autentykowane (AAD)**: Nazwa pliku

### Jak działa?

1. **Szyfrowanie**:
   - Generowany jest losowy nonce (12 bajtów)
   - Tekst jawny jest szyfrowany w trybie licznikowym (CTR)
   - Obliczany jest tag autentykacji GHASH dla szyfrogramu i AAD
   - Wynik: nonce + szyfrogram + tag (format heksadecymalny)

2. **Deszyfrowanie**:
   - Odczytywany jest nonce, szyfrogram i tag z danych wejściowych
   - Obliczany jest oczekiwany tag autentykacji
   - Weryfikacja autentyczności (porównanie tagów w czasie stałym)
   - Jeśli weryfikacja się powiedzie, tekst jest deszyfrowany
   - W przypadku niepowodzenia weryfikacji, deszyfrowanie jest przerywane

### Bezpieczeństwo

- **Kryptograficznie bezpieczny generator liczb losowych** dla nonce
- **Weryfikacja autentyczności** przed deszyfrowaniem chroni przed modyfikacją danych
- **Constant-time comparison** tagów autentykacji zapobiega atakom timing
- **Unikalny nonce** dla każdej operacji szyfrowania zapewnia bezpieczeństwo

### Przykład

Dla tekstu `TAJNA WIADOMOSC` i klucza `1234567890123456`:

```text
Szyfrowanie:
  Tekst jawny: TAJNA WIADOMOSC
  Klucz:       1234567890123456 (16 bajtów)
  Nonce:       [losowo generowany, 12 bajtów]
  Wynik:       [nonce][szyfrogram][tag] (format hex)

Deszyfrowanie:
  Wejście:     [nonce][szyfrogram][tag]
  Weryfikacja: Tag autentykacji
  Wynik:       TAJNA WIADOMOSC (jeśli weryfikacja się powiodła)
```

---

## Technologie

- **Electron** — środowisko uruchomieniowe aplikacji desktopowych
- **Electron-Vite** — szybkie bundlowanie kodu (frontend + backend)
- **React + TypeScript** — interfejs użytkownika
- **Rust (napi-rs)** — moduł natywny do szyfrowania i deszyfrowania
- **electron-builder** — tworzenie gotowych instalatorów aplikacji

---

## Struktura projektu

```text
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

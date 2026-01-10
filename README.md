# Board Games Rental

Aplikacja do zarządzania wypożyczalnią gier planszowych.

## Spis treści

- [Opis](#opis)
- [Funkcjonalności](#funkcjonalności)
- [Technologie](#technologie)
- [Uruchamianie projektu](#uruchamianie-projektu)
- [Struktura katalogów](#struktura-katalogów)
- [Autorzy](#autor)

## Opis

Board Games Rental to aplikacja webowa umożliwiająca zarządzanie bazą gier planszowych, użytkownikami oraz wypożyczeniami. Projekt składa się z frontendowej aplikacji w Next.js oraz backendu w NestJS.

## Funkcjonalności

- Przeglądanie i wyszukiwanie gier planszowych
- Dodawanie, edycja i usuwanie gier (dla uprawnionych użytkowników)
- Zarządzanie wypożyczeniami (wypożyczanie, zwroty)
- Rejestracja i logowanie użytkowników
- Zarządzanie użytkownikami i ich uprawnieniami (dla administratora)
- Obsługa wielu języków (i18n)
- Strumieniowanie danych (SSE) dla gier i wypożyczeń

## Technologie

- **Frontend:** Next.js, React, TypeScript, TailwindCSS
- **Backend:** NestJS, TypeORM, MySQL
- **Inne:** Docker, ESLint

## Uruchamianie projektu

### Wymagania

- Node.js (>=18)
- Docker & Docker Compose
- MySQL (jeśli nie korzystasz z Dockera)

### Szybki start (Docker Compose)

1. Stwórz pliki `.env` i `dev.env` oraz uzupełnij wymagane zmienne środowiskowe.<br>
   `dev.env`
   ```sh
   DB_PASS = 
   DB_NAME = 
   DB_HOST = 
   DB_USER = 
   DB_PORT = 
   AD_EMAIL = 
   AD_PASS = 
   JWT_SEC = 
   ```
   `.env`
   ```sh
   NEXT_PUBLIC_API_URL = http://localhost/api/
   NEXT_PUBLIC_WS_URL = http://localhost:8080/
   ```
3. Uruchom w katalogu głównym:

   ```sh
   docker-compose up --build
   ```

4. Frontend będzie dostępny domyślnie na [http://localhost:3000](http://localhost:3000), backend na [http://localhost:3001](http://localhost:3001).

### Ręczne uruchomienie

#### Backend

```sh
cd rental-api
npm install
npm start
```

#### Frontend

```sh
cd front
npm install
npm run dev
```

## Struktura katalogów

```
.
├── front/         # Next.js frontend
│   ├── src/
│   ├── public/
│   └── ...
├── rental-api/    # NestJS backend
│   ├── src/
│   └── ...
├── docker-compose.yml
└── README.md
```

## Autorzy

- [Vladys Berezhnyi](https://github.com/WladekBBC)
- [Tymoteusz Huszcza](https://github.com/TymoteuszMH)

---

Projekt typu pet project.

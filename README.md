# Board Games Rental

Aplikacja do zarządzania wypożyczalnią gier planszowych.

## Spis treści

- [Opis](#opis)
- [Funkcjonalności](#funkcjonalności)
- [Technologie](#technologie)
- [Uruchamianie projektu](#uruchamianie-projektu)
- [Struktura katalogów](#struktura-katalogów)
- [Autor](#autor)

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

1. Skopiuj pliki `.env` i `dev.env` oraz uzupełnij wymagane zmienne środowiskowe.
2. Uruchom w katalogu głównym:

   ```sh
   docker-compose up --build
   ```

3. Frontend będzie dostępny domyślnie na [http://localhost:3000](http://localhost:3000), backend na [http://localhost:3001](http://localhost:3001).

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

## Autors

- [Vladys Berezhnyi](https://github.com/WladekBBC)
- [Tymoteusz Huszcza](https://github.com/TymoteuszMH)

---

Projekt typu pet project.

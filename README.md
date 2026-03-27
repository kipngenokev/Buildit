# Buildit

Buildit is a fullstack modular-monolith online store for premium hardware products. It includes:

- **Backend**: Java 17 + Spring Boot + MySQL (with JPA)
- **Frontend**: React + Vite
- **Catalog focus**: sinks, tiles, kitchen/bathroom taps, and showers with clear, detailed product descriptions

## Project structure

- `/backend` Spring Boot API and catalog module
- `/frontend` React storefront UI

## Backend setup (Spring Boot + MySQL)

1. Ensure MySQL is running locally.
2. Optionally set environment variables:
   - `DB_URL` (default: `jdbc:mysql://localhost:3306/buildit_store?...`)
   - `DB_USERNAME` (default: `root`)
   - `DB_PASSWORD` (default: `password`)
   - `PORT` (default: `8080`)

Run backend:

```bash
cd backend
mvn spring-boot:run
```

Tests:

```bash
cd backend
mvn test
```

## Frontend setup (React)

Install and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `/api/products` and proxies to `http://localhost:8080` in development. If backend is unavailable, the UI uses a fallback catalog so the store remains demonstrable.

Frontend tests:

```bash
cd frontend
npm test
```

## API endpoints

- `GET /api/products` - full catalog list
- `GET /api/products/categories` - grouped products by category

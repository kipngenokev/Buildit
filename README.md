# Buildit

Buildit is a fullstack modular-monolith MVP online store for premium hardware products.

## Architecture

- **Backend** (`/backend`): Java 17 + Spring Boot + MySQL (JPA)
- **Frontend** (`/frontend`): React + Vite
- **Modules**:
  - Product catalog (view products and grouped categories)
  - Authentication (registration, login, JWT)
  - Authorization (role-based access: `ROLE_USER`, `ROLE_ADMIN`)
  - OAuth2 login integration point (Google)
  - Cart (authenticated users can add/view cart items)
  - API docs (Swagger/OpenAPI)

## Backend setup (Spring Boot + MySQL)

1. Ensure MySQL is running locally.
2. Optional environment variables:
   - `DB_URL` (default: `jdbc:mysql://localhost:3306/buildit_store?...`)
   - `DB_USERNAME` (default: `root`)
   - `DB_PASSWORD` (default: `password`)
   - `PORT` (default: `8080`)
   - `JWT_SECRET` (default: `buildit-super-secret-jwt-signing-key-2026`)
   - `JWT_TTL_SECONDS` (default: `3600`)
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (required only when enabling Google OAuth2 login)

Run backend:

```bash
cd backend
mvn spring-boot:run
```

Run backend tests:

```bash
cd backend
mvn test
```

### Swagger/OpenAPI

When the backend is running:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Frontend setup (React)

Install and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `/api/products` and proxies to `http://localhost:8080` in development.

Run frontend tests:

```bash
cd frontend
npm test
```

## MVP API endpoints

### Authentication

- `POST /api/auth/register` - register user and return JWT
- `POST /api/auth/login` - authenticate user and return JWT
- `GET /api/auth/me` - current authenticated user info (JWT required)

### OAuth2

- `GET /oauth2/authorization/google` - start OAuth2 login flow (when Google OAuth credentials are configured)

### Product catalog

- `GET /api/products` - list all products
- `GET /api/products/categories` - list products grouped by category

### Cart

- `GET /api/cart` - get current user cart (JWT required)
- `POST /api/cart` - add a product to cart (JWT required)

### Admin sample endpoint

- `GET /api/admin/health` - admin-only endpoint (`ROLE_ADMIN`)

## Security model

- JWT bearer tokens are required for protected endpoints.
- Role-based authorization:
  - `ROLE_USER` / `ROLE_ADMIN` can access `/api/cart/**` and `/api/auth/me`
  - only `ROLE_ADMIN` can access `/api/admin/**`
- Passwords are hashed with BCrypt before persistence.

## Default seeded user

An admin user is seeded automatically on startup:

- Email: `admin@buildit.local`
- Password: `AdminPass123!`
- Role: `ROLE_ADMIN`

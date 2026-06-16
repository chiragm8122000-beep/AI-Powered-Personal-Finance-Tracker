# Personal Finance Tracker Backend

Interview-assignment-ready Spring Boot backend for a personal finance tracker.

## Tech Stack

- Java 17
- Spring Boot 3.3.0
- Spring Security
- JWT
- Spring Data JPA
- MySQL
- Maven
- Lombok

## Features

- User register/login with JWT
- Add, update, delete, and list transactions
- Monthly category budgets
- Dashboard summary
- Budget vs actual comparison
- Expense breakdown by category
- User-specific secured data

## Run Locally

1. Create MySQL database:

```sql
CREATE DATABASE finance_tracker;
```

2. Update DB credentials in:

```text
src/main/resources/application.yml
```

3. Start backend:

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

## Auth APIs

### Register

```http
POST /api/auth/register
```

```json
{
  "name": "Chirag",
  "email": "chirag@test.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
```

```json
{
  "email": "chirag@test.com",
  "password": "password123"
}
```

Use returned token:

```text
Authorization: Bearer <token>
```

## Transaction APIs

```http
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/{id}
DELETE /api/transactions/{id}
```

Example:

```json
{
  "amount": 500,
  "description": "Lunch",
  "category": "FOOD",
  "type": "EXPENSE",
  "transactionDate": "2026-06-16"
}
```

## Budget APIs

```http
GET    /api/budgets?month=2026-06
POST   /api/budgets
PUT    /api/budgets/{id}
DELETE /api/budgets/{id}
```

Example:

```json
{
  "category": "FOOD",
  "limitAmount": 10000,
  "month": "2026-06"
}
```

## Dashboard API

```http
GET /api/dashboard/summary?month=2026-06
```

## Technical Decisions

- JWT authentication was chosen because it is faster and simpler than Google OAuth for a 2-hour MVP.
- MySQL is used because finance data is relational and requires structured querying.
- BigDecimal is used for money values instead of Double to avoid precision issues.
- Budget is unique by user, category, and month to prevent duplicate category budgets.
- Dashboard calculations are performed in service layer to keep controllers thin.

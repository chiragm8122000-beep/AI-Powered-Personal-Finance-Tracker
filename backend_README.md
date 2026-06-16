# Personal Finance Tracker - Backend

A production-ready Spring Boot backend for the Personal Finance Tracker application.

## Tech Stack
- Java 17
- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- Lombok
- JUnit 5

## Features
### Authentication
- User Registration
- User Login
- JWT Authentication
- BCrypt Password Encryption

### Transaction Management
- Add/Edit/Delete Transactions
- Income & Expense Tracking
- Category Management

### Budget Management
- Monthly Budgets
- Category-wise Budgets
- Budget Validation

### Dashboard
- Total Income
- Total Expense
- Balance
- Remaining Budget
- Budget vs Actual

## Run

```bash
mvn clean install
mvn spring-boot:run
```

Backend URL:
http://localhost:8080

## APIs
- POST /api/auth/register
- POST /api/auth/login
- GET/POST/PUT/DELETE /api/transactions
- GET/POST/PUT/DELETE /api/budgets
- GET /api/dashboard/summary

## Unit Tests

```bash
mvn test
```

## Future Improvements
- Google OAuth
- Swagger
- Docker
- Redis
- Refresh Tokens

Author: Chirag Mahajan

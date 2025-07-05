# NestJS Practice Project

This is a simple RESTful API built with **NestJS**, **TypeORM**, and **PostgreSQL**, designed as a learning project. It supports user authentication, authorization, and CRUD operations for posts. Database management is done using **pgAdmin 4**.

## 📦 Features

- User registration and login
- JWT-based authentication
- Role-based authorization (admin, user)
- CRUD operations for posts (create, read, update, delete)
- Validation using `class-validator`
- Rate limiting using NestJS throttler
- Modular architecture with separate modules for authentication and posts
- Guards and custom decorators

## 🚀 Getting Started

1. Clone the repo  
   `git clone https://github.com/AK08/nestjs-typeorm-api.git`

2. Install dependencies  
   `npm install`

3. Set up `.env` file with the following variables:

   ```env
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=yourpassword
   DB_NAME=nestjs_project
   ```

4. Run the app
   ```bash
   npm run start:dev
   ```

The server will start on [http://localhost:3000](http://localhost:3000) by default.

# jwt-auth

A basic authentication & authorization example using JWT (JSON Web Tokens).

## Description

This project demonstrates a simple implementation of user authentication and authorization using JWT in a Node.js/Express environment.  It includes features such as user registration (not implemented but planned), login, protected routes, and role-based access control.  Error handling and logging are also included.

## Features

* **JWT Authentication:** Securely authenticate users using JSON Web Tokens.
* **Role-Based Authorization:** Restrict access to specific routes based on user roles (Admin, User, Dev).
* **Error Handling:** Provides custom error classes and middleware for consistent error responses.
* **Logging:** Uses a logger for tracking requests, responses, and errors.
* **Environment Variables:** Configuration through `.env` files for easy customization.


## Getting Started

### Prerequisites

* Node.js and npm (or yarn) installed.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/googleknight/jwt-auth.git
cd jwt-auth
```

2. Install dependencies:

```bash
npm install
```

3. Configuration

* Create a `.env` file in the root directory and copy the contents of `.env.example` into it.  Update the `JWT_SECRET` with a strong, randomly generated secret key.

4. Start the development server:

```bash
npm run dev
```

The server should now be running on `http://localhost:3000`.  The API endpoints are prefixed with `/api`.

## Docker

### Build and serve

```bash
docker-compose up --build -d
```

### Stop and remove container
```bash
 docker-compose down
 ```

## API Endpoints


* `/api/users`:  (GET) Retrieves a list of users (requires authentication and admin role).
* `/api/login`: (POST)  Logs in a user and returns a JWT.


## Testing

Tests are written using Jest. To run the tests:

```bash
npm test
```



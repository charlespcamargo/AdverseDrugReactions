
# FDA Drug Adverse Reactions API

This project is a Node.js API that allows users to log in using JWT and query adverse reactions to drugs from the FDA's external API.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Using Swagger](#using-swagger)
- [Docker Setup](#docker-setup)
- [Development](#development)
- [Contributing](#contributing)

---

## Features

- **JWT Authentication**: Secure login with JWT tokens.
- **FDA API Integration**: Query FDA drug adverse reactions.
- **Swagger Documentation**: API documentation.
- **Docker Support**: Easily containerize and run the application. 

---

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 20.x or later)
- [npm](https://www.npmjs.com/) (usually installed with Node.js)
- [Docker](https://www.docker.com/get-started) (if using Docker)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/charlespcamargo/fda-drug-api.git
cd fda-drug-api
```

### 2. Install dependencies

```bash
npm install
```

---

## Running the Application

### 1. Using Node.js

To start the app using Node.js:

```bash
npm run dev
```

This will start the application in development mode with Nodemon.

The app will run on `http://localhost:3000`.

### 2. Using Docker

To build and run the application in a Docker container:

1. Build the Docker image:

   ```bash
   docker build -t fda-drug-api .
   ```

2. Run the container:

   ```bash
   docker run -p 3000:3000 fda-drug-api
   ```

The API will be accessible on `http://localhost:3000`.

---

## API Endpoints

The API provides the following main endpoints:

### **Authentication**

- `POST /auth/login`
  - Request body:
    ```json
    {
      "username": "your-username",
      "password": "your-password"
    }
    ```
  - Response:
    ```json
    {
      "token": "jwt-token-here"
    }
    ```

### **Drug Reactions**

- `GET /drugs/reactions?drugName=<drug>`
  - Query parameters: `drugName` (required)
  - Headers: `Authorization: Bearer <jwt-token>`
  - Response:
    ```json
    {
      "drugName": "Vimizim",
      "reactions": [
                      {
                        "reactionName": "Headache",
                        "total": 229
                      },
                      {
                        "reactionName": "PYREXIA",
                        "total": 614
                      },
                      ...
                   ]
    }
    ```

---

## Environment Variables

This application uses environment variables to configure API keys, ports, and other settings. Here's a list of the expected variables, which should be stored in a `.env` file:

- `PORT`: The port the application will run on. Default is `3000`.
- `FDA_API_URL`: The base URL for the FDA API.
- `JWT_SECRET`: The secret key used to sign JWT tokens.

Example `.env` file:

```bash
PORT=3000
FDA_API_URL=https://api.fda.gov
JWT_SECRET=jwt_secret_key
```

---

## Using Swagger

After starting the application, you can access the Swagger documentation at:

```
http://localhost:3000/docs
```

Here, you can log in and make authenticated requests directly from the browser.

---

## Docker Setup

### Build and Run

1. **Build the Docker image**:
   ```bash
   docker build -t fda-drug-api .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 fda-drug-api
   ```

### Docker Compose

You can also run the app using `docker-compose`. First, ensure you have a `docker-compose.yml` file like this:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
```

Then run:

```bash
docker-compose up
```

---

## Development

For local development, you can use Nodemon, which will automatically restart the server when changes are made to the source code.

```bash
npm run dev
``` 

## Contact

For any questions or feedback, feel free to reach out:

- **Email**: charlespcamargo@gmail.com
- **GitHub**: [charlespcamargo](https://github.com/charlespcamargo)
# Weather API

## Description

This API provides weather data, forecasts, alerts, and user management functionalities.

## Installation

To get started install the dependencies.

```bash

npm install
```

## DataBase Creation

Copy and Exceute `Project.sql` script in MySQL Workbench or any other MySQL client to create the database and tables for the project.

## Environment Variables

Create a `.env` file in the root directory of the project with the following structure:

```plaintext
PORT=3000
OPENWEATHER_API_KEY=your_openweather_api_key
DB_HOST=localhost
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=weather_db
JWT_SECRET=your_jwt_secret_key
```

Replace `your_openweather_api_key`, `your_database_username`, `your_database_password`, and `your_jwt_secret_key` with your respective API keys, database credentials, and JWT secret key.

## Running the Server

To run the server, use the following command:

```bash
npm start
```

The server will start at `http://localhost:3000`.

## API Documentation

For API documentation, you can access the Swagger UI at:

```
http://localhost:3000/docs
```

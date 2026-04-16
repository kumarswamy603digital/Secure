-- Create the database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS secrets;

-- Connect to the secrets database
-- \c secrets;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Optional: Display all users
-- SELECT * FROM users;

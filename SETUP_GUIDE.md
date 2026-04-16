## PostgreSQL Database Setup Guide

### What's New:
✅ Local PostgreSQL database connection configured
✅ Password hashing with bcrypt (10 salt rounds)
✅ User registration with password hashing
✅ User login with password verification
✅ **Terminal display of all users with hashed passwords**

### Setup Steps:

1. **Install PostgreSQL** (if not already installed)
   - Download from: https://www.postgresql.org/download/

2. **Create the Database**
   - Open pgAdmin or PostgreSQL command line
   - Run the SQL commands from `database-setup.sql`:
   ```sql
   CREATE DATABASE secrets;
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   CREATE INDEX idx_users_email ON users(email);
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start the Server**
   ```bash
   node index.js
   ```
   You should see: `Server running on port 3000`

### Features:

- **Register User**: Go to `/register` → Create account → All users displayed in terminal with hashed passwords
- **Login**: Go to `/login` → Login → Terminal shows all users
- **View All Users**: Go to `/users` → Terminal displays all registered users with:
  - User ID
  - Email
  - Hashed Password (bcrypt)
  - Total count

### Database Connection Details:
- **Host**: localhost
- **Port**: 5432
- **Database**: secrets
- **User**: postgres
- **Password**: 123456

### Expected Terminal Output After Registration:
```
========== ALL USERS IN DATABASE ==========
Total Users: 1

User 1:
  ID: 1
  Email: user@example.com
  Hashed Password: $2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
---
==========================================
```

### Files Modified:
- ✅ `index.js` - Added user display function and routes
- ✅ `database-setup.sql` - Database schema

Enjoy! Users and their hashed passwords are now displayed in the terminal on every registration/login. 🎉

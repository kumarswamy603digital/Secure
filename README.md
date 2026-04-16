# Authentication Web App 🔐

A complete secure authentication system built with Node.js, Express, PostgreSQL, and EJS templates.

## Features ✨

### Authentication & Security
- ✅ User registration with email validation
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Secure login with password verification
- ✅ Session management with express-session
- ✅ Persistent sessions (24-hour expiry)
- ✅ Automatic session-based login after registration

### User Management
- ✅ View all registered users
- ✅ Display hashed passwords in user list
- ✅ User profile with email display
- ✅ Secure logout with session cleanup

### Error Handling & Validation
- ✅ Email format validation
- ✅ Password minimum length (6 characters)
- ✅ Duplicate email prevention
- ✅ Empty field validation
- ✅ User-friendly error messages
- ✅ Protected routes (require authentication)
- ✅ Automatic redirect for authenticated users

### UI/UX
- ✅ Bootstrap 4 responsive design
- ✅ Clean and intuitive interface
- ✅ Alert messages for feedback
- ✅ Navigation between auth pages
- ✅ Welcome message on dashboard

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Template Engine**: EJS
- **Authentication**: bcrypt, express-session
- **Styling**: Bootstrap 4, CSS3
- **Package Manager**: npm

## Installation

### Prerequisites
- Node.js (v14+)
- PostgreSQL (local or remote)
- npm

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/kumarswamy603digital/Authentication-web-app.git
cd Authentication-web-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup PostgreSQL Database**

Create the database and table using the SQL file:
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

Or run:
```bash
psql -U postgres -d secrets -f database-setup.sql
```

4. **Configure Database Connection**

Update the database credentials in `index.js`:
```javascript
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "YOUR_PASSWORD",
  port: 5432,
});
```

5. **Start the Server**
```bash
node index.js
```

The server will run on `http://localhost:3000`

## Project Structure

```
.
├── index.js                 # Main application file
├── package.json            # Project dependencies
├── database-setup.sql      # Database schema
├── SETUP_GUIDE.md          # Setup instructions
├── css/
│   └── styles.css          # Custom styles
├── public/
│   └── css/
│       └── styles.css      # Static styles
├── views/
│   ├── home.ejs            # Home page
│   ├── login.ejs           # Login form
│   ├── register.ejs        # Registration form
│   ├── secrets.ejs         # Dashboard (protected)
│   ├── view-users.ejs      # User list (protected)
│   └── partials/
│       ├── header.ejs      # Header template
│       └── footer.ejs      # Footer template
└── node_modules/           # Dependencies (gitignored)
```

## Routes

### Public Routes
- `GET /` - Home page
- `GET /login` - Login page
- `GET /register` - Registration page
- `POST /login` - Login handler
- `POST /register` - Registration handler

### Protected Routes (Authentication Required)
- `GET /secrets` - User dashboard
- `GET /view-users` - View all users with hashed passwords
- `GET /logout` - Logout and destroy session
- `GET /api/users` - API endpoint to get all users (JSON)

## Usage

### Register a New User
1. Go to `http://localhost:3000/register`
2. Enter email and password (min. 6 characters)
3. Click "Register"
4. Automatically logged in and redirected to dashboard

### Login
1. Go to `http://localhost:3000/login`
2. Enter email and password
3. Click "Login"
4. Redirected to dashboard on success

### View Users
1. From the dashboard, click "View All Users"
2. See list of all registered users with:
   - User ID
   - Email
   - Hashed password (bcrypt)

### Logout
1. Click "Logout" button on dashboard
2. Session is destroyed
3. Redirected to home page
4. Must login again to access protected pages

## Terminal Output

When users register or login, the following information is logged to terminal:
```
========== ALL USERS IN DATABASE ==========
Total Users: 5

User 1:
  ID: 1
  Email: user@example.com
  Hashed Password: $2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
---
==========================================
```

## Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ Session-based authentication
- ✅ CSRF protection ready (use session validation)
- ✅ Input validation and sanitization
- ✅ Secure password comparison
- ✅ Protected routes with middleware
- ✅ Database prepared statements (SQL injection prevention)

## Environment Variables (Recommended)

Create a `.env` file (not included in git):
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=secrets
SESSION_SECRET=your_secret_key
PORT=3000
NODE_ENV=development
```

## Dependencies

```json
{
  "bcrypt": "^5.1.1",
  "body-parser": "^1.20.2",
  "ejs": "^3.1.9",
  "express": "^4.18.2",
  "express-session": "^1.17.3",
  "pg": "^8.11.3"
}
```

## API Response Examples

### Get All Users (Protected)
**Request**: `GET /api/users`
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "password": "$2b$10$..."
  }
]
```

## Error Handling Examples

### Invalid Email Format
- Response: "Invalid email format"

### Password Too Short
- Response: "Password must be at least 6 characters"

### Email Already Exists
- Response: "Email already exists. Try logging in."

### User Not Found
- Response: "User not found. Please register first."

### Incorrect Password
- Response: "Incorrect password. Please try again."

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check credentials in `index.js`
- Ensure database `secrets` exists

### Session Not Persisting
- Check session cookie settings
- Verify express-session is installed
- Clear browser cookies

### Page Not Found
- Ensure you're logged in for protected routes
- Check for typos in URL
- Verify views folder exists

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, GitHub)
- [ ] User profile management
- [ ] Account deletion
- [ ] Activity logging
- [ ] Rate limiting
- [ ] Input sanitization library
- [ ] Database connection pooling

## License

MIT License - Feel free to use this project for learning or commercial purposes.

## Author

Created by Kumara Swamy

## GitHub Repository

[Authentication-web-app](https://github.com/kumarswamy603digital/Authentication-web-app.git)

## Support

For issues and questions, please open an issue on GitHub.

---

**Note**: This is a learning project. For production use, implement additional security measures like:
- Environment variables for sensitive data
- HTTPS/TLS encryption
- Rate limiting
- CORS configuration
- Input sanitization
- CSRF tokens
- Secure headers (helmet.js)

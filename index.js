import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session configuration
app.use(
  session({
    secret: "your_secret_key_change_in_production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "TouchPal@2015",
  port: 5432,
});
db.connect();

// Function to display all users in the terminal
const displayAllUsers = async () => {
  try {
    const result = await db.query(
      "SELECT id, email, password FROM users ORDER BY id"
    );
    console.log("\n========== ALL USERS IN DATABASE ==========");
    console.log(`Total Users: ${result.rows.length}\n`);
    result.rows.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Hashed Password: ${user.password}`);
      console.log("---");
    });
    console.log("==========================================\n");
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Home route
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/secrets");
  } else {
    res.render("home.ejs");
  }
});

// Login page
app.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/secrets");
  } else {
    res.render("login.ejs", { error: null });
  }
});

// Register page
app.get("/register", (req, res) => {
  if (req.session.user) {
    res.redirect("/secrets");
  } else {
    res.render("register.ejs", { error: null });
  }
});

// Secrets page (protected)
app.get("/secrets", isAuthenticated, async (req, res) => {
  try {
    const user = await db.query("SELECT id, email FROM users WHERE id = $1", [
      req.session.user.id,
    ]);
    if (user.rows.length > 0) {
      res.render("secrets.ejs", { user: user.rows[0] });
    } else {
      req.session.destroy();
      res.redirect("/login");
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Server error");
  }
});

// View all users page (protected)
app.get("/view-users", isAuthenticated, async (req, res) => {
  try {
    const result = await db.query("SELECT id, email, password FROM users ORDER BY id");
    res.render("view-users.ejs", { users: result.rows });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server error");
  }
});

// Register POST
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  // Edge case: Empty email or password
  if (!email || !password) {
    return res.render("register.ejs", { error: "Email and password are required" });
  }

  // Edge case: Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.render("register.ejs", { error: "Invalid email format" });
  }

  // Edge case: Password validation (minimum 6 characters)
  if (password.length < 6) {
    return res.render("register.ejs", { error: "Password must be at least 6 characters" });
  }

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      return res.render("register.ejs", { error: "Email already exists. Try logging in." });
    }

    // Hash password and save
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.render("register.ejs", { error: "Registration failed. Please try again." });
      }

      try {
        const insertResult = await db.query(
          "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
          [email, hash]
        );
        
        console.log("Hashed Password:", hash);
        console.log(`✓ New user registered: ${email}`);
        await displayAllUsers();

        // Automatically log in the user
        req.session.user = {
          id: insertResult.rows[0].id,
          email: insertResult.rows[0].email,
        };

        res.redirect("/secrets");
      } catch (err) {
        console.error("Error inserting user:", err);
        res.render("register.ejs", { error: "Registration failed. Please try again." });
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.render("register.ejs", { error: "Server error. Please try again." });
  }
});

// Login POST
app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;

  // Edge case: Empty email or password
  if (!email || !loginPassword) {
    return res.render("login.ejs", { error: "Email and password are required" });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.render("login.ejs", { error: "User not found. Please register first." });
    }

    const user = result.rows[0];
    const storedHashedPassword = user.password;

    // Verify password
    bcrypt.compare(loginPassword, storedHashedPassword, async (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.render("login.ejs", { error: "Login failed. Please try again." });
      }

      if (!isMatch) {
        return res.render("login.ejs", { error: "Incorrect password. Please try again." });
      }

      // Set session
      req.session.user = {
        id: user.id,
        email: user.email,
      };

      console.log(`✓ User logged in successfully: ${email}`);
      await displayAllUsers();

      res.redirect("/secrets");
    });
  } catch (err) {
    console.error("Login error:", err);
    res.render("login.ejs", { error: "Server error. Please try again." });
  }
});

// Logout route
app.get("/logout", (req, res) => {
  if (req.session.user) {
    const email = req.session.user.email;
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Logout failed");
      }
      console.log(`✓ User logged out: ${email}`);
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

// API route to get all users (for view-users page - protected)
app.get("/api/users", isAuthenticated, async (req, res) => {
  try {
    const result = await db.query("SELECT id, email, password FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

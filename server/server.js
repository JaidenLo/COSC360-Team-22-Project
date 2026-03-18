import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
const PORT = 3001;

// Replace with your real Atlas connection string
const uri = "mongodb+srv://cmross2907_db_user:U8lSgocCVjDE6JdQ@cluster0.wmqxtas.mongodb.net/?";
const client = new MongoClient(uri);

// Allow requests from the React frontend
app.use(cors());

// Let Express read JSON from requests
app.use(express.json());

// Get the users collection
const getUsersCollection = () => {
  return client.db("cosc360").collection("users");
};

// Get the books collection
const getBooksCollection = () => {
  return client.db("cosc360").collection("books");
};

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// Save login info into MongoDB
app.post("/api/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Make sure all login fields are filled in
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const usersCollection = getUsersCollection();

    const newUser = {
      username: username.trim(),
      email: email.trim(),
      password: password.trim()
    };

    // Insert the user into the database
    await usersCollection.insertOne(newUser);

    res.status(200).json({
      message: `Welcome, ${newUser.username}! Your login was saved.`,
      username: newUser.username,
      email: newUser.email
    });
  } catch {
    res.status(500).json({ error: "Error saving user to database." });
  }
});

// Show all saved users
app.get("/api/users", async (req, res) => {
  try {
    const usersCollection = getUsersCollection();
    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch {
    res.status(500).json({ error: "Error reading users from database." });
  }
});

// Search books by title or category
app.get("/search", async (req, res) => {
  try {
    const term = (req.query.term || "").trim();
    const booksCollection = getBooksCollection();

    let results;

    // If no search term was entered, return every book
    if (term === "") {
      results = await booksCollection.find({}).toArray();
    } else {
      results = await booksCollection
        .find({
          $or: [
            { title: { $regex: term, $options: "i" } },
            { category: { $regex: term, $options: "i" } }
          ]
        })
        .toArray();
    }

    res.json(results);
  } catch {
    res.status(500).json({ message: "Error reading books from database." });
  }
});

// Add a new book into MongoDB
app.post("/submit", async (req, res) => {
  try {
    const { title, category, image } = req.body;

    // Make sure all book fields are filled in
    if (!title || !category || !image) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const booksCollection = getBooksCollection();

    const newBook = {
      title: title.trim(),
      category: category.trim(),
      image: image.trim()
    };

    // Insert the book into the database
    await booksCollection.insertOne(newBook);

    res.json({ message: `Book added: ${newBook.title}` });
  } catch {
    res.status(500).json({ message: "Error saving book to database." });
  }
});

// Show all saved books
app.get("/api/books", async (req, res) => {
  try {
    const booksCollection = getBooksCollection();
    const books = await booksCollection.find({}).toArray();
    res.json(books);
  } catch {
    res.status(500).json({ message: "Error reading books from database." });
  }
});

// Connect to MongoDB first, then start the server
async function startServer() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

startServer();
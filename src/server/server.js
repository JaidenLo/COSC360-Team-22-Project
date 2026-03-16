import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3001;
const BOOKS_FILE = "./books.json";

// Allow requests from the React frontend
app.use(cors());

// Let Express read JSON sent in POST requests
app.use(express.json());

// Read the books from books.json
const getBooks = () => {
  const raw = fs.readFileSync(BOOKS_FILE, "utf-8");
  return JSON.parse(raw);
};

// Save updated books back into books.json
const saveBooks = (books) => {
  fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2));
};

// Search books by title or category
app.get("/search", (req, res) => {
  try {
    const term = (req.query.term || "").trim().toLowerCase();
    const books = getBooks();

    const results = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(term) ||
        book.category.toLowerCase().includes(term)
      );
    });

    res.json(results);
  } catch {
    res.status(500).json({ message: "Error reading books." });
  }
});

// Add a new book to the JSON file
app.post("/submit", (req, res) => {
  try {
    const { title, category, image } = req.body;

    // Make sure all fields were entered
    if (!title || !category || !image) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const books = getBooks();

    // Create a new book object with a new id
    const newBook = {
      id: books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1,
      title: title.trim(),
      category: category.trim(),
      image: image.trim()
    };

    // Add the new book and save the file
    books.push(newBook);
    saveBooks(books);

    res.json({ message: `Book added: ${newBook.title}` });
  } catch {
    res.status(500).json({ message: "Error saving book." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
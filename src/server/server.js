import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3001;
const BOOKS_FILE = "./books.json";

app.use(cors());
app.use(express.json());

const getBooks = () => {
  const raw = fs.readFileSync(BOOKS_FILE, "utf-8");
  return JSON.parse(raw);
};

const saveBooks = (books) => {
  fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2));
};

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

app.post("/submit", (req, res) => {
  try {
    const { title, category, image } = req.body;

    if (!title || !category || !image) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const books = getBooks();

    const newBook = {
      id: books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1,
      title: title.trim(),
      category: category.trim(),
      image: image.trim()
    };

    books.push(newBook);
    saveBooks(books);

    res.json({ message: `Book added: ${newBook.title}` });
  } catch {
    res.status(500).json({ message: "Error saving book." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
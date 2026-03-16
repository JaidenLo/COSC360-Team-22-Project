import { useEffect, useState } from "react";
import "./styles/style.css";
import BookCard from "./components/bookCard.jsx";

export default function App() {
  // Search text
  const [query, setQuery] = useState("");

  // Books currently being displayed
  const [books, setBooks] = useState([]);

  // Form fields for adding a new book
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  // Message returned from the server
  const [message, setMessage] = useState("");

  // Controls when to show "No results found"
  const [showNoResults, setShowNoResults] = useState(false);

  // Load all books when the page first opens
  useEffect(() => {
    fetch("http://localhost:3001/search?term=")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setShowNoResults(false);
      })
      .catch(() => {
        setBooks([]);
      });
  }, []);

  // Reload all books from the server
  const loadAllBooks = async () => {
    try {
      const res = await fetch("http://localhost:3001/search?term=");
      const data = await res.json();
      setBooks(data);
      setShowNoResults(false);
    } catch {
      setBooks([]);
    }
  };

  // Search for books by title or category
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const trimmedQuery = query.trim();

      const res = await fetch(
        `http://localhost:3001/search?term=${encodeURIComponent(trimmedQuery)}`
      );
      const data = await res.json();

      setBooks(data);

      // Only show "No results" if a real search was entered
      setShowNoResults(trimmedQuery !== "" && data.length === 0);

      // Clear the search box after submit
      setQuery("");
    } catch {
      setBooks([]);
      setShowNoResults(true);
    }
  };

  // Send a new book to the server
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, category, image })
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        // Clear form inputs after a successful submit
        setTitle("");
        setCategory("");
        setImage("");

        // Refresh the displayed books
        await loadAllBooks();
      }
    } catch {
      setMessage("Error submitting form.");
    }
  };

  return (
    <div className="page">
      <header className="nav">
        <div className="navInner">
          <div className="logo">⌘</div>

          <nav className="navLinks">
            <a href="#">Books</a>
            <a href="#">Blog</a>
            <a href="#">Community</a>
            <a href="#">Resources</a>
            <a href="#">Contact</a>
          </nav>

          <div className="navAuth">
            <button className="btn ghost">Sign in</button>
            <button className="btn dark">Register</button>
          </div>
        </div>
      </header>

      <section className="hero">
        <h1>Books</h1>
        <p>Read, Make Stronger</p>
      </section>

      <main className="content">
        <section className="booksSection">
          <div className="booksTopRow">
            <h3 className="sectionTitle">All books</h3>

            <form className="searchWrap" onSubmit={handleSearch}>
              <input
                className="searchInput"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What you would like to read"
              />
              <button type="submit" className="searchBtn" aria-label="search">
                🔍
              </button>
            </form>
          </div>

          <div className="submitPanel">
            <h3 className="sectionTitle">Add a book</h3>

            <form className="submitForm" onSubmit={handleSubmit}>
              <input
                className="formInput"
                type="text"
                placeholder="Book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                className="formInput"
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <input
                className="formInput"
                type="text"
                placeholder="/covers/cover1.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

              <button type="submit" className="btn dark">
                Submit
              </button>
            </form>

            {message && <p className="serverMessage">{message}</p>}
          </div>

          <div className="grid">
            {books.length > 0 ? (
              books.map((book) => <BookCard key={book.id} book={book} />)
            ) : (
              showNoResults && <p className="noResults">No results found</p>
            )}
          </div>

          <div className="pager">
            <button className="pagerBtn">← Previous</button>
            <div className="pagerNums">
              <button className="num active">1</button>
              <button className="num">2</button>
              <button className="num">3</button>
              <span className="dots">…</span>
              <button className="num">67</button>
              <button className="num">68</button>
            </div>
            <button className="pagerBtn">Next →</button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footerInner">
          <div className="footerLeft">
            <div className="logo">⌘</div>
            <div className="socials">
              <span>𝕏</span>
              <span>◎</span>
              <span>▶</span>
              <span>in</span>
            </div>
          </div>

          <div className="footerCols">
            <div className="col">
              <div className="colTitle">About</div>
              <a href="#">Who we are</a>
              <a href="#">Teams</a>
            </div>

            <div className="col">
              <div className="colTitle">Resources</div>
              <a href="#">Blog</a>
              <a href="#">Share and exchange</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
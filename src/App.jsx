import { useMemo, useState } from "react";
import "./style.css";
import { books as BOOKS } from "./data/books";
import BookCard from "./components/bookCard.jsx";

export default function App() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BOOKS;
    return BOOKS.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.category?.toLowerCase().includes(q) ?? false)
    );
  }, [query]);

  return (
    <div className="page">
      {/* NAVBAR */}
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

      {/* HERO */}
      <section className="hero">
        <h1>Books</h1>
        <p>Read, Make Stronger</p>
      </section>

      {/* BOOKS SECTION */}
      <main className="content">
        <section className="booksSection">
          <div className="booksTopRow">
            <h3 className="sectionTitle">All books</h3>

            <div className="searchWrap">
              <input
                className="searchInput"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What you would like to read"
              />
              <button className="searchBtn" aria-label="search">
                🔍
              </button>
            </div>
          </div>

          <div className="grid">
            {filtered.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>

          {/* SIMPLE PAGINATION LOOK (static UI) */}
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

      {/* FOOTER */}
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
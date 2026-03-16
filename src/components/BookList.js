import { useEffect, useState } from 'react';
import BookCard from './bookCard';
import '../styles/BookList.css';

export default function BookList({ onSelectBook }) {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);

  // Add a book form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');

  // Load all books on mount
  useEffect(() => {
    fetch('http://localhost:3001/search?term=')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setShowNoResults(false);
      })
      .catch(() => setBooks([]));
  }, []);

  const loadAllBooks = async () => {
    try {
      const res = await fetch('http://localhost:3001/search?term=');
      const data = await res.json();
      setBooks(data);
      setShowNoResults(false);
    } catch {
      setBooks([]);
    }
  };

  // Search — hits GET /search?term=
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const trimmed = query.trim();
      const res = await fetch(`http://localhost:3001/search?term=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      setBooks(data);
      setShowNoResults(trimmed !== '' && data.length === 0);
      setQuery(''); // clear search box after submit
    } catch {
      setBooks([]);
      setShowNoResults(true);
    }
  };

  // Submit new book — hits POST /submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, image }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setTitle('');
        setCategory('');
        setImage('');
        await loadAllBooks(); // refresh book grid
      }
    } catch {
      setMessage('Error submitting form.');
    }
  };

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
        </div>
      </header>

      {/* HERO */}
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
              <button type="submit" className="searchBtn" aria-label="search">🔍</button>
            </form>
          </div>

          {/* ADD A BOOK FORM */}
          <div className="submitPanel">
            <h3 className="sectionTitle">Add a book</h3>
            <form className="submitForm" onSubmit={handleSubmit}>
              <input className="formInput" type="text" placeholder="Book title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input className="formInput" type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
              <input className="formInput" type="text" placeholder="/covers/cover1.jpg" value={image} onChange={(e) => setImage(e.target.value)} />
              <button type="submit" className="btn dark">Submit</button>
            </form>
            {message && <p className="serverMessage">{message}</p>}
          </div>

          <div className="grid">
            {books.length > 0 ? (
              books.map((b) => (
                <BookCard key={b.id} book={b} onClick={onSelectBook} />
              ))
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
              <span>𝕏</span><span>◎</span><span>▶</span><span>in</span>
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
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BookCard from "../components/BookCard";
import noCover from "../assets/No_Cover.jpg";
import "./Home.css";

function Home({ user }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [searching, setSearching] = useState(false);

    useEffect(() => { fetchBooks(); }, []);

    useEffect(() => {
        if (location.state?.openBook) {
            setSelectedBook(location.state.openBook);
        }
    }, []);

    async function fetchBooks() {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("/api/books");
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch books");
            setBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch(e) {
        e.preventDefault();
        setSearching(true);
        setError("");
        try {
            const params = new URLSearchParams();
            if (query.trim()) params.append("q", query.trim());
            if (category !== "all") params.append("category", category);
            const response = await fetch(`/api/books/search?${params.toString()}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Search failed");
            setBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setSearching(false);
        }
    }

    function handleClear() {
        setQuery("");
        setCategory("all");
        fetchBooks();
    }

    useEffect(() => {
        if (!selectedBook) return;
        const handleKeyDown = (e) => { if (e.key === "Escape") setSelectedBook(null); };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);
        return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleKeyDown); };
    }, [selectedBook]);

    const isValidImageValue = (value) => {
        if (!value || typeof value !== "string") return false;
        const trimmed = value.trim();
        return trimmed.startsWith("http://") || trimmed.startsWith("https://") ||
               trimmed.startsWith("/") || trimmed.startsWith("data:image/");
    };

    const getImageSrc = (value) => isValidImageValue(value) ? value : noCover;
    const closeModal = () => setSelectedBook(null);

    const canEditBook = (book) => {
        if (!user) return false;
        if (user.usertype === "admin") return true;
        return book.owner && book.owner.toString() === user._id?.toString();
    };

    async function handleBorrow(book) {
        try {
            const res = await fetch(`/api/books/borrow/${book._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id || user._id })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || 'Failed to borrow book');
                return;
            }

            alert('Book borrowed successfully');
            fetchBooks();
        } catch (error) {
            console.error('Borrow error:', error);
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>

            {/* Search bar — full width */}
            <div className="search-bar-container">
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="search-input-home"
                        placeholder="Search by title or description..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select
                        className="category-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Mystery">Mystery / Thriller</option>
                        <option value="Classic">Classic</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Self-Help">Self-Help</option>
                        <option value="Finance">Finance</option>
                        <option value="Biography">Biography</option>
                        <option value="History">History</option>
                        <option value="Technology">Technology</option>
                        <option value="Other">Other</option>
                    </select>
                    <button type="submit" className="search-btn-home" disabled={searching}>
                        {searching ? "Searching..." : "Search"}
                    </button>
                    <button type="button" className="clear-btn-home" onClick={handleClear}>
                        Clear
                    </button>
                </form>
            </div>

            {loading && <p style={{ textAlign: "center", padding: "2rem", color: "#888" }}>Loading books...</p>}
            {error && <p style={{ textAlign: "center", color: "red", padding: "1rem" }}>{error}</p>}

            {/* Book grid */}
            <div className="books-container">
                {!loading && books.length === 0 ? (
                    <p style={{ color: "#888", gridColumn: "1/-1", textAlign: "center", padding: "2rem" }}>
                        No books found.
                    </p>
                ) : (
                    books.map((book) => (
                        <BookCard
                            key={book._id}
                            title={book.title}
                            category={book.category}
                            image={book.image}
                            borrowed={book.borrowed}
                            borrowedBy={book.borrowedBy}
                            onClick={() => setSelectedBook(book)}
                        />
                    ))
                )}
            </div>

            {/* Modal */}
            {selectedBook && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="book-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeModal}>×</button>

                        <div className="book-modal-image-wrapper">
                            <img
                                src={getImageSrc(selectedBook.image)}
                                alt={selectedBook.title}
                                className="book-modal-image"
                                onError={(e) => { e.target.src = noCover; }}
                            />
                        </div>

                        <div className="book-modal-content">
                            <h2>{selectedBook.title}</h2>
                            <p className="modal-category">{selectedBook.category || "No category"}</p>

                            <div className="modal-description-block">
                                <h3>Description</h3>
                                <p>{selectedBook.description || "No description available."}</p>
                            </div>

                            <p className={selectedBook.borrowed ? "modal-borrowed borrowed" : "modal-borrowed available"}>
                                Status: {selectedBook.borrowed ? "Borrowed" : "Available"}
                            </p>

                            {selectedBook.borrowed && (
                                <p className="modal-borrowed-by">Borrowed By: {selectedBook.borrowedBy?.name || "Unknown"}</p>
                            )}

                            <div style={{ display: "flex", gap: "10px", marginTop: "8px", flexWrap: "wrap" }}>
                                <button
                                    className="threads-button"
                                    onClick={() => navigate("/threads", { state: { book: selectedBook } })}
                                >
                                    View Threads
                                </button>
                                {canEditBook(selectedBook) && (
                                    <button
                                        className="threads-button"
                                        style={{ backgroundColor: "#1976d2" }}
                                        onClick={() => { closeModal(); navigate("/edit-book", { state: { book: selectedBook } }); }}
                                    >
                                        Edit Book
                                    </button>
                                )}
                                <button
                                    className={`borrow-button ${selectedBook.borrowed ? "borrowed" : ""}`}
                                    onClick={() => handleBorrow(selectedBook)}
                                    disabled={selectedBook.borrowed}
                                >
                                    {selectedBook.borrowed ? 'Unavailable' : 'Borrow Book'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
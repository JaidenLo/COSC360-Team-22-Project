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
    const [queueLoading, setQueueLoading] = useState(false);

    const userId = user?._id || user?.id || null;

    useEffect(() => { fetchBooks(); }, []);

    useEffect(() => {
    const interval = setInterval(() => {
        fetchBooks(true);
    }, 5000);
    return () => clearInterval(interval);
}, []);

    useEffect(() => {
        if (location.state?.openBook) {
            setSelectedBook(location.state.openBook);
        }
    }, []);

        async function fetchBooks(silent = false) {
        if (!silent) setLoading(true);
        setError("");
        try {
            const response = await fetch("/api/books");
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch books");
            setBooks(data);
            if (selectedBook) {
                const updated = data.find(b => b._id === selectedBook._id);
                if (updated) setSelectedBook(updated);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            if (!silent) setLoading(false);
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

    const isInQueue = (book) => {
        if (!userId || !book.queue) return false;
        return book.queue.some(q => q.userId?.toString() === userId.toString());
    };

    const isReservedForMe = (book) => {
        if (!userId || !book.reservedFor?.userId) return false;
        return book.reservedFor.userId.toString() === userId.toString();
    };

    const isBorrowedByMe = (book) => {
        if (!userId || !book.borrowedBy) return false;
        const borrowedById = book.borrowedBy?._id?.toString() || book.borrowedBy?.toString();
        return borrowedById === userId.toString();
    };

    const reservationTimeLeft = (book) => {
        if (!book.reservedFor?.expiresAt) return null;
        const diff = new Date(book.reservedFor.expiresAt) - new Date();
        if (diff <= 0) return null;
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const mins = Math.floor((diff / 1000 / 60) % 60);
        return `${hours}h ${mins}m`;
    };

    async function handleBorrow(book) {
        try {
            const res = await fetch(`/api/books/borrow/${book._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || 'Failed to borrow book');
                return;
            }
            alert('Book borrowed successfully!');
            await fetchBooks();
        } catch (error) {
            console.error('Borrow error:', error);
        }
    }

    async function handleJoinQueue(book) {
        if (!userId) { alert('Please log in to join the queue.'); return; }
        setQueueLoading(true);
        try {
            const res = await fetch(`/api/books/queue/${book._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, username: user?.name || user?.username })
            });
            const data = await res.json();
            if (!res.ok) { alert(data.message || 'Failed to join queue'); return; }
            await fetchBooks();
        } catch {
            alert('Failed to join queue');
        } finally {
            setQueueLoading(false);
        }
    }

    async function handleLeaveQueue(book) {
        setQueueLoading(true);
        try {
            const res = await fetch(`/api/books/queue/${book._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            const data = await res.json();
            if (!res.ok) { alert(data.message || 'Failed to leave queue'); return; }
            await fetchBooks();
        } catch {
            alert('Failed to leave queue');
        } finally {
            setQueueLoading(false);
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>

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

                            {selectedBook.reservedFor?.userId && !isReservedForMe(selectedBook) && (
                                <p className="modal-reserved">
                                    Reserved for another user
                                </p>
                            )}

                            {selectedBook.borrowed && (
                                <p className="modal-borrowed-by">Borrowed By: {selectedBook.borrowedBy?.name || "Unknown"}</p>
                            )}

                            {/* reservation notice */}
                            {isReservedForMe(selectedBook) && (
                                <div className="queue-reserved-notice">
                                     This book is reserved for you! You have {reservationTimeLeft(selectedBook)} to borrow it.
                                </div>
                            )}

                            {/* queue info */}
                            {selectedBook.queue?.length > 0 && (
                                <p className="queue-count">
                                    {selectedBook.queue.length} {selectedBook.queue.length === 1 ? 'person' : 'people'} waiting in queue
                                </p>
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

                                {!selectedBook.borrowed && !selectedBook.reservedFor?.userId && (
                                    <button className="borrow-button" onClick={() => handleBorrow(selectedBook)}>
                                        Borrow Book
                                    </button>
                                )}
                                {isReservedForMe(selectedBook) && (
                                    <button className="borrow-button" onClick={() => handleBorrow(selectedBook)}>
                                        Borrow Now
                                    </button>
                                )}
                                {(selectedBook.borrowed || selectedBook.reservedFor?.userId) && !isReservedForMe(selectedBook) && !isBorrowedByMe(selectedBook) && userId && (
                                    isInQueue(selectedBook) ? (
                                        <button
                                            className="queue-button leave"
                                            onClick={() => handleLeaveQueue(selectedBook)}
                                            disabled={queueLoading}
                                        >
                                            Leave Queue
                                        </button>
                                    ) : (
                                        <button
                                            className="queue-button join"
                                            onClick={() => handleJoinQueue(selectedBook)}
                                            disabled={queueLoading}
                                        >
                                            Join Queue
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
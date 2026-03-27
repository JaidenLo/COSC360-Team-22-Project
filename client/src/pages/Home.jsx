import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import noCover from "../assets/No_Cover.jpg";
import "./Home.css";

function Home() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await fetch("/api/books");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch books");
                }

                setBooks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchBooks();
    }, []);

    useEffect(() => {
        if (!selectedBook) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSelectedBook(null);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedBook]);

    const isValidImageValue = (value) => {
        if (!value || typeof value !== "string") return false;

        const trimmed = value.trim();

        if (!trimmed) return false;

        return (
            trimmed.startsWith("http://") ||
            trimmed.startsWith("https://") ||
            trimmed.startsWith("/") ||
            trimmed.startsWith("data:image/")
        );
    };

    const getImageSrc = (value) => {
        return isValidImageValue(value) ? value : noCover;
    };

    const closeModal = () => {
        setSelectedBook(null);
    };

    if (loading) return <p>Loading books...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="books-container">
                {books.length === 0 ? (
                    <p>No books found.</p>
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
                    <div
                        className="book-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-btn"
                            onClick={closeModal}
                        >
                            ×
                        </button>

                        <div className="book-modal-image-wrapper">
                            <img
                                src={getImageSrc(selectedBook.image)}
                                alt={selectedBook.title}
                                className="book-modal-image"
                                onError={(e) => {
                                    e.target.src = noCover;
                                }}
                            />
                        </div>

                        <div className="book-modal-content">
                            <h2>{selectedBook.title}</h2>

                            <p className="modal-category">
                                {selectedBook.category || "No category"}
                            </p>

                            <div className="modal-description-block">
                                <h3>Description</h3>
                                <p>
                                    {selectedBook.description ||
                                        "No description available."}
                                </p>
                            </div>

                            <p className={selectedBook.borrowed ? "modal-borrowed borrowed" : "modal-borrowed available"}>
                                Status:{" "}
                                {selectedBook.borrowed
                                    ? "Borrowed"
                                    : "Available"}
                            </p>

                            {selectedBook.borrowed && (
                                <p className="modal-borrowed-by">
                                    Borrowed By:{" "}
                                    {selectedBook.borrowedBy || "Unknown"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;
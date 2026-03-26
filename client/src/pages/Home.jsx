import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import "./Home.css";

function Home() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    if (loading) {
        return <p>Loading books...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="books-container">
            {books.length === 0 ? (
                <p>No books found.</p>
            ) : (
                books.map((book) => (
                    <BookCard
                        key={book._id}
                        title={book.title}
                        category={book.category}
                        owner={book.owner}
                        image={book.image}
                    />
                ))
            )}
        </div>
    );
}

export default Home;
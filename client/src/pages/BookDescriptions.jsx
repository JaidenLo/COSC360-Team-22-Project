import { useLocation, useNavigate } from 'react-router-dom';
import '../components/BookDescription.css';

export default function BookDescription() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const book = state?.book;

    if (!book) {
        return <p>No book selected. <button onClick={() => navigate('/home')}>Go back</button></p>;
    }

    return (
        <div className="book-description-container">
            <div className="book-image">
                <img src={book.image} alt={book.title} />
            </div>
            <div className="book-details">
                <h1>{book.title}</h1>
                <p className="author">Author: {book.author || 'Unknown'}</p>
                <p className="genres">
                    Genres: {book.genres ? book.genres.join(', ') : book.category || 'N/A'}
                </p>
                <p className="availability">
                    Availability: {book.available ? 'Available' : 'Not Available'}
                </p>
                <p className="location">Location: {book.location || 'N/A'}</p>

                <div className="buttons">
                    <button className="borrow-button">Borrow Book</button>
                    <button className="threads-button" onClick={() => navigate('/threads', { state: { book } })}>
                        View Threads
                    </button>
                </div>

                <div className="description">
                    <h2>About this book</h2>
                    <p>{book.description || 'No description available.'}</p>
                </div>

                <button className="back-button" onClick={() => navigate('/home')}>← Back to Books</button>
            </div>
        </div>
    );
}

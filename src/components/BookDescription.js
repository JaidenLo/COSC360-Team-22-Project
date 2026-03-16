import React from 'react';
import '../styles/BookDescription.css';

const BookDescription = ({ book, onViewThreads, onBack }) => {
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
          <button className="threads-button" onClick={onViewThreads}>
            View Threads
          </button>
        </div>

        <div className="description">
          <h2>About this book</h2>
          <p>{book.description || 'No description available.'}</p>
        </div>

        <button className="back-button" onClick={onBack}>← Back to Books</button>
      </div>
    </div>
  );
};

export default BookDescription;
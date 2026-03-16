import React from 'react';
import '../styles/BookDescription.css';

const BookDescription = ({ book, onViewThreads }) => {
  return (
    <div className="book-description-container">
      <div className="book-image">
        <img src={book.image} alt={book.title} />
      </div>
      <div className="book-details">
        <h1>{book.title}</h1>
        <p className="author">Author: {book.author}</p>
        <p className="genres">Genres: {book.genres.join(', ')}</p>
        <p className="availability">
          Availability: {book.available ? 'Available' : 'Not Available'}
        </p>
        <p className="location">Location: {book.location}</p>

        <div className="buttons">
          <button className="borrow-button">Borrow Book</button>
          <button className="threads-button" onClick={onViewThreads}>
            View Threads
          </button>
        </div>

        <div className="description">
          <h2>About this book</h2>
          <p>{book.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDescription;
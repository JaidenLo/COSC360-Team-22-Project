import './BookCard.css'


function BookCard() {
    return (
        <div className="book-card">
            <div className="book-image"><img src="/src/assets/react.svg" alt="Default Book" /></div>
            <h3 className="book-title">Book Title</h3>
            <p className="book-category">Category</p>
            <p className='OwnerId'></p>
        </div>
    );
}

export default BookCard;
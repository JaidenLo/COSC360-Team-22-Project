import './BookCard.css';

function BookCard({ title, category, image, owner, onClick }) {
    const fallback = "/src/assets/react.svg";
    return (
        <div className="book-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div className="book-image">
                <img
                    src={image || fallback}
                    alt={title}
                    onError={(e) => { e.target.src = fallback; }}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>
            <h3 className="book-title">{title}</h3>
            <p className="book-category">{category}</p>
            <p className="OwnerId">{owner ? `Owner: ${owner}` : ""}</p>
        </div>
    );
}

export default BookCard;

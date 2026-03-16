export default function BookCard({ book, onClick }) {
  return (
    <div className="card" onClick={() => onClick(book)} style={{ cursor: 'pointer' }}>
      <div className="coverWrap">
        <img className="cover" src={book.image} alt={book.title} />
      </div>
      <div className="cardBody">
        <div className="cardTitle">{book.title}</div>
        <div className="cardSubtitle">{book.category}</div>
      </div>
    </div>
  );
}
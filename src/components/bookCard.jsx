export default function BookCard({ book }) {
  return (
    <article className="card">
      <div className="coverWrap">
        <img className="cover" src={book.image} alt={book.title} />
      </div>

      <div className="cardBody">
        <div className="cardTitle">{book.title}</div>
        <div className="cardSubtitle">{book.category}</div>
      </div>
    </article>
  );
}
import noCover from "../assets/No_Cover.jpg";
import "./BookCard.css";

function BookCard({
    title,
    category,
    image,
    borrowed,
    borrowedBy,
    onClick,
}) {
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

    const imageSrc = isValidImageValue(image) ? image : noCover;

    return (
        <div
            className="book-card"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && onClick) {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div className="book-image">
                <img
                    src={imageSrc}
                    alt={title}
                    onError={(e) => {
                        e.target.src = noCover;
                    }}
                />
            </div>

            <h3 className="book-title">{title}</h3>
            <p className="book-category">{category || "No category"}</p>

            <p className={`book-status ${borrowed ? "borrowed" : "available"}`}>
                {borrowed ? "Borrowed" : "Available"}
            </p>

            {borrowed && borrowedBy && (
                <p className="borrowed-by">By: {borrowedBy}</p>
            )}
        </div>
    );
}

export default BookCard;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddBook.css";

function AddBook({ user }) {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    category,
                    description,
                    image,
                    owner: user?._id || null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to add book");
            }

            setSuccess("Book added successfully!");
            setTitle("");
            setCategory("");
            setDescription("");
            setImage("");

            setTimeout(() => navigate("/home"), 1000);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="add-book-page">
            <div className="add-book-card">
                <h1 className="add-book-title">Add Book</h1>

                <form onSubmit={handleSubmit} className="add-book-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    >
                    <option value="" disabled>
                        Select a category
                    </option>
                    <option value="Literature">Literature</option>
                    <option value="Programming">Programming</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="Math">Math</option>
                    <option value="Science">Science</option>
                    <option value="Databases">Databases</option>
                    <option value="Systems">Systems</option>
                    <option value="AI">AI</option>
                    <option value="Web">Web</option>
                    <option value="Security">Security</option>
                    <option value="Ethics">Ethics</option>
                    <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="5"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image URL</label>
                    <input
                    id="image"
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/book.jpg"
                    />
                </div>

                <button type="submit" className="add-book-button">
                    Add Book
                </button>
                </form>

                {error && <p className="message error-message">{error}</p>}
                {success && <p className="message success-message">{success}</p>}
            </div>
            </div>
    );
}

export default AddBook;
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function EditBook({ user }) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const book = state?.book;

    const [title, setTitle] = useState(book?.title || "");
    const [category, setCategory] = useState(book?.category || "");
    const [description, setDescription] = useState(book?.description || "");
    const [image, setImage] = useState(book?.image || "");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (!book) {
        return <p>No book selected. <button onClick={() => navigate("/home")}>Go back</button></p>;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`/api/books/${book._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    category,
                    description,
                    image,
                    requesterId: user?._id,
                    requesterType: user?.usertype
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update book");
            }

            setSuccess("Book updated successfully!");
            setTimeout(() => navigate("/home"), 1000);
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleDelete() {
        if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`)) return;

        try {
            const response = await fetch(`/api/books/${book._id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requesterId: user?._id,
                    requesterType: user?.usertype
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete book");
            }

            alert("Book deleted.");
            navigate("/home");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div style={{ maxWidth: "500px", margin: "40px auto", padding: "0 20px" }}>
            <h1>Edit Book</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="5"
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Image URL</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                        Save Changes
                    </button>
                    <button type="button" onClick={handleDelete} style={{ padding: "10px 20px", backgroundColor: "#e53935", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                        Delete Book
                    </button>
                    <button type="button" onClick={() => navigate("/home")} style={{ padding: "10px 20px", backgroundColor: "#888", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                        Cancel
                    </button>
                </div>
            </form>

            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
        </div>
    );
}

export default EditBook;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddBook() {
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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    category,
                    description,
                    image
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

            setTimeout(() => {
                navigate("/home");
            }, 1000);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div style={{ maxWidth: "500px", margin: "40px auto" }}>
            <h1>Add Book</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="5"
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Image URL</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/book.jpg"
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>

                <button type="submit">Add Book</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
        </div>
    );
}

export default AddBook;
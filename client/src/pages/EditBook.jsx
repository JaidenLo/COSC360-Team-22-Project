import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function EditBook({ user }) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const book = state?.book;

    const [title, setTitle] = useState(book?.title || "");
    const [category, setCategory] = useState(book?.category || "");
    const [description, setDescription] = useState(book?.description || "");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(book?.image || null);
    const [imageError, setImageError] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (!book) {
        return <p>No book selected. <button onClick={() => navigate("/home")}>Go back</button></p>;
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
        if (!allowed.includes(file.type)) {
            setImageError('Only image files are allowed (jpeg, png, gif, webp, jpg)');
            e.target.value = '';
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setImageError('Image must be under 2MB.');
            e.target.value = '';
            return;
        }

        setImageError('');
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(""); setSuccess("");

        try {
            // keep existing image unless a new one was picked
            let imageBase64 = book?.image || '';
            if (imageFile) {
                imageBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(imageFile);
                });
            }

            const response = await fetch(`/api/books/${book._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    category,
                    description,
                    image: imageBase64,
                    requesterId: user?._id,
                    requesterType: user?.usertype
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to update book");

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
            if (!response.ok) throw new Error(data.message || "Failed to delete book");

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
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }} />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
                    >
                        <option value="" disabled>Select a category</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Mystery / Thriller">Mystery / Thriller</option>
                        <option value="Classic">Classic</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Self-Help">Self-Help</option>
                        <option value="Finance">Finance</option>
                        <option value="Biography">Biography</option>
                        <option value="History">History</option>
                        <option value="Technology">Technology</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                        rows="5" style={{ width: "100%", padding: "10px", boxSizing: "border-box" }} />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Book Cover <span style={{ color: '#888', fontWeight: 'normal' }}>(leave empty to keep current)</span></label>
                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImageChange} />
                    {imageError && <p style={{ color: 'red', fontSize: '0.85rem', margin: '4px 0 0' }}>{imageError}</p>}
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview"
                            style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px', border: '1px solid #ddd' }} />
                    )}
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
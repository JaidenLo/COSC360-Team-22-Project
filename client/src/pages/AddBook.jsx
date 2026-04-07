import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddBook.css";

function AddBook({ user }) {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        setError("");
        setSuccess("");

        try {
            let imageBase64 = '';
            if (imageFile) {
                imageBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(imageFile);
                });
            }

            const response = await fetch("/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    category,
                    description,
                    image: imageBase64 || '',
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
            setImageFile(null);
            setImagePreview(null);

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
                            <option value="" disabled>Select a category</option>
                            <option value="Fiction">Fiction</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Science Fiction">Science Fiction</option>
                            <option value="Mystery">Mystery / Thriller</option>
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
                        <label htmlFor="image">
                            Book Cover <span style={{ color: '#888', fontWeight: 'normal' }}>(optional, max 2MB)</span>
                        </label>
                        <input
                            id="image"
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleImageChange}
                        />
                        {imageError && <p style={{ color: 'red', fontSize: '0.85rem', margin: '4px 0 0' }}>{imageError}</p>}
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px', border: '1px solid #ddd' }}
                            />
                        )}
                    </div>

                    <button type="submit" className="add-book-button">Add Book</button>
                </form>

                {error && <p className="message error-message">{error}</p>}
                {success && <p className="message success-message">{success}</p>}
            </div>
        </div>
    );
}

export default AddBook;
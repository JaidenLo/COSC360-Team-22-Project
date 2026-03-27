import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultpfp from '../assets/react.svg';
import '../components/ThreadsPage.css';

export default function Threads({ user }) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const book = state?.book;

    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!book?._id) return;

        fetch(`/api/threads/${book._id}`)
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load threads.');
                setLoading(false);
            });
    }, [book?._id]);

    if (!book) {
        return <p>No book selected. <button onClick={() => navigate('/home')}>Go back</button></p>;
    }

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        try {
            const res = await fetch('/api/threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookId: book._id,
                    username: user?.username || 'Guest',
                    content: newPost,
                }),
            });

            const saved = await res.json();
            setPosts([saved, ...posts]);
            setNewPost('');
        } catch {
            setError('Failed to post reply.');
        }
    };

    return (
        <div className="thread-page-container">
            <button className="back-button" onClick={() => navigate('/home')}>
                ← Back to Book
            </button>
            <h1 className="thread-title">{book.title} — Threads</h1>

            <div className="post-form">
                <textarea
                    placeholder="Write a reply..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                />
                <button onClick={handlePostSubmit}>Post</button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading && <p>Loading threads...</p>}

            <div className="posts-container">
                {!loading && posts.length === 0 && (
                    <p style={{ color: '#888' }}>No replies yet. Be the first!</p>
                )}
                {posts.map((post) => (
                    <div className="post" key={post._id}>
                        <div className="post-header">
                            <img src={defaultpfp} alt={post.username} className="profile-image" />
                            <div className="post-info">
                                <h3 className="username">{post.username}</h3>
                                <p className="post-time">{new Date(post.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <p className="post-content">{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
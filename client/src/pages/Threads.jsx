import { useState, useEffect, useRef } from 'react';
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
    const [success, setSuccess] = useState('');
    const [avatars, setAvatars] = useState({});
    const [collapsed, setCollapsed] = useState({});
    const pollingRef = useRef(null);

    const userId = user?._id || user?.id || null;

    async function fetchPosts() {
        if (!book?._id) return;
        try {
            const res = await fetch(`/api/threads/${book._id}`);
            const data = await res.json();
            setPosts(data);
            setLoading(false);
            fetchAvatars(data);
        } catch {
            setError('Failed to load threads.');
            setLoading(false);
        }
    }

    async function fetchAvatars(posts) {
        const userIds = [...new Set(posts.map(p => p.userId).filter(Boolean))];
        const results = {};
        await Promise.all(userIds.map(async (id) => {
            try {
                const res = await fetch(`/api/users/${id}/image`);
                const data = await res.json();
                if (data.imageLinks?.[0]) results[id] = data.imageLinks[0];
            } catch { }
        }));
        setAvatars(results);
    }

    useEffect(() => { fetchPosts(); }, [book?._id]);

    useEffect(() => {
        if (!book?._id) return;
        pollingRef.current = setInterval(fetchPosts, 5000);
        return () => clearInterval(pollingRef.current);
    }, [book?._id]);

    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(''), 3000);
        return () => clearTimeout(t);
    }, [success]);

    if (!book) {
        return <p>No book selected. <button onClick={() => navigate('/home')}>Go back</button></p>;
    }

    function toggleCollapse(postId) {
        setCollapsed(prev => ({ ...prev, [postId]: !prev[postId] }));
    }

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;
        setError('');
        try {
            const res = await fetch('/api/threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookId: book._id,
                    userId: userId,
                    username: user?.username || user?.name || 'Guest',
                    content: newPost,
                }),
            });
            const saved = await res.json();
            setPosts([saved, ...posts]);
            setNewPost('');
            setSuccess('✓ Reply posted!');
        } catch {
            setError('Failed to post reply.');
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Delete this post?')) return;
        setError('');
        try {
            const res = await fetch(`/api/threads/${postId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.message || 'Failed to delete post');
                return;
            }
            setPosts(posts.filter(p => p._id !== postId));
            setSuccess('✓ Post deleted.');
        } catch {
            setError('Failed to delete post.');
        }
    };

    return (
        <div className="thread-page-container">
            <div className="breadcrumb">
                <span onClick={() => navigate('/home')} className="breadcrumb-link">Home</span>
                <span className="breadcrumb-sep"> &gt; </span>
                <span onClick={() => navigate('/home', { state: { openBook: book } })} className="breadcrumb-link">{book.title}</span>
                <span className="breadcrumb-sep"> &gt; </span>
                <span className="breadcrumb-current">Discussion</span>
            </div>
            <button className="back-button" onClick={() => navigate('/home')}>← Back to Books</button>
            <h1 className="thread-title">{book.title} - Threads</h1>

            {error && <div className="alert alert-error">✕ {error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="post-form">
                <textarea
                    placeholder="Write a reply..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                />
                <button onClick={handlePostSubmit}>Post</button>
            </div>
            {loading && <p>Loading threads...</p>}
            <div className="posts-container">
                {!loading && posts.length === 0 && (
                    <p style={{ color: '#888' }}>No replies yet. Be the first!</p>
                )}
                {posts.map((post) => (
                    <div className="post" key={post._id}>
                        <div className="post-header">
                            <img
                                src={avatars[post.userId] || defaultpfp}
                                alt={post.username}
                                className="profile-image"
                            />
                            <div className="post-info">
                                <h3 className="username">{post.username}</h3>
                                <p className="post-time">{new Date(post.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="post-actions">
                                <button
                                    className="collapse-btn"
                                    onClick={() => toggleCollapse(post._id)}
                                    title={collapsed[post._id] ? 'Expand' : 'Collapse'}
                                >
                                    {collapsed[post._id] ? '▸ Show' : '▾ Hide'}
                                </button>
                                {userId && post.userId?.toString() === userId?.toString() && (
                                    <button
                                        className="delete-post-btn"
                                        onClick={() => handleDelete(post._id)}
                                        title="Delete post"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                        {!collapsed[post._id] && (
                            <p className="post-content">{post.content}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
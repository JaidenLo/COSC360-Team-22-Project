import React, { useState } from 'react';
import '../styles/ThreadsPage.css';

const ThreadPage = ({ user, posts, addNewPost, bookTitle, onBack }) => {
  const [newPost, setNewPost] = useState('');

  const handlePostChange = (e) => {
    setNewPost(e.target.value);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost) {
      const currentTime = new Date().toLocaleString();
      const newPostObj = {
        id: Date.now(), // use Date.now() for unique IDs
        time: currentTime,
        username: user.username,
        content: newPost,
        image: require('../images/defaultpfp.jpg'),
      };
      addNewPost(newPostObj);
      setNewPost('');
    }
  };

  return (
    <div className="thread-page-container">
      <button className="back-button" onClick={onBack}>← Back to Book</button>
      <h1 className="thread-title">{bookTitle} — Threads</h1>

      {/* Display all posts */}
      <div className="posts-container">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="post-header">
              <img src={post.image} alt={post.username} className="profile-image" />
              <div className="post-info">
                <h3 className="username">{post.username}</h3>
                <p className="post-time">{post.time}</p>
              </div>
            </div>
            <p className="post-content">{post.content}</p>
          </div>
        ))}
      </div>

      {/* New Post Form */}
      <div className="post-form">
        <textarea
          placeholder="Write a reply..."
          value={newPost}
          onChange={handlePostChange}
        ></textarea>
        <button onClick={handlePostSubmit}>Post</button>
      </div>
    </div>
  );
};

export default ThreadPage;
import React, { useState } from 'react';
import ThreadPage from './components/ThreadsPage';
import BookDescription from './components/BookDescription';

const App = () => {
  // Example user data (use real authentication for a production app)
  const [user] = useState({
    username: 'John Cena',
    userId: '123',
  });

  // State to hold the list of posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'John Cena',
      time: '2 hours ago',
      content: 'I LOVE GATSBY',
      image: require('./images/defaultpfp.jpg'),
    },
    {
      id: 2,
      username: 'Jane Doe',
      time: '3 hours ago',
      content: 'I HATE GASTBY',
      image: require('./images/defaultpfp.jpg'),
    },
  ]);


  const addNewPost = (newPostObj) => {
    setPosts([...posts, newPostObj]); 
  };

  return (
    <div className="App">
      <h1>Welcome to the Virtual Library</h1>
      <ThreadPage user={user} posts={posts} addNewPost={addNewPost} />
    </div>
  );
};

export default App;
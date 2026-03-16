import React, { useState } from 'react';
import ThreadPage from './components/ThreadsPage';
import BookDescription from './components/BookDescription';

const App = () => {
  const [view, setView] = useState('book'); // 'book' or 'threads'

  const [user] = useState({
    username: 'John Cena',
    userId: '123',
  });

  const [book] = useState({
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genres: ['Novel', 'Fiction'],
    available: true,
    location: 'Shelf A3',
    description: 'A story of wealth, love, and the American Dream set in the 1920s.',
    image: require('./images/The_Great_Gatsby_Cover_1925_Retouched.jpg'),
  });

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
      {view === 'book' ? (
        <BookDescription
          book={book}
          onViewThreads={() => setView('threads')}
        />
      ) : (
        <ThreadPage
          user={user}
          posts={posts}
          addNewPost={addNewPost}
          bookTitle={book.title}
          onBack={() => setView('book')}
        />
      )}
    </div>
  );
};

export default App;
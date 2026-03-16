import React, { useState } from 'react';
import Form from './components/Form';
import BookList from './components/BookList';
import ThreadPage from './components/ThreadsPage';
import BookDescription from './components/BookDescription';

const App = () => {
  const [view, setView] = useState('login'); // 'login' | 'booklist' | 'book' | 'threads'
  const [user, setUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

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
      content: 'I HATE GATSBY',
      image: require('./images/defaultpfp.jpg'),
    },
  ]);

  const addNewPost = (newPostObj) => {
    setPosts([...posts, newPostObj]);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setView('booklist');
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setView('book');
  };

  return (
    <div className="App">
      {view === 'login' && (
        <Form onSuccess={handleLogin} />
      )}

      {view === 'booklist' && (
        <BookList onSelectBook={handleSelectBook} />
      )}

      {view === 'book' && selectedBook && (
        <BookDescription
          book={selectedBook}
          onViewThreads={() => setView('threads')}
          onBack={() => setView('booklist')}
        />
      )}

      {view === 'threads' && selectedBook && (
        <ThreadPage
          user={user}
          posts={posts}
          addNewPost={addNewPost}
          bookTitle={selectedBook.title}
          onBack={() => setView('book')}
        />
      )}
    </div>
  );
};

export default App;
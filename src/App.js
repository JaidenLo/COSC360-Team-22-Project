import React from 'react';
import BookDescription from './components/BookDescription';

const App = () => {
  const book = {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genres: ['Fiction', 'Classics'],
    available: true,
    location: 'UBCO Library',
    image: require('./images/The_Great_Gatsby_Cover_1925_Retouched.jpg'),  
    description: 'A story of the mysterious Jay Gatsby and his obsession with Daisy Buchanan.',
  };

  return (
    <div className="App">
      <h1>Welcome to the Virtual Library</h1>
      <BookDescription book={book} />
    </div>
  );
};

export default App;
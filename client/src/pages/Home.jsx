import BookCard from "../components/BookCard";
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer.jsx";
import Nav from "../components/Nav.jsx";

import './Home.css';

function Home() {

    //fetch how many books from the server or database then load all of books in list of books on home page

    const [books, setBook] = useState("");



    return (
        <>
            
        <div className="books-container">
            {/* {books.map((book) => setBook(
                <BookCard 
                    key={book.id} 
                    title={book.title}
                    category={book.category} 
                    ownderId={book.ownerId}
                />
            ))} */}
            <BookCard />
            <BookCard />
            <BookCard />
            <BookCard />

        </div>
            
        </>
    );
}

export default Home;
import Nav from "./Nav";
import Form from "./Form";
import Footer from "./Footer";
import { useState } from "react"
import UserProfile from "./UserProfile";
import BookCard from "./BookCard";
import "./App.css";



function App () {
    const [user, setUser] = useState(null);

    // dummy book list to display when logged in
    const books = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        title: `Book ${i + 1}`,
        category: "Category",
        image: `/src/assets/book${i + 1}.jpg`,
        
        // image could be dynamic later
    }));

    return (
        <>
            <Nav />

            {user ? (
                <>
                    <UserProfile username={user.username} email={user.email} />

                    <div className="books-container">
                        {books.map((book) => (
                            <BookCard key={book.id} />
                        ))}
                    </div>
                </>
            ) : (
                <Form onSuccess={setUser} />
            )}

            <Footer />
        </>
    );
}
export default App;

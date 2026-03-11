import Nav from "./Nav";
import Form from "./Form";
import Footer from "./Footer";
import { useState } from "react"
import UserProfile from "./UserProfile";
import "./App.css";



function App () {
    const [user, setUser] = useState(null);
    return (
        <>
            <Nav />
            {/* <Form /> */}

            {user ? <UserProfile username={user.username} email={user.email} /> : <Form onSuccess={setUser} />}
            <Footer />
        </>
    );
}
export default App;

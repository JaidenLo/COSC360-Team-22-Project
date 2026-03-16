import { useEffect,useState } from "react";
import { Routes, Route } from "react-router-dom"; // to make links in the nav bar to work no let page to reload when click on links
import Form from "./components/Form";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import BookCard from "./components/BookCard";
import UserProfile from "./components/UserProfile";
import RegisterForm from "./components/RegisterForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from './pages/Home';
import "./App.css";



function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  return (
    <div>
      <Nav />
      <Routes>       {/* Only one page shows at a time */}
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        {/* 
         
        <Route path="/profile"   element={<UserProfile />} /> */}
        
        <Route path="/register"  element={<Register />} />
      </Routes>
      <p>{message}</p>
      {/* <h1>MERN App</h1>
     
      <Form /> 
      <Footer /> */}
      <Footer />

    </div>
  )
}

export default App
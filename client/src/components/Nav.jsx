import "./Nav.css";
import { Link } from 'react-router-dom'; // allow links to work

function Nav () {
    return (
        <nav className="nav">
            <ul>


                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/About">About</Link></li>
                
            </ul>
        </nav>
    );
}
export default Nav;

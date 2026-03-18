import "./Nav.css";
import { Link, useNavigate } from 'react-router-dom';

function Nav({ user, setUser }) {
    const navigate = useNavigate();

    function handleLogout() {
        setUser(null);
        navigate('/login');
    }

    return (
        <nav className="nav">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/About">About</Link></li>

                {user ? (
                    <>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}
export default Nav;
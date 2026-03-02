import "./Nav.css";

function Nav () {
    return (
        <nav className="nav">
            <ul>
                <li>
                    <a href="#home">Home</a>
                </li>
                <li>
                    <a href="#news">News</a>
                </li>
                <li>
                    <a href="#contact">Contact</a>
                </li>
                <li>
                    <a href="#about">About</a>
                </li>
            </ul>
        </nav>
    );
}
export default Nav;

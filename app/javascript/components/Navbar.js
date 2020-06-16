import React from 'react'
import { Link } from 'react-router-dom'

class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar">
                <div className="navbar-title">Cooking Classics Anywhere</div>
                <div className="navbar-links-section">
                    <Link to="/" className="navbar-link">Home</Link> 
                    <Link to="/about" className="navbar-link">About</Link>
                </div>
                <hr></hr>
            </nav>
        )
    }
}

export default Navbar
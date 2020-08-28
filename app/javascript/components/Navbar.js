import React from 'react'
import { Link } from 'react-router-dom'

class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar">
                <div className="navbar-title">Cooking Classics <span>Anywhere</span></div>
                <div className="navbar-links-section">
                    <Link to="/" className="navbar-link">Home</Link> 
                    <Link to="/about" className="navbar-link">About</Link>
                    <Link to="/cookbook" className="navbar-link">Our Cookbook</Link>
                    <Link to="/recipe-photos" className="navbar-link">Photo Gallery</Link>
                    <Link to="/seasonal" className="navbar-link">Seasonal Recipes</Link>
                    <Link to="/cooking-videos" className="navbar-link">Videos</Link>
                </div>
                <br />
            </nav>
        )
    }
}

export default Navbar

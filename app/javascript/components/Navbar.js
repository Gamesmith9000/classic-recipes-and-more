import React from 'react'
import { Link } from 'react-router-dom'

class Navbar extends React.Component {
    render() {
        const links =
            <div className="navbar-links-section">
                <Link to="/" className="navbar-link">Home</Link> 
                <Link to="/about" className="navbar-link">About</Link>
                <Link to="/cookbook" className="navbar-link">Cookbook</Link>
                <Link to="/photo-gallery" className="navbar-link">Photo Gallery</Link>
                <Link to="/featured-recipes" className="navbar-link">Featured/Seasonal Recipes</Link>
                <Link to="/shop" className="navbar-link">Shop</Link>
                <Link to="/cooking-videos" className="navbar-link">Videos</Link>
                
                <Link to="/content" className="navbar-link">CONTENT MANAGER HOME</Link>
            </div>;


        return (
            <nav className="navbar">
                <div className="navbar-title">Classic Recipes &amp; More</div>
                { this.props.disableLinks === true
                    ? null
                    : links
                }
                <br />
            </nav>
        )
    }
}

export default Navbar

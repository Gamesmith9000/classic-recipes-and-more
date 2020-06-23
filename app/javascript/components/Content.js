import React from 'react'
import Navbar from './Navbar'
import firebaseApp from 'FirebaseInit'
import { Link } from 'react-router-dom'

class Content extends React.Component {
    getPageContent () {
        if(this.isAuthenticated === true){
            return(
                <div>Authenticated</div>    // Temporary content
            )
        } else {
            return(                         // Temporary jsx setup
                <div>Login Required
                    <br/>     
                    <Link to="/content/login">Login</Link>
                </div>
            )
        }
    }

    isAuthenticated () {
        return (firebaseApp.auth().currentUser !== null);
    }

    render() {
        return (
            <div className="content">
                <Navbar />
                Content Management
                { this.getPageContent() }
            </div>
        )
    }
}

export default Content

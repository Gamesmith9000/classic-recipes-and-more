import React from 'react'
import Navbar from './Navbar'
import firebaseApp from 'FirebaseInit'
import { Link } from 'react-router-dom'

class Content extends React.Component {
    isAuthenticated () {
        return (firebaseApp.auth().currentUser !== null);
    }

    render() {
        return (
            <div className="content">
                <Navbar />
                Content Management
                {
                    this.isAuthenticated === true ?
                    <div>Authenticated</div>
                    :
                    <div>
                        Login Required
                        <br/>     
                        <Link to="/content/login">Login</Link>
                    </div>
                }
            </div>
        )
    }
}

export default Content

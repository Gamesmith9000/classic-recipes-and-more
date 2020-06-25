import React from 'react'
import Navbar from './Navbar'
import AdminLogin from './AdminLogin';

class Content extends React.Component {
    constructor() {
        super();
        this.state = {
            currentUser: null
        }
    }

    setCurrentUser = (userData) => {
        this.setState({ currentUser: userData });
    }

    render() {
        return (
            <div className="content">
                <Navbar />
                Content Management
                {
                    this.state.currentUser !== null ?
                    <div>{this.state.currentUser.email} is logged in.</div>
                    :
                    <AdminLogin setCurrentUser={this.setCurrentUser} />
                    /*
                    <div>
                        Login Required
                        <br/>     
                        <Link to="/content/login">Login</Link>
                    </div>
                    */
                }
            </div>
        )
    }
}

export default Content

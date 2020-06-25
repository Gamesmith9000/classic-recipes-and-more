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

    componentDidMount() {
        if(this.state.currentUser == null){
            const storedUser = JSON.parse(localStorage.getItem('currentUser'));
            if(storedUser !== null) {
                this.setCurrentUser(storedUser);
            }
        }
    }

    setCurrentUser = (userData) => {
        localStorage.setItem('currentUser', JSON.stringify(userData));
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
                }
            </div>
        )
    }
}

export default Content

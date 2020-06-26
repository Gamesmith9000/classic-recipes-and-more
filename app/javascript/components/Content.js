import React from 'react'
import Navbar from './Navbar'
import AdminLogin from './AdminLogin';
import ContentManager from './ContentManager';

class Content extends React.Component {
    constructor() {
        super();
        this.state = {
            currentUser: null
        }
    }

    componentDidMount() {
        if(this.state.currentUser === null || this.state.currentUser.email === null || this.state.currentUser.lastLoginAt === null || this.state.currentUser.uid === null){
            const storedUser = JSON.parse(localStorage.getItem('currentUser'));
            if(storedUser !== null && storedUser.email !== null && storedUser.lastLoginAt !== null && storedUser.uid !== null) {
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
                [Content Component]
                {
                    this.state.currentUser !== null ?
                    <div>
                        {this.state.currentUser.email} is logged in.
                        <ContentManager />
                        </div>
                    :
                    <AdminLogin setCurrentUser={this.setCurrentUser} />
                }
            </div>
        )
    }
}

export default Content

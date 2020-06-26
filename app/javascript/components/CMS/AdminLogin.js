import React from 'react'
import firebaseApp from 'FirebaseInit'

class AdminLogin extends React.Component {
    submitCredentials = (event) => {
        firebaseApp.auth().signInWithEmailAndPassword(this.email.value, this.password.value)
        .then( (res) => this.props.setCurrentUser(firebaseApp.auth().currentUser))
        .catch((err) => console.log(err));

        event.preventDefault();
    }
    render() {
        return (
            <div className="admin-login">
                [Admin Login Component]
                <div className="login-section">
                    <h1>Sign In</h1>
                    <form onSubmit={this.submitCredentials} className="login-form">
                        <label>Email</label>
                        <input
                            placeholder="name@example.com"
                            type="email"
                            ref={input => this.email = input}
                        />
                        <label>Password</label>
                        <input 
                            type="password"
                            ref={input => this.password = input}    
                        />
                        <input 
                            type="submit"
                            onSubmit={this.submitCredentials}
                        />
                    </form>
                    
                </div>
            </div>
        )
    }
}

export default AdminLogin

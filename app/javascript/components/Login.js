import React, { Fragment } from 'react'
import axios from 'axios'

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            deviseLoginPage: null
        }
    }

    componentDidMount () {
        axios.get('/admins/sign_in')
        .then(res => {
            this.setState({
                deviseLoginPage: res.data
            });
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <Fragment>
                {this.state.deviseLoginPage &&
                    <iframe 
                        className="devise-login-iframe"
                        id="devise-login-iframe"
                        srcDoc={this.state.deviseLoginPage}
                    />
                }
            </Fragment>
        )
    }
}

export default Login

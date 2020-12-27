import React, { Fragment, useState } from 'react'
import axios from 'axios'
import { setAxiosCsrfToken } from '../../Utilities/Helpers';

function AdminUserDisplay (props) {
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();
        
        axios.get('/admins/sign_out')
        .then(res => {
            setLoggingOut(true);
        })
        .catch(err => {
            setLoggingOut(true);
        });
    }

    return (
        <Fragment>
            { loggingOut === false 
            ?
                <div className="admin-user-display">
                    <div>{`User: ${props.displayName}`}</div>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            :
                <Fragment>
                    { window.location.replace('/') }
                </Fragment>
            }
        </Fragment>
    );
}

export default AdminUserDisplay;
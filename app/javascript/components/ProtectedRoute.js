import React from 'react'
import { Link, Route } from 'react-router-dom'


const ProtectedRoute = ({component: Component, ...rest}) => (

    //const currentAdmin = props.currentAdmin;
    <Route {...rest} render={() => (
        (currentAdmin && currentAdmin !== "" && currentAdmin != "nil" && currentAdmin.includes("@"))
        ? <Component {...props} />
        : <div>NEED TO LOG IN</div>
    )} />
)

export default ProtectedRoute

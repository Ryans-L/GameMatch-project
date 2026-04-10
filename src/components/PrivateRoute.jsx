import React from 'react';
import { UserAuth } from "../context/AuthContext"
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({children}) => {
    const { session } = UserAuth();

    // While auth state is still loading
    if (session === undefined){
        return <p>Loading...</p>
    }

    // Allow protected page only if user is signed in
    return <>{session ? children : <Navigate to="/signup" />}</>;
};

export default PrivateRoute;
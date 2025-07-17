import React from 'react';
import useAuth from '../hoooks/useAuth';
import LoadingSpinner from '../Shared/LoadingSpinner/LoadingSpinner';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({children}) => {
    const {authLoading,user} = useAuth();
    const location = useLocation();

    if(authLoading){
        return <LoadingSpinner></LoadingSpinner>
    }
    if(!user){
        return <Navigate to='/login' state={{ from: location }} replace></Navigate>
    }
    return children;
};

export default PrivateRoute;
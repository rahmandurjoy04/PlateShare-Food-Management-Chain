import React from 'react';
import useAuth from '../hoooks/useAuth';
import LoadingSpinner from '../Shared/LoadingSpinner/LoadingSpinner';
import useGetUserRole from '../hoooks/useGetUserRole';
import Forbidden from '../Pages/Forbidden/Forbidden';

const TransactionRoute = ({children}) => {
    const {user,authLoading} = useAuth();
    const {role,roleLoading} = useGetUserRole();

    if(authLoading || roleLoading){
        return <LoadingSpinner/>
    }

    if(!user || (role !=='user' && role !=='charity')){
        return <Forbidden></Forbidden>
    }
    return children;
};

export default TransactionRoute;
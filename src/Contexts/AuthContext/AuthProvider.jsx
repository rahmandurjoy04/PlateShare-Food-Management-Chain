import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut,GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.init';
import axios from 'axios';

const gooogleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [authLoading, setLoading] = useState(true);

    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = ()=>{
        setLoading(true);
        return signInWithPopup(auth,gooogleProvider)
    }

    const updateUserProfilePhoto = (photoURL) => {
    if (auth.currentUser) {
        return updateProfile(auth.currentUser, {
            photoURL: photoURL
        }).then(() => {
            // refresh state so React re-renders with new photo
            setUser({ ...auth.currentUser });
        });
    }
};


    const logoutUser = () => {
        localStorage.removeItem('token')
        return signOut(auth);

    };

   

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            if(currentUser?.email){
                axios.post(`${import.meta.env.VITE_BaseURL}/jwt`,{email:currentUser?.email})
                .then(res=>{
                    localStorage.setItem('token',res.data.token)
                })
            }else{
                localStorage.removeItem('token')
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        authLoading,
        registerUser,
        loginUser,
        logoutUser,
        googleSignIn,
        updateUserProfilePhoto
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
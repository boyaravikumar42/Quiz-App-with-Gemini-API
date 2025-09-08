import React, { use,useEffect } from 'react';
import axios from 'axios';
import { createContext,useState } from 'react';
export const LoginContext = React.createContext();

export const LoginContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/get`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => {
            if (response.status === 200) {
                // console.log('Login successful:', response.data);
                setUser(response.data);
                setIsLoggedIn(true);
                
            }   else {
                throw new Error('Login failed');
            }   
        }).catch(error => {
            console.error('Login error:', error);
            setIsLoggedIn(false);
            setUser(null);
        });
    }, [isLoggedIn]);

    const login = (token) => {
        localStorage.setItem('token', token); // Store token in local storage
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token'); // Clear token from local storage
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <LoginContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
}

export const useLoginContext = () => {
    const context = React.useContext(LoginContext);
    if (!context) {
        throw new Error('useLoginContext must be used within a LoginContextProvider');
    }
    return context;
}
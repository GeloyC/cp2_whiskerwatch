import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

const SessionContext = createContext(null);

export function useSession() {
    const context = useContext(SessionContext);
    
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
    }

export function SessionProvider({ children }) {
    const url = `https://whiskerwatch-0j6g.onrender.com`;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [whiskerUpdateTrigger, setWhiskerUpdateTrigger] = useState(0);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
        (config) => {
            if (user) {
                const token = localStorage.getItem('jwt_token');

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                } 
            } 
            
            return config;
        },
            (error) => Promise.reject(error)
        );

        return () => axios.interceptors.request.eject(requestInterceptor);
    }, [user]);

    

    useEffect(() => {
        const responseInterceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401 && user) {
                localStorage.removeItem('jwt_token');
                setUser(null);
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
        );

        return () => axios.interceptors.response.eject(responseInterceptor);
    }, [user]);

    const triggerWhiskerUpdate = () => setWhiskerUpdateTrigger(Date.now());


    const refreshSession = async () => {
        setLoading(true);
        
        try {
            // First attempt: Use cookies only (withCredentials)
            let response = await axios.get(`${url}/user/api/session`, { 
                withCredentials: true 
            });
            
            // If user is authenticated via cookie, we're good
            if (response.data.loggedIn) {
                setUser(response.data.user);
                return;
            }
            
            // Cookie failed - try localStorage token
            const token = localStorage.getItem('jwt_token');
            
            if (!token) {
                setUser(null);
                return;
            }
            
            response = await axios.get(`${url}/user/api/session`, {
                withCredentials: true // Still include in case other cookies are needed
            });
            
            if (response.data.loggedIn) {
                setUser(response.data.user);
            } else {
                localStorage.removeItem('jwt_token'); // Clear invalid token
                setUser(null);
            }
            
        } catch (err) {
            console.error("Session refresh error:", err.response?.data || err.message);
            
            // If it's a 401, clear localStorage token
            if (err.response?.status === 401) {
            localStorage.removeItem('jwt_token');
            }
            
            setUser(null);
        } finally {
            setLoading(false);
        }
        };

    const login = (userData) => setUser(userData);

    const logout = async () => {
        try {
            await axios.post(`${url}/user/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.error("Logout API failed:", err);
        }
        
        // Clear both cookie and localStorage
        localStorage.removeItem('jwt_token');
        setUser(null);
        
        // Clear axios auth header
        delete axios.defaults.headers.common['Authorization'];
        
        await refreshSession();
    };


    const fetchNotifications = async (user_id) => {
        if (!user_id) return;
        try {
            const response = await axios.get(`${url}/user/notifications/${user_id}`);
            setNotifications(response.data);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    useEffect(() => {
        if (user?.user_id) fetchNotifications(user.user_id);
    }, [user]);

    useEffect(() => {
        refreshSession();
    }, []);

    return (
        <SessionContext.Provider
        value={{
            user,
            setUser,
            login,
            loading,
            refreshSession,
            logout,
            notifications,
            fetchNotifications,
            whiskerUpdateTrigger,
            triggerWhiskerUpdate,
        }}
        >
        {children}
        </SessionContext.Provider>
    );
}
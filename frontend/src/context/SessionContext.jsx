import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
    const url = `https://cp2-whiskerwatch.onrender.com`;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [whiskerUpdateTrigger, setWhiskerUpdateTrigger] = useState(0);

    const triggerWhiskerUpdate = () => setWhiskerUpdateTrigger(Date.now());

    const refreshSession = async () => {
        try {
            const res = await axios.get(`${url}/user/api/session`, {
                withCredentials: true,
            });
            setUser(res.data.user || null);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try { await axios.post( `${url}/user/logout`,
                {},
                { withCredentials: true }
            );
            console.log("Logged out successfully");
        } catch (err) {
            console.error("Logout failed:", err);
        }
        
        setUser(null);
    };

    const fetchNotifications = async (user_id) => {
        if (!user_id) return;
        try {
            const response = await axios.get(`${url}/user/notifications/${user_id}`);
            setNotifications(response.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    useEffect(() => {
        if (user?.user_id) {
        fetchNotifications(user.user_id);
        }
    }, [user]);

    useEffect(() => {
        refreshSession();
    }, []);

    return (
        <SessionContext.Provider
        value={{ user, setUser, login, loading, refreshSession, logout , notifications, fetchNotifications, whiskerUpdateTrigger, triggerWhiskerUpdate}}
        >
        {children}
        </SessionContext.Provider>
    );
};

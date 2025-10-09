import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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

    const triggerWhiskerUpdate = () => setWhiskerUpdateTrigger(Date.now());

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const refreshSession = async () => {
        // const token = getCookie("token");
        const token = Cookies.get("token");
        if (!token) {
            setUser(null);
            return;
        }
        
        try {
            const response = await axios.get(`${url}/user/api/session`, { withCredentials: true });
            setUser(response.data.loggedIn ? response.data.user : null);
            console.log("Session refreshed:", response.data);
        } catch (err) {
            console.error("Session refresh error:", err);
            setUser(null);
        }
    };

    const login = (userData) => setUser(userData);

    // const logout = async () => {
    //     try {
    //     await axios.post(`${url}/user/logout`, {}, { withCredentials: true });
    //     console.log("Logged out successfully");
    //     } catch (err) {
    //     console.error("Logout failed:", err);
    //     }
    //     setUser(null);
    //     await refreshSession(); // Ensure session state is updated
    //     navigate("/login");
    // };

    const logout = async () => {
        try {
            const response = await axios.post(`${url}/user/logout`, {}, { withCredentials: true });
            console.log("Logout response:", response.data);
            Cookies.remove("token", { path: "/" });
        } catch (err) {
            console.error("Logout failed:", err);
        }
        
        setUser(null);
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

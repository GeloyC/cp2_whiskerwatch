// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from 'js-cookie';

// const SessionContext = createContext(null);

// export function useSession() {
//     const context = useContext(SessionContext);
    
   
//     if (!context) {
//         throw new Error("useSession must be used within a SessionProvider");
//     }
//     return context;
//     }

// export function SessionProvider({ children }) {
//     const url = `https://whiskerwatch-0j6g.onrender.com`;

//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [notifications, setNotifications] = useState([]);
//     const [whiskerUpdateTrigger, setWhiskerUpdateTrigger] = useState(0);

//     axios.defaults.withCredentials = true;

//     const triggerWhiskerUpdate = () => setWhiskerUpdateTrigger(Date.now());


//     const refreshSession = async () => {
//         // const token = getCookie("token");
//         const token = Cookies.get("token");
//         if (!token) {
//             setUser(null);
//             setLoading(false);

//             return;
//         }
        
//         try {
//             const response = await axios.get(`${url}/user/api/session`, { 
//                 withCredentials: true,
//                 headers: {
//                     Authorization: `Bearer ${token}`, // Send token in header
//                 },
//             });
//             setUser(response.data.loggedIn ? response.data.user : null);
//             console.log("Session refreshed:", response.data);
//         } catch (err) {
//             console.error("Session refresh error:", err);
//             setUser(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const login = (userData) => setUser(userData);

//     const logout = async () => {
//         try {
//             const response = await axios.post(`${url}/user/logout`, {}, { withCredentials: true });
//             console.log("Logout response:", response.data);
//             Cookies.remove("token", { path: "/" });
//         } catch (err) {
//             console.error("Logout failed:", err);
//         }
        
//         setUser(null);
//         await refreshSession();
//     };

//     const fetchNotifications = async (user_id) => {
//         if (!user_id) return;
//         try {
//         const response = await axios.get(`${url}/user/notifications/${user_id}`);
//         setNotifications(response.data);
//         } catch (err) {
//         console.error("Failed to fetch notifications:", err);
//         }
//     };

//     useEffect(() => {
//         if (user?.user_id) fetchNotifications(user.user_id);
//     }, [user]);

//     useEffect(() => {
//         refreshSession();
//     }, []);

//     return (
//         <SessionContext.Provider
//         value={{
//             user,
//             setUser,
//             login,
//             loading,
//             refreshSession,
//             logout,
//             notifications,
//             fetchNotifications,
//             whiskerUpdateTrigger,
//             triggerWhiskerUpdate,
//         }}
//         >
//         {children}
//         </SessionContext.Provider>
//     );
// }

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
    const triggerWhiskerUpdate = () => setWhiskerUpdateTrigger(Date.now());

    // const refreshSession = async () => {
    //     try {
    //         const storedUser = localStorage.getItem("user");
    //         const response = await axios.get(`${url}/user/api/session`, {
    //             withCredentials: true,
    //         });
    //         // setUser(response.data.loggedIn ? response.data.user : storedUser);
    //         // localStorage.setItem("user", JSON.stringify(response.data.user));

    //         if (response.data.loggedIn) {
    //             setUser(response.data.user);
    //             localStorage.setItem("user", JSON.stringify(response.data.user));
    //         } else {
    //             setUser(null);
    //             localStorage.removeItem("user"); // Clear stale data
    //         }

    //     } catch (err) {
    //         console.error("Session refresh error:", err);
    //         const storedUser = localStorage.getItem("user");
    //         if (storedUser) {
    //             setUser(JSON.parse(storedUser));
    //             console.warn("Falling back to localStorage user:", storedUser);
    //         } else {
    //             setUser(null);
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };




    // const login = (userData) => setUser(userData);
    
  

    // const refreshSession = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.get(`${url}/user/api/session`, {
    //             withCredentials: true,
    //         });
    //         console.log("Session refresh response:", response.data, "Cookies sent:", document.cookie);
    //         if (response.data.loggedIn) {
    //         setUser(response.data.user);
    //         try {
    //             localStorage.setItem("user", JSON.stringify(response.data.user));
    //             console.log("LocalStorage updated in refreshSession:", JSON.parse(localStorage.getItem("user")));
    //         } catch (e) {
    //             console.error("Failed to update localStorage in refreshSession:", e);
    //         }
    //         } else {
    //         console.warn("Session not logged in, preserving existing localStorage");
    //         const storedUser = localStorage.getItem("user");
    //         if (storedUser) {
    //             setUser(JSON.parse(storedUser));
    //             console.log("Falling back to localStorage:", storedUser);
    //         } else {
    //             setUser(null); // Only clear user if no localStorage
    //         }
    //         }
    //     } catch (err) {
    //         console.error("Session refresh error:", err.message, "Cookies available:", document.cookie);
    //         const storedUser = localStorage.getItem("user");
    //         if (storedUser) {
    //         setUser(JSON.parse(storedUser));
    //         console.log("Error fallback to localStorage:", storedUser);
    //         } else {
    //         setUser(null);
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const refreshSession = async () => {
        setLoading(true);
        let isCookieAvailable = true;
        try {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
            const response = await axios.get(`${url}/user/api/session`, {
                headers: { Authorization: `Bearer ${storedToken}` }, // Send token in header
            });
            console.log("Session refresh response:", response.data, "Token used:", storedToken);
            if (response.data.loggedIn) {
                setUser(response.data.user);
                try {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                console.log("LocalStorage updated in refreshSession:", JSON.parse(localStorage.getItem("user")));
                } catch (e) {
                console.error("Failed to update localStorage in refreshSession:", e);
                }
            } else {
                console.warn("Session not logged in, preserving localStorage");
                isCookieAvailable = false;
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                setUser(JSON.parse(storedUser));
                console.log("Falling back to localStorage:", storedUser);
                } else {
                setUser(null);
                }
            }
            } else {
            console.warn("No stored token, session invalid");
            isCookieAvailable = false;
            setUser(null);
            }
        } catch (err) {
            console.error("Session refresh error:", err.message);
            isCookieAvailable = false;
            const storedUser = localStorage.getItem("token") ? localStorage.getItem("user") : null;
            if (storedUser) {
            setUser(JSON.parse(storedUser));
            console.log("Error fallback to localStorage:", storedUser);
            } else {
            setUser(null);
            }
        } finally {
            setLoading(false);
            setUser((prev) => ({ ...prev, isCookieAvailable }));
        }
    };


    
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Sync with backup
    };

    const logout = async () => {
        try {
            await axios.post(`${url}/user/logout`, {}, { withCredentials: true });
            Cookies.remove("token", { path: "/" });
        } catch (err) {
        console.error("Logout failed:", err);
        }
        
        setUser(null);
        localStorage.removeItem("user");
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
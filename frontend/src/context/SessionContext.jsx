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
    //     // const token = getCookie("token");
    //     const token = Cookies.get("token");
    //     if (!token) {
    //         setUser(null);
    //         setLoading(false);

    //         return;
    //     }
        
    //     try {
    //         const response = await axios.get(`${url}/user/api/session`, { 
    //             withCredentials: true,
    //             headers: {
    //                 Authorization: `Bearer ${token}`, // Send token in header
    //             },
    //         });
    //         setUser(response.data.loggedIn ? response.data.user : null);
    //         console.log("Session refreshed:", response.data);
    //     } catch (err) {
    //         console.error("Session refresh error:", err);
    //         setUser(null);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const refreshSession = async () => {
    //     try {
    //         const response = await axios.get(`${url}/user/api/session`, { 
    //         withCredentials: true,  // Browser sends cookie automatically
    //         });
    //         setUser(response.data.loggedIn ? response.data.user : null);
    //         console.log("Session refreshed:", response.data);
    //     } catch (err) {
    //         console.error("Session refresh error:", err);
    //         setUser(null);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
            console.log("Session refreshed via cookie:", response.data);
            return;
            }
            
            // Cookie failed - try localStorage token
            console.log("Cookie authentication failed, trying localStorage token");
            const token = localStorage.getItem('jwt_token');
            
            if (!token) {
            console.log("No token found in localStorage");
            setUser(null);
            return;
            }
            
            // Second attempt: Use Authorization header
            response = await axios.get(`${url}/user/api/session`, {
            headers: { 
                Authorization: `Bearer ${token}`
            },
            withCredentials: true // Still include in case other cookies are needed
            });
            
            if (response.data.loggedIn) {
            setUser(response.data.user);
            console.log("Session refreshed via Authorization header:", response.data);
            } else {
            console.log("Both cookie and token authentication failed");
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






// ******************** USING LOCALSTORAGE ******************** //

// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const SessionContext = createContext(null);

// export function useSession() {
//     const context = useContext(SessionContext);
//     if (!context) {
//         throw new Error("useSession must be used within a SessionProvider");
//     }
//     return context;
//     }

//     export function SessionProvider({ children }) {
//     const url = `https://whiskerwatch-0j6g.onrender.com`;

//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [notifications, setNotifications] = useState([]);
//     const [whiskerUpdateTrigger, setWhiskerUpdateTrigger] = useState(0);

//     const triggerWhiskerUpdate = () => setWhiskerUpdateTrigger(Date.now());

//     // ✅ Attach token to all outgoing axios requests
//     axios.interceptors.request.use((config) => {
//         const token = localStorage.getItem("token");
//         if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     });

//     // ✅ Refresh session using JWT token
//     const refreshSession = async () => {
//         setLoading(true);
//         try {
//         const storedToken = localStorage.getItem("token");
//         if (!storedToken) {
//             console.warn("No stored token — user not logged in");
//             setUser(null);
//             setLoading(false);
//             return;
//         }

//         // Verify token on backend
//         const response = await axios.get(`${url}/user/api/session`, {
//             headers: { Authorization: `Bearer ${storedToken}` },
//         });

//         if (response.data?.loggedIn) {
//             setUser(response.data.user);
//             localStorage.setItem("user", JSON.stringify(response.data.user));
//         } else {
//             console.warn("Session not valid, clearing storage");
//             setUser(null);
//             localStorage.removeItem("user");
//             localStorage.removeItem("token");
//         }
//         } catch (err) {
//         console.error("Session refresh error:", err.message);
//         // fallback to localStorage user if available
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//             console.warn("Fallback to localStorage user");
//         } else {
//             setUser(null);
//         }
//         } finally {
//         setLoading(false);
//         }
//     };

//     // Login helper — stores user & token in localStorage
//     const login = (userData, token) => {
//         setUser(userData);
//         localStorage.setItem("user", JSON.stringify(userData));
//         if (token) localStorage.setItem("token", token);
//     };

//     //  Logout — clears everything
//     const logout = async () => {
//         try {
//         await axios.post(`${url}/user/logout`);
//         } catch (err) {
//         console.error("Logout failed:", err.message);
//         }
//         setUser(null);
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//     };

//     // ✅ Fetch user notifications
//     const fetchNotifications = async (user_id) => {
//         if (!user_id) return;
//         try {
//         const response = await axios.get(`${url}/user/notifications/${user_id}`);
//         setNotifications(response.data);
//         } catch (err) {
//         console.error("Failed to fetch notifications:", err);
//         }
//     };

//     // Auto-fetch notifications when user changes
//     useEffect(() => {
//         if (user?.user_id) fetchNotifications(user.user_id);
//     }, [user]);

//     // Restore session on app load
//     useEffect(() => {
//         refreshSession();
//     }, []);

//     return (
//         <SessionContext.Provider
//         value={{
//             user,
//             setUser,
//             login,
//             logout,
//             loading,
//             refreshSession,
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

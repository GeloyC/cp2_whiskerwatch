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
            console.log("Interceptor triggered for:", config.url);
            console.log("Current user state:", user ? "Authenticated" : "Not authenticated");
            if (user) {
            const token = localStorage.getItem('jwt_token');
            console.log("Token from localStorage:", token ? `${token.substring(0, 20)}...` : "No token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log("Added Authorization header to:", config.url);
            } else {
                console.warn("No token found in localStorage");
            }
            } else {
            console.warn("No user in context, skipping Authorization");
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
            console.log("401 detected - logging out");
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
                return;
            }
            
            // Cookie failed - try localStorage token
            const token = localStorage.getItem('jwt_token');
            
            if (!token) {
                setUser(null);
                return;
            }
            
            console.log("Cookie failed, using localStorage token (via interceptor)");
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

    // const logout = async () => {
    //     try {
    //         const response = await axios.post(`${url}/user/logout`, {}, { withCredentials: true });
    //         console.log("Logout response:", response.data);
    //         Cookies.remove("token", { path: "/" });
    //     } catch (err) {
    //         console.error("Logout failed:", err);
    //     }
        
    //     setUser(null);
    //     await refreshSession();
    // };

    // const logout = async () => {
    //     try {
    //         // Clear server-side cookie first
    //         await axios.post(`${url}/user/logout`, {}, { 
    //         withCredentials: true 
    //         });
    //         console.log("Server logout successful");
    //     } catch (err) {
    //         console.error("Logout API failed:", err);
    //         // Continue with client-side cleanup even if server fails
    //     }
        
    //     // CRITICAL: Clear token BEFORE setting user to null
    //     localStorage.removeItem('jwt_token');
    //     console.log("Token removed from localStorage");
        
    //     // Clear axios default auth header
    //     delete axios.defaults.headers.common['Authorization'];
        
    //     // Clear axios interceptors to prevent token re-injection
    //     axios.interceptors.request.eject(
    //         axios.interceptors.request.handlers.find(h => 
    //         h.onFulfilled.toString().includes('localStorage.getItem')
    //         )?.id
    //     );
    //     console.log("Axios interceptors cleared");
        
    //     // Set user to null
    //     setUser(null);
        
    //     // DON'T call refreshSession() - it would re-add the interceptor and token
    //     setLoading(false);
        
    //     // Redirect to login manually
    //     window.location.href = '/login'; // or use navigate from react-router
    // };

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

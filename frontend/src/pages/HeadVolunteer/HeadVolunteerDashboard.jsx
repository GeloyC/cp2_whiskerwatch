import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CatBot from "../../components/CatBot";
import NavigationBar from "../../components/NavigationBar";
import SideNavigation from "../../components/SideNavigation";
import Footer from "../../components/Footer";
import Cookies from 'js-cookie'

import { useSession } from "../../context/SessionContext";
import HeadVolunteerSideBar from "../../components/HeadVolunteerSideBar";


const HeadVolunteerDashboard = () => {

    const navigate = useNavigate();
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);

    const { user } = useSession();

    const itemsPerPage = 3;
    const totalPages = Math.ceil(apps.length / itemsPerPage);

    useEffect(() => {
        const user = Cookies.get("user");
        if (user.role !== "head_volunteer") {
            return;
        } else {
            navigate("/");
        }

        const fetchUserAndDonations = async () => {
        try {
            const response = await axios.get(
            "http://localhost:5000/api/donations",
            {
                withCredentials: true,
            }
            );

            const data = Array.isArray(response.data)
            ? response.data
            : response.data.donations || [];

            setApps(data);
            setLoading(true);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch data");
            setLoading(false);
        }
        };

        fetchUserAndDonations();
    }, [navigate]);

    const startIndex = (page - 1) * itemsPerPage;
    const currentApps = apps.slice(startIndex, startIndex + itemsPerPage);

    // if (loading)
    //     return (
    //     <div className="flex justify-center items-center h-screen">
    //         Loading...
    //     </div>
    //     );
    // if (error)
    //     return (
    //     <div className="flex justify-center items-center h-screen text-red-600">
    //         Error: {error}
    //     </div>
    //     );

    console.log("Rendering HeadVolunteerMainPage");
    
    return (
        
        <div>
        <div className="flex flex-col min-h-screen pb-10">
            <CatBot/>
            <NavigationBar/>
            <div></div>
            <div className="grid grid-cols-[80%_20%] h-full pb-30 pt-10">
            <div className="p-10">
                <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead>
                    <tr className="bg-[#DC8801] text-white text-sm">
                        <th className="px-6 py-3">Application No.</th>
                        <th className="px-6 py-3">User ID</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Date Submitted</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-700">
                    {currentApps.length === 0 ? (
                        <tr>
                        <td colSpan="6" className="px-6 py-3 text-center">
                            No donations found.
                        </td>
                        </tr>
                    ) : (
                        currentApps.map((app) => (
                        <tr
                            key={app.applicationNo}
                            className="border-b border-[#DC8801]"
                        >
                            <td className="px-6 py-3">{app.applicationNo}</td>
                            <td className="px-6 py-3">{app.user_id}</td>
                            <td className="px-6 py-3">{app.name}</td>
                            <td className="px-6 py-3">{app.type}</td>
                            <td className="px-6 py-3">{app.date}</td>
                            <td className="px-6 py-3 flex items-center gap-2">
                            <span
                                className={
                                app.status === "Pending"
                                    ? "text-yellow-600"
                                    : app.status === "Approved"
                                    ? "text-blue-600"
                                    : "text-red-600"
                                }
                            >
                                {app.status}
                            </span>
                            {app.status === "Pending" ? (
                                <button className="px-4 py-1 rounded-lg text-white bg-lime-500 hover:bg-lime-600">
                                Process
                                </button>
                            ) : (
                                <button className="px-4 py-1 rounded-lg text-white bg-blue-500 hover:bg-blue-600">
                                View
                                </button>
                            )}
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 mt-6 pt-10 pb-10">
                    <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                    >
                    Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded ${
                        page === i + 1
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-100 hover:bg-gray-300"
                        }`}
                    >
                        {i + 1}
                    </button>
                    ))}
                    <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                    >
                    Next
                    </button>
                </div>
                </div>
            </div>
            <div className="overflow-y-auto max-h-screen">
             
            {user?.role === "head_volunteer" && "admin" ? (
                <HeadVolunteerSideBar />
            ) : (
                <SideNavigation />
            )}

            </div>
            </div>
            <Footer />
        </div>
        </div>
    );
  
}

export default HeadVolunteerDashboard
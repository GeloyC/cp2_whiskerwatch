import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../../components/NavigationBar";
import SideNavigation from "../../components/HeadVolunteerSideBar";
import Footer from "../../components/Footer";
import { useSession } from "../../context/SessionContext";

const AdoptionApplications = () => {
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(apps.length / itemsPerPage);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "head_volunteer") {
        navigate("/");
        return;
      }

      const fetchAdoptions = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/adopt/api/adoption",
            { withCredentials: true }
          );
          setApps(response.data);
        } catch (err) {
          setError(err.response?.data?.error || "Failed to fetch data");
        }
      };

      fetchAdoptions();
    }
  }, [user, loading, navigate]);

  const startIndex = (page - 1) * itemsPerPage;
  const currentApps = apps.slice(startIndex, startIndex + itemsPerPage);

  const handleViewPDF = async (adoptionId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/adopt/api/adoption/${adoptionId}/pdf`,
        { responseType: "blob" } // important for PDF
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL); // open PDF in new tab
    } catch (err) {
      alert("Failed to fetch PDF");
      console.error(err);
    }
  };

  const handleProcess = async (adoptionId) => {
    // Example: just mark as Approved (you can add real backend endpoint)
    try {
      await axios.post(
        `http://localhost:5000/adopt/api/adoption/${adoptionId}/approve`,
        {},
        { withCredentials: true }
      );
      setApps((prev) =>
        prev.map((app) =>
          app.applicationNo === adoptionId
            ? { ...app, status: "Approved" }
            : app
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to process adoption");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <NavigationBar />
      <div className="grid grid-cols-[80%_20%] h-full pb-30 pt-10">
        <div className="p-10">
          <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-[#DC8801] text-white text-sm">
                  <th className="px-6 py-3">Adoption No.</th>
                  <th className="px-6 py-3">User ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Cat Name</th>
                  <th className="px-6 py-3">Date Submitted</th>
                  <th className="px-6 py-3">Form</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentApps.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-3 text-center">
                      No adoption applications found.
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

                      {/* PDF column */}
                      <td className="px-6 py-3 flex items-center gap-2">
                        <button
                          onClick={() => handleViewPDF(app.applicationNo)}
                          className="px-4 py-1 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                        >
                          View PDF
                        </button>
                      </td>

                      {/* Status column */}
                      <td className="px-6 py-3">
                        {app.status === "Pending" ? (
                          <button
                            onClick={() => handleProcess(app.applicationNo)}
                            className="px-4 py-1 rounded-lg text-white bg-lime-500 hover:bg-lime-600"
                          >
                            Process
                          </button>
                        ) : (
                          <span
                            className={
                              app.status === "Approved"
                                ? "text-blue-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {app.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination */}
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
          <SideNavigation />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdoptionApplications;
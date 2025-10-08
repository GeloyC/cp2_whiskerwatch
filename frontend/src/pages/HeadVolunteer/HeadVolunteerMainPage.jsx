import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../../components/NavigationBar";
import SideNavigation from "../../components/HeadVolunteerSideBar";
import Footer from "../../components/Footer";
import CatBot from "../../components/CatBot";
import { useSession } from "../../context/SessionContext";

const HeadVolunteerMainPage = () => {
  const [selectedProof, setSelectedProof] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (proofUrl) => {
    setSelectedProof(proofUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProof(null);
    setIsModalOpen(false);
  };

  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const { user, loading } = useSession();
  const itemsPerPage = 3;
  const totalPages = Math.ceil(apps.length / itemsPerPage);
  const handleApprove = async (donationId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/donateapi/donations/${donationId}/approve`,
        {},
        { withCredentials: true }
      );

      alert(res.data.message);

      setApps((prev) =>
        prev.map((app) =>
          app.donationId === donationId ? { ...app, status: "Approved" } : app
        )
      );
    } catch (err) {
      console.error("❌ Approval error:", err.response?.data || err.message);
      alert("Failed to approve donation");
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "head_volunteer") {
        navigate("/");
        return;
      }

      const fetchUserAndDonations = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/donate/api/donations",
            { withCredentials: true }
          );

          const data = Array.isArray(response.data)
            ? response.data
            : response.data.donations || [];

          setApps(data);
        } catch (err) {
          setError(err.response?.data?.error || "Failed to fetch data");
        }
      };

      fetchUserAndDonations();
    }
  }, [user, loading, navigate]);

  const startIndex = (page - 1) * itemsPerPage;
  const currentApps = apps.slice(startIndex, startIndex + itemsPerPage);

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
    <div>
      <div className="flex flex-col min-h-screen pb-10">
        <CatBot />
        <NavigationBar />
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
                    <th className="px-6 py-3">Proof of Payment</th>
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
                        key={app.donationId}
                        className="border-b border-[#DC8801]"
                      >
                        <td className="px-6 py-3">{app.donationId}</td>
                        <td className="px-6 py-3">{app.userId}</td>
                        <td className="px-6 py-3">{app.name}</td>
                        <td className="px-6 py-3">
                          {/* show multiple types as chips/badges */}
                          {Array.isArray(app.type)
                            ? app.type.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                                >
                                  {t}
                                </span>
                              ))
                            : app.type}
                        </td>
                        <td className="px-6 py-3">{app.date}</td>

                        {/*PROOF OF PAYMENT */}
                        <td className="px-6 py-3 text-center">
                          {app.proofUrl ? (
                            <button
                              onClick={() => openModal(app.proofUrl)}
                              className="bg-[#DC8801] text-white px-4 py-2 rounded-lg hover:bg-[#ffb030] active:bg-[#DC8801] font-bold shadow"
                            >
                              View Proof
                            </button>
                          ) : (
                            <span className="text-gray-400">No Proof</span>
                          )}
                        </td>

                        <td className="px-6 py-3 flex items-center gap-2">
                          {/* if backend doesn’t return status, default to Pending */}
                          <span
                            className={
                              app.status === "Approved"
                                ? "text-blue-600"
                                : app.status === "Rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }
                          >
                            {app.status || "Pending"}
                          </span>
                          {!app.status || app.status === "Pending" ? (
                            <button
                              onClick={() => handleApprove(app.donationId)}
                              className="px-4 py-1 rounded-lg text-white bg-lime-500 hover:bg-lime-600"
                            >
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
                {isModalOpen && (
                  <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6 relative">
                      <button
                        onClick={closeModal}
                        className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
                      >
                        ✖
                      </button>
                      <h2 className="text-lg font-bold mb-4 text-[#DC8801]">
                        Proof of Payment
                      </h2>
                      <img
                        src={selectedProof}
                        alt="Proof of Payment"
                        className="w-full max-h-[80vh] object-contain rounded-lg border"
                      />
                    </div>
                  </div>
                )}
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
            <SideNavigation />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default HeadVolunteerMainPage;
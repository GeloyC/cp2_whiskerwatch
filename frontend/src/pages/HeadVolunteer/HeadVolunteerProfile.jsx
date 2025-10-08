import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../../components/NavigationBar";
import SideNavigation from "../../components/HeadVolunteerSideBar";
import Footer from "../../components/Footer";
import CatBot from "../../components/CatBot";

const HeadVolunteerProfile = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [user, setUser] = useState(null); // user profile info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(apps.length / itemsPerPage);

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    const storedUser = sessionStorage.getItem("user");

    if (role !== "head_volunteer" || !storedUser) {
      navigate("/");
      return;
    }

    const { user_id } = JSON.parse(storedUser);

    const fetchData = async () => {
      try {
        // Fetch donations
        const donationsRes = await axios.get(
          "http://localhost:5000/api/donations",
          {
            withCredentials: true,
          }
        );
        const donationData = Array.isArray(donationsRes.data)
          ? donationsRes.data
          : donationsRes.data.donations || [];
        setApps(donationData);

        // Fetch user profile
        const userRes = await axios.get(
          `http://localhost:5000/user/api/users/${user_id}`
        );
        setUser(userRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.error || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
              <div className="flex justify-center gap-2 mt-6 pt-10 pb-10">
                <div className="grid grid-cols-[20%_80%] bg-[#FFF] rounded-[12px] overflow-hidden">
                  <div className="flex flex-col gap-10 pt-10">
                    <div className="flex flex-row justify-between items-center p-3 bg-[#FFF] rounded-tr-[20px] rounded-br-[20px] shadow-md">
                      <label className="font-bold text-[#DC8801]">
                        Adoptee Form
                      </label>
                      <div className="flex items-center justify-center w-[30px] h-auto">
                        <img
                          src="src/assets/icons/clipboard-white.png"
                          alt="white clipboard"
                          className="w-full h-auto "
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col bg-[#FFF] p-10 gap-5">
                    <div className="flex flex-col gap-4 bg-[#FDF5D8] p-10 rounded-[15px] shadow-md">
                      {/* MAIN PROFILE */}
                      <div className="relative flex flex-row gap-5">
                        <div className="flex w-[250px] h-[200px] bg-[#B5C04A] rounded-sm p-2">
                          <img
                            src="/src/assets/UserProfile/Profile.jpg"
                            alt="Profile"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex flex-row gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="font-bold">Name:</label>
                            <label>
                              {user?.firstname} {user?.lastname}
                            </label>
                          </div>
                          <div className="flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="flex flex-row items-center font-bold gap-[5px]">
                              <div className="w-[30px] h-auto">
                                <img
                                  src="/src/assets/icons/location-orange.png"
                                  alt=""
                                />
                              </div>
                              Address:
                            </label>
                            <label>{user?.address || "Not provided"}</label>
                          </div>
                          <div className="flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="flex flex-row items-center font-bold gap-[5px]">
                              <div className="w-[30px] h-auto">
                                <img
                                  src="/src/assets/icons/email-orange.png"
                                  alt=""
                                />
                              </div>
                              Email:
                            </label>
                            <label>{user?.email}</label>
                          </div>
                          <div className="flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="flex flex-row items-center font-bold gap-[5px]">
                              <div className="w-[30px] h-auto">
                                <img
                                  src="/src/assets/icons/badge-orange.png"
                                  alt=""
                                />
                              </div>
                              Badge:
                            </label>
                            <label>{user?.badge || "No badge yet"}</label>
                          </div>
                          <label className="leading-tight text-[14px] pt-4 pb-2 text-[#645e5f]">
                            {user?.badge
                              ? `You've received the ${user.badge} badge! Thanks for your support.`
                              : "You don't have any badges yet. Keep contributing to earn one!"}
                          </label>
                        </div>
                        <div className="absolute bottom-0 left-0 flex flex-row gap-2">
                          <button className="bg-[#B5C04A] min-w-[90px] p-2 rounded-[10px] text-[#000] hover:bg-[#CFDA34] active:bg-[#B5C04A]">
                            Edit Profile
                          </button>
                          <button className="bg-[#B5C04A] min-w-[90px] p-2 rounded-[10px] text-[#000] hover:bg-[#CFDA34] active:bg-[#B5C04A]">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 bg-[#FDF5D8] p-10 rounded-[15px] shadow-md">
                      {/* WHISKER METER */}
                      Badge Design Here
                      <progress
                        className="w-full 
                                [&::-webkit-progress-bar]:rounded-lg 
                                [&::-webkit-progress-value]:rounded-lg 
                                [&::-webkit-progress-bar]:bg-slate-300 
                                [&::-webkit-progress-value]:bg-[#B5C04A]
                                [&::-moz-progress-bar]:bg-green-400"
                        value="50"
                        max="100"
                      >
                        100%
                      </progress>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SideNavigation />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default HeadVolunteerProfile;
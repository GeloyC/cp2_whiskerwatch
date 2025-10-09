import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import PopLogout from "../modal/PopLogout.jsx";
// import { useWhiskerMeter } from "../context/WhiskerMeterContext.jsx";
import { useSession } from "../context/SessionContext.jsx";

const SideNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout, loading: sessionLoading } = useSession();

  const [showAlert, setShowAlert] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);

  const isLoggedIn = !!user;

  // Fetch profile image
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user) return;

      try {
        const res = await axios.get("${url}/user/profile", {
          withCredentials: true,
        });

        setProfileImage(res.data.profile_image);
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      }
    };

    fetchProfileImage();
  }, [user]);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  const verifyLoggedIn = (e, path) => {
    e.preventDefault();

    if (!user) {
      setShowAlert(true);
    } else {
      navigate(path);
    }
  };




  const handleLogout = () => {
    logout(); // Clear session context
    window.location.href = "/home"; // Navigate to home
  };

  const toggleProfileMenu = () => {
    setIsVisible((prev) => !prev);
  };
  

  const sideItemStyle =
    "relative flex items-center justify-start gap-4 xl:w-full lg:w-fit md:w-fit sm:w-fit h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-6 pt-2 pb-2 cursor-pointer bg-white border-2 border-white shadow-md active:bg-[#fdf4d5] hover:text-[#DC8801]";
  const sideItemStyleCurrent =
    "relative flex items-center justify-start gap-4 xl:w-full lg:w-fit md:w-fit sm:w-fit h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-6 pt-2 pb-2 cursor-pointer bg-white border-2 drop-shadow-md border-[#DC8801] text-[#DC8801]";

  return (
    <div ref={menuRef} className="fixed right-0 top-[20%] flex flex-col items-end gap-4 min-w-[200px] h-auto z-50">
      {/* Profile Section */}
      <div
        onClick={toggleProfileMenu}
        className={location.pathname === "/profile" ? sideItemStyleCurrent : sideItemStyle}
      >
        <div className="flex flex-row items-center gap-2">
          <div className="flex justify-center items-center w-[40px] h-[40px] bg-[#FFF] rounded-[25px] overflow-hidden">
            <img
              src={
                profileImage
                  ? `${url}/FileUploads/${profileImage}`
                  : "/src/assets/icons/account.png"
              }
              alt="account"
              className="w-full h-full object-cover"
            />
          </div>
          <label className="hidden cursor-pointer xl:flex md:hidden sm:hidden">
            {sessionLoading
              ? "Loading..."
              : user
              ? `${user.firstname} ${user.lastname}`
              : "Guest"}
          </label>
          <button
            className="grid place-items-center w-[35px] h-auto p-2 rounded-[25px] hover:bg-[#f9e390] active:bg-[#FFF]">
            <img src="/src/assets/icons/down-arrow-orange.png" alt="down" />
          </button>
        </div>
      </div>


      {/* ▼ Profile Dropdown Menu */}
      <div
        className="absolute right-18 top-12 w-40 box-border bg-[#FFF] shadow-md rounded-[15px] rounded-tr-[0px] overflow-hidden z-[9999]"
        style={{ minHeight: "fit-content" }}
      >
        {isLoggedIn ? (
          <div className={isVisible ? "grid place-items-center gap-1 p-2" : "hidden"}>
            <Link
              to="/profile"
              className="text-[#000] text-center p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"
              onClick={() => setIsVisible(false)}
            >
              My Profile
            </Link>

            {/* Uncomment this if you want dashboard navigation by role */}
            {user.role === 'head_volunteer' ? (
              <Link to={'/dashboard'} className="text-[#000] p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"> 
                Dashboard
              </Link>

            ) : ('')}

            <button
              className="text-[#000] text-center p-3 pl-6 bg-[#fef8e2] pr-6 w-full hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"
              onClick={() => {
                setShowLogoutModal(true);
                setIsVisible(false);
              }}
            >
              Log out
            </button>
          </div>
        ) : (
          <div className={isVisible ? "grid place-items-center gap-1 p-2" : "hidden"}>
            <Link
              to="/login"
              className="text-[#000] p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"
              onClick={() => setIsVisible(false)}
            >
              Log in
            </Link>
          </div>
        )}
      </div>

      {showAlert && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
          <div className="flex flex-col gap-3 bg-white p-6 rounded shadow-md text-center max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">ACCOUNT REQUIRED</h2>
            <p className="mb-4">Please log in to access the page.</p>
            <div className="flex justify-center gap-4">
              <Link to="/login" onClick={() => setShowAlert(false)} className="bg-[#99A339] text-white px-4 py-2 rounded-[10px] hover:scale-105 active:scale-95 transition-all duration-100">
                Go to Login
              </Link>
              <Link to="/home" onClick={() => setShowAlert(false)} className="bg-[#DC8801] text-[#FFF] px-4 py-2 rounded-[10px] hover:scale-105 active:scale-95 transition-all duration-100">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      )}
        

      {/* Navigation Links */}
      <div className="flex flex-col justify-center gap-4 pl-12">
        <Link onClick={(e) => verifyLoggedIn(e, "/donate")} className={location.pathname === "/donate" ? sideItemStyleCurrent : sideItemStyle}>
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/donation.png" alt="donation" />
          </div>
          <label className="hidden cursor-pointer xl:flex md:hidden sm:hidden">Donate</label>
        </Link>

        <Link to="/catadoption" className={location.pathname === "/catadoption" ? sideItemStyleCurrent : sideItemStyle}>
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/paws.png" alt="cat adoption" />
          </div>
          <label className="hidden cursor-pointer xl:flex md:hidden sm:hidden">Cat Adoption</label>
        </Link>

        <Link onClick={(e) => verifyLoggedIn(e, "/feeding")} className={location.pathname === "/feeding" ? sideItemStyleCurrent : sideItemStyle}>
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/pet-food.png" alt="feeding" />
          </div>
          <label className="hidden cursor-pointer xl:flex md:hidden sm:hidden">Feeding</label>
        </Link>

        <Link
          to="/communityguide"
          className={location.pathname === "/communityguide" ? sideItemStyleCurrent : sideItemStyle}
        >
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/information.png" alt="info" />
          </div>
          <label className="hidden cursor-pointer xl:flex lg:hidden md:hidden sm:hidden">Community Guidelines</label>
        </Link>
      </div>

      

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <PopLogout
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
};

export default SideNavigation;

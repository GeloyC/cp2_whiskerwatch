import React, { useState, useEffect, useRef } from 'react'
import logo from '/assets/whiskerwatchlogo-no textmarks.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell';
import PopLogout from "../modal/PopLogout.jsx";
import Cookies from 'js-cookie';


import { useSession } from '../context/SessionContext';
import axios from 'axios';


const pageStyling = 'hidden xl:flex lg:flex md:flex sm:hidden items-center justify-center box-content h-full px-[10px] py-[6px] rounded-[10px] hover:bg-[#DC8801] hover:text-[#FFF] hover:cursor-pointer active:bg-[#FFF] active:text-[#DC8801] active:cursor-pointer';

const pageCurrent = 'hidden xl:flex lg:flex md:flex sm:hidden items-center justify-center box-content h-full px-[10px] py-[6px] rounded-[10px] hover:bg-[#DC8801] text-[#FFF] hover:cursor-pointer active:bg-[#FFF] active:text-[#DC8801] active:cursor-pointer bg-[#DC8801]';

const NavigationBar = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;

  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout, loading: sessionLoading } = useSession();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [MenuVisible, setMenuVisible] = useState(false);

  const profileMenuRef  = useRef(null);
  const mobileMenuRef = useRef(null);
  const isLoggedIn = !!user;



  // fetch profile image
  useEffect(() => { 
    const fetchProfileImage = async () => {
      if (!user) {
        setProfileImage('/assets/icons/account.png');
        return;
      }

      try {
        const response = await axios.get(`${url}/user/profile`, { 
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Explicitly send token
          },
        });

        setProfileImage(response.data.profile_image || '/assets/icons/account.png');
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
        setProfileImage(null);
      }
    }

    fetchProfileImage();
  }, [user]); 

  // verify login for Donate & Feeding page
  const verifyLoggedIn = (e, path) => {
    e.preventDefault();

    if (!user) {
      setShowAlert(true);
    } else {
      navigate(path);
    }
  }


  const toggleProfileMenu = () => {
    setIsVisible((prev) => !prev);
  };

  const toggleShowMenu = () => {
    setMenuVisible((prev) => !prev);
  }

  const handleLogout = async () => {
    await logout(); 
    setShowLogoutModal(false);
    window.location.href = "/home"; 
  };


  // Clicking outside of element hides the profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideProfile = profileMenuRef.current && !profileMenuRef.current.contains(event.target);
      const clickedOutsideMobile = mobileMenuRef.current && !mobileMenuRef.current.contains(event.target);

      if (isVisible && clickedOutsideProfile) {
        setIsVisible(false);
      }

      if (MenuVisible && clickedOutsideMobile) {
        setMenuVisible(false);
      }
    };

    if (isVisible || MenuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, MenuVisible]);


  return (
    <div className='
      sticky top-0
      flex flex-col items-center w-full
      bg-[#f9f7dc] z-999'
      >
        <div  className='flex items-center justify-between w-full z-999 px-4 h-[75px]'>
          <Link to="/home" className='flex items-center justify-center h-[50px] w-auto'>
            <img className='max-w-full max-h-full object-contain'
            src={logo} alt="whiskerwatch logo" />
          </Link>
          
          <div className='hidden xl:flex lg:flex md:flex sm:hidden flex-row justify-evenly items-center gap-2'>
            <Link to="/home" className={location.pathname ==='/home' ? pageCurrent : pageStyling}>HOME</Link>
            <Link to="/aboutus" className={location.pathname ==='/aboutus' ? pageCurrent : pageStyling}>ABOUT US</Link>
            <Link to="/catcareguides" className={location.pathname ==='/catcareguides' ? pageCurrent : pageStyling}>CAT CARE GUIDES</Link>
            <Link to="/contactus" className={location.pathname ==='/contactus' ? pageCurrent : pageStyling}>CONTACT US</Link>
            
          </div>


            {/* Profile Menu */}
            {isLoggedIn ? (
              <div className='flex items-center justify-center w-fit border-box gap-2'>

                {/* Menu */}
                <div ref={mobileMenuRef}  className='relative'>
                  <button onClick={toggleShowMenu} className={`flex xl:hidden lg:hidden md:hidden sm:flex size-9 relative flex gap-2 items-center active:scale-90 ${MenuVisible ? 'rotate-90' : 'rotate-180'} transition-all duration-100`}>
                    <img src="/assets/icons/burger-bar.png" alt="" />
                  </button>

                  {/* Dropdown for mobile view */}
                  <div className={MenuVisible ? 'absolute top-1 right-8 w-auto h-auto flex flex-col xl:hidden lg:hidden md:hidden bg-[#FFF] rounded-[10px] rounded-tr-[0px] border-2 border-[#DC8801] overflow-hidden whitespace-nowrap' : 'hidden'}>
                    <Link to='/home' className='p-2 px-4 active:bg-[#F9F7DC] cursor-pointer'>HOME</Link>
                    <Link to='/aboutus' className='p-2 px-4 active:bg-[#F9F7DC] cursor-pointer'>ABOUT US</Link>
                    <Link to='/catcareguides' className='p-2 px-4 active:bg-[#F9F7DC] cursor-pointer'>CAT CARE GUIDES</Link>
                    <Link to='/contactus' className='p-2 px-4 active:bg-[#F9F7DC] cursor-pointer'>CONTACT US</Link>
                  </div>
                </div>

                <NotificationBell />
                <div ref={profileMenuRef} className='relative flex-col'>
                  <div onClick={toggleProfileMenu} className='cursor-pointer relative size-10 rounded-[25px] bg-[#FFF] border-3 border-[#DC8801] overflow-hidden
                  active:scale-95 active:bg-white/50'>
                    <img
                      src={
                        profileImage
                          ? profileImage.startsWith("http")
                            ? profileImage
                            : profileImage.includes("FileUploads/")
                            ? `${url}/${profileImage}`
                            : `${url}/FileUploads/${profileImage}`
                          : "/assets/icons/account.png"
                      }
                    alt="profile" />
                  </div>

                  {/* dropdown: Show User fullname, my profile page,  */}
                  <div className={isVisible ? 'absolute right-5  xl:top-10 xl:right-5 lg:right-5 md:right-5 flex flex-col items-start xl:w-auto h-auto bg-[#FFF] border-2 border-[#DC8801] rounded-[10px] rounded-tr-[4px] overflow-hidden' : 'hidden'}>
                    <div className='flex flex-col'>
                      <Link to="/profile" className='whitespace-nowrap font-bold text-[#B67101] hover:bg-[#F9F7DC] p-2 px-4'>{`${user?.firstname} ${user?.lastname}`}</Link>
                    </div>

                    {/* Display if user role is head_volunteers */}
                    <Link to='/dashboard' className={user?.role === 'head_volunteer' || user?.role === 'admin' ? 'w-full font-bold hover:bg-[#F9F7DC] p-2 px-4' : 'hidden'}>Dashboard</Link>

                    <button onClick={() => { setShowLogoutModal(true); setIsVisible(false); }}
                    className='w-full font-bold text-left p-2 px-4 hover:bg-[#F9F7DC]'>Log out</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex items-center gap-1'>
                
                
                <div ref={mobileMenuRef}  className='relative'>
                  <button onClick={toggleShowMenu} className={`flex xl:hidden lg:hidden md:hidden sm:flex size-9 relative flex gap-2 items-center active:scale-90 ${MenuVisible ? 'rotate-90' : 'rotate-180'} transition-all duration-100`}>
                    <img src="/assets/icons/burger-bar.png" alt="" />
                  </button>

                  {/* Dropdown for mobile view */}
                  <div className={MenuVisible ? 'absolute top-1 right-8 w-auto h-auto flex flex-col xl:hidden lg:hidden md:hidden bg-[#FFF] rounded-[10px] rounded-tr-[0px] border-2 border-[#DC8801] overflow-hidden whitespace-nowrap' : 'hidden'}>
                    <Link to='/home' className='p-2 px-4 active:bg-[#F9F7DC] cursor-pointer'>HOME</Link>
                    <Link to='/aboutus' className='p-2 px-4 active:bg-[#F9F7DC] cursor-pointer'>ABOUT US</Link>
                    <Link to='/catcareguides' className='p-2 px-4 active:bg-[#F9F7DC] cursor-pointer'>CAT CARE GUIDES</Link>
                    <Link to='/contactus' className='p-2 px-4 active:bg-[#F9F7DC] cursor-pointer'>CONTACT US</Link>
                  </div>
                </div>
                <Link to='/login'
                className='bg-[#FFF] font-bold text-[#889132] rounded-[5px] px-4 py-1 border-2 border-[#B5C04A] hover:scale-105 active:scale-97 transition-all duration-100'>
                  Log in
                </Link>

                <Link to='/signup'
                className='bg-[#DC8801] font-bold text-[#FFF] rounded-[5px] px-4 py-1 border-2 border-[#B67101] hover:scale-105 active:scale-97 transition-all duration-100'>
                  Sign Up
                </Link>
              </div>
            )}

      </div>

      {showAlert && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-9999">
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <PopLogout
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
      
      {/* Lower Navigation link */}
      <div className='flex justify-start xl:justify-center lg:justify-center md:justify-center sm:justify-center items-center w-full h-auto bg-[#DC8801] scrollable-hide-scroll overflow-x-auto whitespace-nowrap'>
          <Link onClick={(e) => verifyLoggedIn(e, "/donate")}
          className={`text-[#FFF] font-bold hover:bg-[#2F2F2F] active:bg-[#DC8801] p-2 px-4 ${location.pathname === '/donate' ? 'bg-[#2F2F2F]' : ''}`}>DONATE</Link>
          <Link to="/catadoption" 
          className={`text-[#FFF] font-bold hover:bg-[#2F2F2F] active:bg-[#DC8801] p-2 px-4 ${location.pathname === '/catadoption' ? 'bg-[#2F2F2F]' : ''}`}>CAT ADOPTION</Link>
          <Link onClick={(e) => verifyLoggedIn(e, "/feeding")} 
          className={`text-[#FFF] font-bold hover:bg-[#2F2F2F] active:bg-[#DC8801] p-2 px-4 ${location.pathname === '/feeding' ? 'bg-[#2F2F2F]' : ''}`}>FEEDING</Link>
          <Link to="/communityguide"
          className={`text-[#FFF] font-bold hover:bg-[#2F2F2F] active:bg-[#DC8801] p-2 px-4 ${location.pathname === '/communityguide' ? 'bg-[#2F2F2F]' : ''}`}>COMMUNITY GUIDELINES</Link>
      </div>
    </div>
  )
}

export default NavigationBar
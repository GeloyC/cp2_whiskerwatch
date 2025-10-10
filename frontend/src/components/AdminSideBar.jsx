// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import axios from 'axios';

// import { useSession } from '../context/SessionContext';

// const AdminSideBar = ({className}) => {
//   const url = `https://whiskerwatch-0j6g.onrender.com`;

//   const location = useLocation();
//   const navigate = useNavigate();

//   // const [user, setUser] = useState({ firstname: '', lastname: '', role: '' });
//   const { user, logout, loading: sessionLoading } = useSession();
//   const [profileImage, setProfileImage] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const menuRef = useRef(null);

//   const [sidebarShow, setSidebarShow] = useState(false);
//   const sidebarRef = useRef(null);

//   const isLoggedIn = !!user

//   useEffect(() => {
//       const fetchProfileImage = async () => {
//         if (!user) {
//           setProfileImage(null);
//           return;
//         }

//         try {
//           const res = await axios.get(`${url}/user/profile`, {
//             withCredentials: true,
//             headers: {
//               Authorization: `Bearer ${Cookies.get('token')}`, // Explicitly send token
//             },
//           });
//           setProfileImage(res.data.profile_image || null); // Set filename or null
//           setError('');
//         } catch (err) {
//           console.error('Failed to fetch profile image:', err);
//           setError(err.response?.data?.error || 'Failed to fetch profile image');
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchProfileImage();
//     }, [user]);
  

//   const [isVisible, setIsvisible] = useState(false);
//   const toggleVisibilityProfile = () => {
//     setIsvisible(!isVisible);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsvisible(false);
//       }
//     };

//     if (isVisible) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isVisible]);

//   const [dropdown, setDropdown] = useState({
//     adopters: false,
//     feeding: false,
//     manage: false,
//   });

//   const toggleDropdown = (dropdownKey) => {
//     setDropdown((prev) => ({
//       ...prev,
//       [dropdownKey]: !prev[dropdownKey],
//     }));
//   };

  
//   const handleLogout = () => {
//     logout();
//     navigate('/home', { replace: true });
//   };



//   const handleShowSidebar = () => {
//     setSidebarShow((prev) => !prev)
    
//   }

//   const sideItemStyle = 'flex flex-col items-start w-full h-auto p-2 cursor-pointer bg-white border-2 border-white';
//   const sideItemStyleCurrent = 'flex flex-col items-start w-full h-auto p-2 cursor-pointer border-2 border-white text-[#DC8801] bg-[#FDF5D8]';
//   const sideItemDownCurrent = 'flex flex-col items-start w-full h-auto p-2 cursor-pointer border-2 border-white';
//   const pageActive = 'flex w-full pl-20 pt-3 pb-2 hover:bg-[#FDF5D8] hover:text-[#DC8801] text-[#DC8801] bg-[#FDF5D8]';
//   const pageInactive = 'bg-[#FFF] w-full pl-20 pt-3 pb-2 hover:text-[#DC8801]';

//   return (
//     <div className={`relative flex flex-col  duration-300 w-auto h-screen bg-[#FFF] z-50 ${className}`}>
//       {error && (
//         <div className='p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]'>
//           {error}
//         </div>
//       )}
//       <div className={`flex items-center justify-center gap-4  w-auto h-auto box-border ${sidebarShow ? 'pl-3 pr-12' : ''} pt-4 pb-4 cursor-pointer bg-white border-b-2 border-b-[#DC8801]`}>
//         <div className={sidebarShow ? 'flex justify-center items-center w-[120px] h-auto p-1' : 'hidden'}>
//           <img onClick={() => navigate('/dashboard')} src="/assets/whiskerwatchlogo-no textmarks.png" alt="account" />
//         </div>
//         <div className={sidebarShow ? 'leading-tight' : 'hidden'}>
//           <label className='font-bold text-[18px]'> ADMIN </label>
//           <label className='font-bold text-[18px]'> DASHBOARD </label>
//         </div>
//         <button className={'self-center w-[40px] h-[40px] object-contain'} onClick={handleShowSidebar}>
//           <img src="/assets/icons/burger-bar.png" alt="burger menu" className={`cursor-pointer w-full h-full object-cover ${sidebarShow ? 'rotate-90' : 'rotate-0'} transition-all duration-300`} />
//         </button>
//       </div>

//       <div className={`flex flex-col ${!sidebarShow ? 'items-center' : ''} justify-between h-full p-1`}>
//         <div className='flex flex-col justify-center '>
//           <Link to="/dashboard" className={location.pathname === "/dashboard" ? sideItemStyleCurrent : sideItemStyle}>
//             <div className='flex flex-row items-center gap-4'>
//               <div className='flex justify-center items-center w-[30px] h-auto'>
//                 <img src="/assets/icons/admin-icons/sidedbar/dashboard.png" alt="account" />
//               </div>
//               <label className={sidebarShow ? 'cursor-pointer font-bold hover:text-[#DC8801]' : 'hidden'}> Overview </label>
//             </div>
//           </Link>

//           <Link to="/admincatprofile" className={user?.role === 'head_volunteer' ? 'hidden' : (location.pathname === "/admincatprofile" || location.pathname === '/catprofileproperty/:cat_id' ? sideItemStyleCurrent : sideItemStyle)}>
//             <div className='flex flex-row items-center gap-4'>
//               <div className='flex justify-center items-center w-[30px] h-auto'>
//                 <img src="/assets/icons/admin-icons/sidedbar/cat-profile.png" alt="account" />
//               </div>
//               <label className={sidebarShow ? 'cursor-pointer font-bold hover:text-[#DC8801]' : 'hidden'}> Cat Profiles </label>
//             </div>
//           </Link>

//           <div className={location.pathname === "/adopterslist" || location.pathname === "/adopterapplication" ? sideItemDownCurrent : sideItemStyle}>
//             <div className='flex flex-row items-center justify-between w-full active:text-[#B5C04A]'>
//               <div className='flex flex-row items-center gap-4'>
//                 <div onClick={handleShowSidebar} className='flex justify-center items-center w-[30px] h-auto'>
//                   <img src="/assets/icons/admin-icons/sidedbar/adopters-visitors.png" alt="account" />
//                 </div>
//                 <label className={sidebarShow ? 'cursor-pointer font-bold hover:text-[#DC8801]' : 'hidden'}> Adopters </label>
//               </div>
//               <button onClick={() => { toggleDropdown('adopters'); }} className={sidebarShow ? 'flex justify-center items-center w-[30px] h-auto p-[8px] rounded-[25px] hover:bg-[#FDF5D8] active:bg-[#FFF]' : 'hidden'}>
//                 <img src="/assets/icons/down-arrow-orange.png" alt="orange arrow" className={!dropdown.adopters & sidebarShow ? 'rotate-0' : '-rotate-90'} />
//               </button>
//             </div>

//             {!dropdown.adopters && (
//               <>
//                 <Link to="/adopterslist" className={sidebarShow ? (location.pathname === "/adopterslist" || location.pathname === "/adopterslist/adopterview" ? pageActive : pageInactive) : 'hidden' }> Adopters List </Link>
//                 <Link to="/adopterapplication" className={sidebarShow ? (location.pathname === "/adopterapplication" || location.pathname === "/adopterapplication/adopterapplicationview" ? pageActive : pageInactive) : 'hidden' }> Applications </Link>
//               </>
//             )}
//           </div>

//           <div className={location.pathname === "/feedingvolunteers" || location.pathname === "/feedingapplications" ? sideItemDownCurrent : sideItemStyle}>
//             <div className='flex flex-row items-center justify-between w-full active:text-[#B5C04A]'>
//               <div className='flex flex-row items-center gap-4'>
//                 <div onClick={handleShowSidebar} className='flex justify-center items-center w-[30px] h-auto'>
//                   <img src="/assets/icons/admin-icons/sidedbar/in-kind-donation-application.png" alt="account" />
//                 </div>
//                 <label className={sidebarShow ? 'cursor-pointer font-bold hover:text-[#DC8801]' : 'hidden'}> Feeding </label>
//               </div>
//               <button onClick={() => {toggleDropdown('feeding');}} className={sidebarShow ? 'flex justify-center items-center w-[30px] h-auto p-[8px] rounded-[25px] hover:bg-[#FDF5D8] active:bg-[#FFF]' : 'hidden'}>
//                 <img src="/assets/icons/down-arrow-orange.png" alt="orange arrow" className={!dropdown.feeding ? 'rotate-0' : '-rotate-90'} />
//               </button>
//             </div>

//             {!dropdown.feeding && (
//               <>
//                 <Link to="/feedingvolunteers" className={sidebarShow ? (location.pathname === "/feedingvolunteers" ? pageActive : pageInactive) : 'hidden'}> Feeding Volunteers </Link>
//                 <Link to="/report" className={sidebarShow ? (location.pathname === "/report" ? pageActive : pageInactive) : 'hidden' }> Feeding Report </Link>
//                 <Link to="/feedingapplications" className={sidebarShow ? (location.pathname === "/feedingapplications" || location.pathname === "/feedingapplications/feedingapplicationview" ? pageActive : pageInactive) : 'hidden'}> Applications </Link>
//                 <Link to="/donationadmin" className={sidebarShow ? (location.pathname === "/donationadmin" ? pageActive : pageInactive) : 'hidden'}> Donations </Link>
//               </>
//             )}
//           </div>

//           <div className={user?.role === 'head_volunteer' ? 'hidden' : (location.pathname === "/adminlist" || location.pathname === "/allusers" ? sideItemDownCurrent : sideItemStyle)}>
//             <div className='flex flex-row items-center justify-between w-full active:text-[#B5C04A]'>
//               <div className='flex flex-row items-center gap-4'>
//                 <div onClick={handleShowSidebar} className='flex justify-center items-center w-[30px] h-auto'>
//                   <img src="/assets/icons/admin-icons/sidedbar/settings.png" alt="account" />
//                 </div>
//                 <label className={sidebarShow ?  'cursor-pointer font-bold hover:text-[#DC8801]' : 'hidden'}> Manage </label>
//               </div>
//               <button onClick={() => { toggleDropdown('manage'); }} className={sidebarShow ? 'flex justify-center items-center w-[30px] h-auto p-[8px] rounded-[25px] hover:bg-[#FDF5D8] active:bg-[#FFF]' : 'hidden'}>
//                 <img src="/assets/icons/down-arrow-orange.png" alt="orange arrow" className={!dropdown.manage & sidebarShow ? 'rotate-0' : '-rotate-90'} />
//               </button>
//             </div>

//             {!dropdown.manage && (
//               <>
//                 <Link to="/adminlist" className={sidebarShow ? (location.pathname === "/adminlist" ? pageActive : pageInactive) : 'hidden'}> Admin List </Link>
//                 <Link to="/allusers" className={sidebarShow ? (location.pathname === "/allusers" || location.pathname === "/userprofile" ? pageActive : pageInactive) : 'hidden'}> All Users </Link>
//               </>
//             )}
//           </div>
//         </div>

//         <div className={`relative flex flex-row items-center ${sidebarShow ? 'justify-between pr-2' : 'justify-center w-fit pr-1'} p-1  gap-3 text-[#000] font-bold bg-[#94b946] rounded-[50px]`}>
//           <div className='flex flex-row items-center gap-3'>
//             <div onClick={toggleVisibilityProfile} className="flex justify-center items-center w-[40px] h-[40px] rounded-[25px] overflow-hidden">
//               <img
//                 src={
//                   profileImage
//                     ? `${url}/FileUploads/${profileImage}`
//                     : '/assets/icons/account.png'
//                 }
//                 alt="account"
//                 className='w-full h-full object-cover'
//               />
//             </div>
//             <label className={!sidebarShow && 'hidden'}>
//               {sessionLoading
//               // loading
//                 ? 'Loading...'
//                 : user
//                 ? `${user?.firstname} ${user?.lastname}`
//                 : 'Guest'}
//             </label>
//           </div>

//           {sidebarShow && (
//             <button  onClick={toggleVisibilityProfile} className='flex justify-center items-center w-[30px] h-auto p-2 bg-[#f0f2c8] hover:bg-[#E3E697] active:bg-[#f0f2c8] rounded-[15px]'>
//               <img src="/assets/icons/admin-icons/arrow-right.png" alt="" />
//             </button>
//           )}

//           <div className={`absolute ${sidebarShow ? 'left-75 bottom-12' : 'left-15 bottom-5'} flex flex-col w-auto gap-2 box-border bg-[#FFF] shadow-md rounded-[15px] rounded-bl-[0px] z-[9999]`}>
//             {isLoggedIn && (
//               <div className={isVisible ? 'flex flex-col w-fit p-2 gap-2' : 'hidden'}>
//                 <Link ref={menuRef} to="/login" onClick={handleLogout} className={'text-[#000] text-center p-3 pl-6 pr-6 w-full bg-[#f0f2c8] hover:bg-[#E3E697] active:bg-[#f0f2c8] active:text-[#FFF] rounded-[10px]'}>
//                   <label className='w-full whitespace-nowrap'>Log out</label>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSideBar;



import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSession } from '../context/SessionContext';

const AdminSideBar = ({ className }) => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;

  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout, loading: sessionLoading } = useSession();
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  const [sidebarShow, setSidebarShow] = useState(false);
  const sidebarRef = useRef(null);

  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user) {
        setProfileImage(null);
        return;
      }

      try {
        const res = await axios.get(`${url}/user/profile`, {
          withCredentials: true,
          // Remove Authorization header
        });
        setProfileImage(res.data.profile_image || null);
        setError('');
      } catch (err) {
        console.error('Failed to fetch profile image:', err);
        setError(err.response?.data?.error || 'Failed to fetch profile image');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();
  }, [user]);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibilityProfile = () => setIsVisible(!isVisible);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible]);

  const [dropdown, setDropdown] = useState({
    adopters: false,
    feeding: false,
    manage: false,
  });

  const toggleDropdown = (dropdownKey) => {
    setDropdown((prev) => ({
      ...prev,
      [dropdownKey]: !prev[dropdownKey],
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/home', { replace: true });
  };

  const handleShowSidebar = () => setSidebarShow((prev) => !prev);

  const sideItemStyle = 'flex flex-col items-start w-full h-auto p-2 cursor-pointer bg-white border-2 border-white';
  const sideItemStyleCurrent = 'flex flex-col items-start w-full h-auto p-2 cursor-pointer border-2 border-white text-[#DC8801] bg-[#FDF5D8]';
  const sideItemDownCurrent = 'flex flex-col items-start w-full h-auto p-2 cursor-pointer border-2 border-white';
  const pageActive = 'flex w-full pl-20 pt-3 pb-2 hover:bg-[#FDF5D8] hover:text-[#DC8801] text-[#DC8801] bg-[#FDF5D8]';
  const pageInactive = 'bg-[#FFF] w-full pl-20 pt-3 pb-2 hover:text-[#DC8801]';

  return (
    <div className={`relative flex flex-col duration-300 w-auto h-screen bg-[#FFF] z-50 ${className}`}>
      {error && (
        <div className="p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]">
          {error}
        </div>
      )}
      <div className={`flex items-center justify-center gap-4 w-auto h-auto box-border ${sidebarShow ? 'pl-3 pr-12' : ''} pt-4 pb-4 cursor-pointer bg-white border-b-2 border-b-[#DC8801]`}>
        <div className={sidebarShow ? 'flex justify-center items-center w-[120px] h-auto p-1' : 'hidden'}>
          <img onClick={() => navigate('/dashboard')} src="/assets/whiskerwatchlogo-no textmarks.png" alt="account" />
        </div>
        <div className={sidebarShow ? 'leading-tight' : 'hidden'}>
          <label className="font-bold text-[18px]">ADMIN</label>
          <label className="font-bold text-[18px]">DASHBOARD</label>
        </div>
        <button className="self-center w-[40px] h-[40px] object-contain" onClick={handleShowSidebar}>
          <img
            src="/assets/icons/burger-bar.png"
            alt="burger menu"
            className={`cursor-pointer w-full h-full object-cover ${sidebarShow ? 'rotate-90' : 'rotate-0'} transition-all duration-300`}
          />
        </button>
      </div>

      <div className={`flex flex-col ${!sidebarShow ? 'items-center' : ''} justify-between h-full p-1`}>
        <div className="flex flex-col justify-center">
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? sideItemStyleCurrent : sideItemStyle}>
            <div className="flex flex-row items-center gap-4">
              <div className="flex justify-center items-center w-[30px] h-auto">
                <img src="/assets/icons/admin-icons/sidedbar/dashboard.png" alt="account" />
              </div>
              <label className={sidebarShow ? 'cursor-pointer font-bold hover:text-[#DC8801]' : 'hidden'}>Overview</label>
            </div>
          </Link>

          <Link
            to="/admincatprofile"
            className={user?.role === 'head_volunteer' ? 'hidden' : location.pathname === '/admincatprofile' || location.pathname === '/catprofileproperty/:cat_id' ? sideItemStyleCurrent : sideItemStyle}
          >
            <div className="flex flex-row items-center gap-4">
              <div className="flex justify-center items-center w-[30px] h-auto">
                <img src="/assets/icons/admin-icons/sidedbar/cat-profile.png" alt="account" />
              </div>
              <label className={sidebarShow ? 'cursor-pointer font-bold hover:text-[#DC8801]' : 'hidden'}>Cat Profiles</label>
            </div>
          </Link>

          <div className={location.pathname === '/adopterslist' || location.pathname === '/adopterapplication' ? sideItemDownCurrent : sideItemStyle}>
            <div className="flex flex-row items-center justify-between w-full active:text-[#B5C04A]">
              <div className="flex flex-row items-center gap-4">
                <div onClick={handleShowSidebar} className="flex justify-center items-center w-[30px] h-auto">
                  <img src="/assets/icons/admin-icons/sidedbar/adopters-visitors.png" alt="account" />
                </div>
                <label className={sidebarShow ? 'cursor-pointer font-bold hover:text-[#DC8801]' : 'hidden'}>Adopters</label>
              </div>
              <button
                onClick={() => toggleDropdown('adopters')}
                className={sidebarShow ? 'flex justify-center items-center w-[30px] h-auto p-[8px] rounded-[25px] hover:bg-[#FDF5D8] active:bg-[#FFF]' : 'hidden'}
              >
                <img
                  src="/assets/icons/down-arrow-orange.png"
                  alt="orange arrow"
                  className={!dropdown.adopters & sidebarShow ? 'rotate-0' : '-rotate-90'}
                />
              </button>
            </div>
            {!dropdown.adopters && (
              <>
                <Link
                  to="/adopterslist"
                  className={sidebarShow ? (location.pathname === '/adopterslist' || location.pathname === '/adopterslist/adopterview' ? pageActive : pageInactive) : 'hidden'}
                >
                  Adopters List
                </Link>
                <Link
                  to="/adopterapplication"
                  className={sidebarShow ? (location.pathname === '/adopterapplication' || location.pathname === '/adopterapplication/adopterapplicationview' ? pageActive : pageInactive) : 'hidden'}
                >
                  Applications
                </Link>
              </>
            )}
          </div>

          <div className={location.pathname === '/feedingvolunteers' || location.pathname === '/feedingapplications' ? sideItemDownCurrent : sideItemStyle}>
            <div className="flex flex-row items-center justify-between w-full active:text-[#B5C04A]">
              <div className="flex flex-row items-center gap-4">
                <div onClick={handleShowSidebar} className="flex justify-center items-center w-[30px] h-auto">
                  <img src="/assets/icons/admin-icons/sidedbar/in-kind-donation-application.png" alt="account" />
                </div>
                <label className={sidebarShow ? 'cursor-pointer font-bold hover:text-[#DC8801]' : 'hidden'}>Feeding</label>
              </div>
              <button
                onClick={() => toggleDropdown('feeding')}
                className={sidebarShow ? 'flex justify-center items-center w-[30px] h-auto p-[8px] rounded-[25px] hover:bg-[#FDF5D8] active:bg-[#FFF]' : 'hidden'}
              >
                <img
                  src="/assets/icons/down-arrow-orange.png"
                  alt="orange arrow"
                  className={!dropdown.feeding ? 'rotate-0' : '-rotate-90'}
                />
              </button>
            </div>
            {!dropdown.feeding && (
              <>
                <Link
                  to="/feedingvolunteers"
                  className={sidebarShow ? (location.pathname === '/feedingvolunteers' ? pageActive : pageInactive) : 'hidden'}
                >
                  Feeding Volunteers
                </Link>
                <Link
                  to="/report"
                  className={sidebarShow ? (location.pathname === '/report' ? pageActive : pageInactive) : 'hidden'}
                >
                  Feeding Report
                </Link>
                <Link
                  to="/feedingapplications"
                  className={sidebarShow ? (location.pathname === '/feedingapplications' || location.pathname === '/feedingapplications/feedingapplicationview' ? pageActive : pageInactive) : 'hidden'}
                >
                  Applications
                </Link>
                <Link
                  to="/donationadmin"
                  className={sidebarShow ? (location.pathname === '/donationadmin' ? pageActive : pageInactive) : 'hidden'}
                >
                  Donations
                </Link>
              </>
            )}
          </div>

          <div className={user?.role === 'head_volunteer' ? 'hidden' : location.pathname === '/adminlist' || location.pathname === '/allusers' ? sideItemDownCurrent : sideItemStyle}>
            <div className="flex flex-row items-center justify-between w-full active:text-[#B5C04A]">
              <div className="flex flex-row items-center gap-4">
                <div onClick={handleShowSidebar} className="flex justify-center items-center w-[30px] h-auto">
                  <img src="/assets/icons/admin-icons/sidedbar/settings.png" alt="account" />
                </div>
                <label className={sidebarShow ? 'cursor-pointer font-bold hover:text-[#DC8801]' : 'hidden'}>Manage</label>
              </div>
              <button
                onClick={() => toggleDropdown('manage')}
                className={sidebarShow ? 'flex justify-center items-center w-[30px] h-auto p-[8px] rounded-[25px] hover:bg-[#FDF5D8] active:bg-[#FFF]' : 'hidden'}
              >
                <img
                  src="/assets/icons/down-arrow-orange.png"
                  alt="orange arrow"
                  className={!dropdown.manage & sidebarShow ? 'rotate-0' : '-rotate-90'}
                />
              </button>
            </div>
            {!dropdown.manage && (
              <>
                <Link
                  to="/adminlist"
                  className={sidebarShow ? (location.pathname === '/adminlist' ? pageActive : pageInactive) : 'hidden'}
                >
                  Admin List
                </Link>
                <Link
                  to="/allusers"
                  className={sidebarShow ? (location.pathname === '/allusers' || location.pathname === '/userprofile' ? pageActive : pageInactive) : 'hidden'}
                >
                  All Users
                </Link>
              </>
            )}
          </div>
        </div>

        <div className={`relative flex flex-row items-center ${sidebarShow ? 'justify-between pr-2' : 'justify-center w-fit pr-1'} p-1 gap-3 text-[#000] font-bold bg-[#94b946] rounded-[50px]`}>
          <div className="flex flex-row items-center gap-3">
            <div onClick={toggleVisibilityProfile} className="flex justify-center items-center w-[40px] h-[40px] rounded-[25px] overflow-hidden">
              <img
                src={
                  profileImage
                    ? `${url}/FileUploads/${profileImage}`
                    : '/assets/icons/account.png'
                }
                alt="account"
                className="w-full h-full object-cover"
              />
            </div>
            <label className={!sidebarShow && 'hidden'}>
              {sessionLoading
                ? 'Loading...'
                : user
                ? `${user.firstname || ''} ${user.lastname || ''}` // Use direct properties
                : 'Guest'}
            </label>
          </div>

          {sidebarShow && (
            <button
              onClick={toggleVisibilityProfile}
              className="flex justify-center items-center w-[30px] h-auto p-2 bg-[#f0f2c8] hover:bg-[#E3E697] active:bg-[#f0f2c8] rounded-[15px]"
            >
              <img src="/assets/icons/admin-icons/arrow-right.png" alt="" />
            </button>
          )}

          <div className={`absolute ${sidebarShow ? 'left-75 bottom-12' : 'left-15 bottom-5'} flex flex-col w-auto gap-2 box-border bg-[#FFF] shadow-md rounded-[15px] rounded-bl-[0px] z-[9999]`}>
            {isLoggedIn && (
              <div className={isVisible ? 'flex flex-col w-fit p-2 gap-2' : 'hidden'}>
                <Link ref={menuRef} to="/login" onClick={handleLogout} className="text-[#000] text-center p-3 pl-6 pr-6 w-full bg-[#f0f2c8] hover:bg-[#E3E697] active:bg-[#f0f2c8] active:text-[#FFF] rounded-[10px]">
                  <label className="w-full whitespace-nowrap">Log out</label>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;



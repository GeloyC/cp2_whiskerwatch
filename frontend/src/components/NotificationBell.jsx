// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { useSession } from '../context/SessionContext';

// const NotificationBell = () => {
//   const url = `https://whiskerwatch-0j6g.onrender.com`;

//   const { user, notifications = [], fetchNotifications } = useSession(); // Default to empty array
//   const [isOpen, setIsOpen] = useState(false);

//   const menuRef = useRef(null);

//   useEffect(() => {
//     if (user?.user_id) {
//       fetchNotifications(user.user_id);
//     }
//   }, [user]);

//   const toggleDropdown = () => {
//     setIsOpen(prev => !prev);
//   };

//   const markAsRead = async (id) => {
//     try {
//       await axios.patch(`${url}/user/notifications/mark_read/${id}`);
//       await fetchNotifications(user.user_id);
//     } catch (err) {
//       console.error('Failed to mark as read:', err);
//     }
//   };

//   const deleteNotification = async (id) => {
//     try {
//       await axios.delete(`${url}/user/notifications/delete/${id}`);
//       await fetchNotifications(user.user_id); 
//     } catch (err) {
//       console.error('Failed to delete notification:', err);
//     }
//   };


//   useEffect(() => {
//       const handleClickOutside = (event) => {
//         if (menuRef.current && !menuRef.current.contains(event.target)) {
//           setIsOpen(false);
//         }
//       };
  
//       if (isOpen) {
//         document.addEventListener('mousedown', handleClickOutside);
//       }
  
//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//       };
//     }, [isOpen]);



//   return (
//     <div ref={menuRef} className="relative xl:flex lg:flex md:flex w-full h-full">
//       {/* Bell Button */}
//       <button onClick={toggleDropdown} className="cursor-pointer relative hover:scale-103 active:scale-95">
//         <div className='relative flex items-center justify-center size-8 rounded-[10px]'>
//           <img
//             className='max-w-full max-h-full object-contain'
//             src="/assets/icons/notification-bell.png"
//             alt="notification bell"
//           />
//         </div>
//         {Array.isArray(notifications) && notifications.some(n => !n.is_read) && (
//           <div  className="absolute -top-3 -left-2 bg-[#B5C04A] size-6 rounded-full flex items-center justify-center">
//             <span className="text-[#FFF] text-xs font-medium">
//               {notifications.filter(n => !n.is_read).length}
//             </span>
//           </div>
//         )}
//       </button>

//       {/* Dropdown */}
//       {isOpen && (
//         <div  className={"absolute top-8 right-0 bg-white border-2 border-[#DC8801] rounded-[10px] rounded-tr-[0px] z-50 w-[300px] h-[400px] scrollbar-thin overflow-y-scroll"}>
//           {!Array.isArray(notifications) || notifications.length === 0 ? (
//             <p className="p-3 text-[#2F2F2F] text-sm">No notifications</p>
//           ) : (
//             notifications.map((notif) => (
//               <div 
//                 key={notif.notification_id}
//                 className={`p-3 border-b border-gray-200 flex flex-col gap-1 ${notif.is_read ? '' : 'bg-[#FFFCF6]'}`}
//               >
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <p className="text-sm text-[#2F2F2F]">{notif.message}</p>
//                     <span className="text-xs text-gray-400 block mt-1">
//                       {new Date(notif.created_at).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex flex-col gap-1 ml-2">
//                     {!notif.is_read && (
//                       <button
//                         onClick={() => markAsRead(notif.notification_id)}
//                         className="w-[20px] h-[20px] rounded-[15px] p-1 hover:bg-[#b6b6b6]"
//                       >
//                         <img src="/assets/icons/mark_as_read.png" alt="mark as read" />
//                       </button>
//                     )}
//                     <button
//                       onClick={() => deleteNotification(notif.notification_id)}
//                       className="w-[21px] h-[21px] p-[2px] rounded-[12px] hover:bg-[#cdcdcd]"
//                     >
//                       <img src="/assets/icons/trash-bin.png" alt="delete notification" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;



import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useSession } from '../context/SessionContext';

const NotificationBell = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;
  const navigate = useNavigate(); // 2. Initialize useNavigate

  const { user, notifications = [], fetchNotifications } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    if (user?.user_id) {
      fetchNotifications(user.user_id);
    }
  }, [user]);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${url}/user/notifications/mark_read/${id}`);
      // Only re-fetch if the dropdown is open to update the badge count immediately
      if (isOpen) {
          await fetchNotifications(user.user_id);
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${url}/user/notifications/delete/${id}`);
      await fetchNotifications(user.user_id); 
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  // 3. New function to handle click, mark as read, and redirect
  const handleNotificationClick = async (notif) => {
    // 3a. Close the dropdown first
    setIsOpen(false); 
    
    // 3b. Mark as read immediately (fire and forget for better UX)
    if (!notif.is_read) {
        // We call markAsRead but don't wait for it to finish before navigating
        markAsRead(notif.notification_id); 
    }

    // 3c. Redirect if target_url exists
    if (notif.target_url) {
      navigate(notif.target_url);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Helper to calculate unread count for badge
  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter(n => !n.is_read).length
    : 0;


  return (
    <div ref={menuRef} className="relative xl:flex lg:flex md:flex w-full h-full">
      {/* Bell Button */}
      <button onClick={toggleDropdown} className="cursor-pointer relative hover:scale-103 active:scale-95">
        <div className='relative flex items-center justify-center size-8 rounded-[10px]'>
          <img
            className='max-w-full max-h-full object-contain'
            src="/assets/icons/notification-bell.png"
            alt="notification bell"
          />
        </div>
        {unreadCount > 0 && (
          <div className="absolute -top-3 -left-2 bg-[#B5C04A] size-6 rounded-full flex items-center justify-center">
            <span className="text-[#FFF] text-xs font-medium">
              {unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={"absolute top-8 right-0 bg-white border-2 border-[#DC8801] rounded-[10px] rounded-tr-[0px] shadow-lg z-50 w-[300px] h-[400px] scrollbar-thin overflow-y-scroll"}>
          {unreadCount > 0 && (
            <button
              onClick={() => notifications.filter(n => !n.is_read).forEach(n => markAsRead(n.notification_id))}
              className="w-full text-center py-2 text-xs font-bold text-[#889132] border-b border-gray-200 hover:bg-gray-50"
            >
              Mark All as Read
            </button>
          )}

          {notifications.length === 0 ? (
            <p className="p-3 text-[#2F2F2F] text-sm">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <button 
                key={notif.notification_id}
                // Use the new handler for click redirection and read status
                onClick={() => handleNotificationClick(notif)} 
                className={`w-full text-left p-3 border-b border-gray-200 flex items-start gap-3 
                  ${notif.is_read ? 'hover:bg-gray-50' : 'bg-[#FFFCF6] hover:bg-[#F0F0F0]'} transition-colors duration-150`}
                
                // Add a visual indicator if there is a redirection link
                title={notif.target_url ? `Go to: ${notif.target_url}` : notif.message}
              >
                <div className="flex flex-col flex-1">
                    <p className={`text-sm ${notif.is_read ? 'text-[#2F2F2F]' : 'font-semibold text-black'}`}>
                        {notif.message}
                    </p>
                    <span className="text-xs text-gray-400 block mt-1">
                        {new Date(notif.created_at).toLocaleString()}
                    </span>
                    {/* Optional: Show a "Go to Page" link/icon if target_url exists */}
                    {notif.target_url && (
                        <span className="text-xs font-medium text-[#DC8801] mt-1 flex items-center gap-1">
                            Go to Page 
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96h-10.64A.75.75 0 013 10z" clipRule="evenodd" />
                            </svg>
                        </span>
                    )}
                </div>

                {/* Mark as Read/Delete Buttons (Updated to use a dedicated flex container) */}
                <div className="flex flex-col items-center justify-center gap-1.5 shrink-0">
                    {!notif.is_read && (
                        <button
                            onClick={(e) => { 
                                e.stopPropagation(); // Prevent the main button click
                                markAsRead(notif.notification_id);
                            }}
                            className="w-[20px] h-[20px] rounded-[15px] p-0.5 hover:bg-[#cdcdcd] transition-colors duration-100"
                            title="Mark as Read"
                        >
                            <img src="/assets/icons/mark_as_read.png" alt="mark as read" />
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent the main button click
                            deleteNotification(notif.notification_id);
                        }}
                        className="w-[21px] h-[21px] p-[2px] rounded-[12px] hover:bg-red-200 transition-colors duration-100"
                        title="Delete"
                    >
                        <img src="/assets/icons/trash-bin.png" alt="delete notification" />
                    </button>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CatBot = ({ message }) => {
   const [messageDisplay, setMessageDisplay] = useState('');
   const location = useLocation();


   const showMessage = (delay = 0) => {
      clearTimeout(window.catBotShow);
      clearTimeout(window.catBotHide);

      // Show message after the specified delay
      window.catBotShow = setTimeout(() => {
         setMessageDisplay(message);

         // Hide after 4 seconds
         window.catBotHide = setTimeout(() => {
         setMessageDisplay('');
         }, 7000);
      }, delay);
   };

   useEffect(() => {
      showMessage(1000); // delay 1 second for auto display
      return () => {
         clearTimeout(window.catBotShow);
         clearTimeout(window.catBotHide);
      };
   }, [location.pathname, message]);

   return (
      <div className="fixed bottom-5 right-5 flex flex-col justify-end items-end gap-1 z-50">
         {messageDisplay && (
         <div className="relative right-9 flex flex-col items-center justify-center text-[#000] max-w-[275px] h-auto bg-[#B5C04A] p-4 rounded-[15px] rounded-br-[0px] transition-all duration-300">
            <label className="text-left text-[#FFF] text-sm">
               {messageDisplay}
            </label>
         </div>
         )}

         <button
         onClick={() => showMessage(0)} // 👈 show immediately on click
         className="flex items-center justify-center bg-[#B5C04A] box-border max-w-[75px] h-auto rounded-full p-[12px] "
         >
         <img
            src="/assets/icons/CatBot.png"
            alt="Cat Bot"
            className="cursor-pointer hover:-rotate-10 active:rotate-10 transition-all duration-200"
         />
         </button>
      </div>
   );
};

export default CatBot;


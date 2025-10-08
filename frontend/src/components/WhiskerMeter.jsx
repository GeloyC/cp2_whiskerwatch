// import React, { useState } from 'react'

// import { useWhiskerMeter } from '../context/WhiskerMeterContext'
// import meterPhoto from "/src/assets/paw1.png"
// import meterPhoto1 from "/src/assets/paw2.png"

// const WhiskerMeter = () => {
//     const [expanded, setExpanded] = useState(false);
//     const circleCount = 5;

//     const { points } = useWhiskerMeter();
//     const maxPoints = 200;
//     const progressValue = Math.min(
//         Math.ceil((points / maxPoints) * circleCount),
//         circleCount
//     );

//     const labels = [
//         "The Catnip Captain",
//         "Meowntain Mover",
//         "Furmidable Friend",
//         "Snuggle Scout",
//         "Toe Bean Trainee",
//     ];

//     return (
//         <div className="w-fit h-full z-999 fixed left-0 top-[20%] scale-90">
//             <div className={`transition-all duration-300  ${
//                 expanded ? "w-80 " : "w-24 "
//                 } flex-shrink-0 absolute left-0 z-10`}
//                 onClick={() => setExpanded((prev) => !prev)}
//                 style={{ cursor: "pointer", height: "500px" }}
//             >
//                 <nav>
//                 <header>
//                     <div
//                     className={"bg-yellow-50 rounded-r-[40px] shadow-lg h-full transition-all overflow-hidden duration-300 border-2 border-[#DC8801] " +
//                         (expanded ? "w-70" : "w-26 ")}
//                     >
//                     <span>
//                         <div
//                         className={
//                             "rounded-r-[40px] shadow-lg p-5 pt-2 pb-2 flex justify-between items-center transition-all duration-500 " +
//                             (expanded ? "bg-yellow-600" : "")
//                         }>
//                             <div
//                                 className={`ml-10 overflow-hidden transition-all duration-700 ${
//                                 expanded
//                                     ? "opacity-100 translate-x-0 max-w-[200px]"
//                                     : "opacity-0 -translate-x-10 max-w-"
//                                 } transform ease-in-out`}
//                             >
//                                 <span className="block whitespace-nowrap font-semibold text-gray-800">
//                                 The Whisker Meter
//                                 </span>
//                             </div>

//                             <img
//                                 src={expanded ? meterPhoto1 : meterPhoto}
//                                 alt="Whisker Meter Icon"
//                                 className="w-15 h-15 transition-all duration-700 ml-4"
//                             />
//                         </div>

//                         {/* Step-based Progress Section */}
//                         <div className="flex p-6 pr-12 space-x-4 justify-between items-center h-[350px]">
//                             {/* Progress bar container */}
//                             <div className="relative flex flex-col items-center justify-between h-full">
//                                 {/* Background line */}
//                                 <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-yellow-600/30 rounded-full"></div>

//                                 {/* Filled line */}
//                                 <div
//                                     className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-yellow-600 rounded-full transition-all duration-500"
//                                     style={{
//                                         height: `${(progressValue / circleCount) * 100}%`,
//                                         bottom: 0,
//                                     }}
//                                 ></div>

//                                 {/* Circles */}
//                                 {Array.from({ length: circleCount }).map((_, i) => {
//                                 const circleIndexFromBottom = circleCount - i;
//                                 const isFilled =
//                                     circleIndexFromBottom <= progressValue &&
//                                     progressValue > 0;

//                                 return (
//                                     <div
//                                     key={i}
//                                     className={`z-10 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
//                                         isFilled
//                                         ? "bg-yellow-600 border-yellow-600"
//                                         : "bg-white border-yellow-600"
//                                     }`}
//                                     ></div>
//                                 );
//                                 })}
//                             </div>

//                             {/* Labels */}
//                             <div
//                                 className={`flex flex-col justify-between h-full text-sm text-nowrap font-medium text-[#2F2F2F]
//                                 transition-all duration-700 ease-in-out overflow-hidden
//                                 ${expanded ? "max-w-[200px] opacity-100 translate-x-0" : "max-w-0 opacity-0 -translate-x-10"}
//                                 `}
//                                 >

//                                 {labels.map((label, i) => (
//                                 <span key={i}>{label.toUpperCase()}</span>
//                                 ))}
//                             </div>
//                         </div>
//                     </span>
//                     </div>
//                 </header>
//                 </nav>
//             </div>
//         </div>
//     );
// }

// export default WhiskerMeter
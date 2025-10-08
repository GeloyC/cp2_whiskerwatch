// import React, { useState, useEffect } from 'react'
// import CatBot from '../../components/CatBot'
// import NavigationBar from '../../components/NavigationBar'
// import SideNavigation from '../../components/SideNavigation'
// import HeadVolunteerSideBar from '../../components/HeadVolunteerSideBar'
// import Whisker from '../../components/Whisker'
// import axios from 'axios'
// import { Link, Outlet } from 'react-router-dom'

// import { useSession } from '../../context/SessionContext'
// import Footer from '../../components/Footer'
// import ApplicationFeederView from './ApplicationFeederView'

// const FeederApplication = () => {
//   const { user } = useSession();
//   const [applicant, setApplicant] = useState([]);

//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/admin/feeders/application`);
//         console.log(response.data)
//         setApplicant(response.data)
//       } catch(err) {
//           console.error('Error retrieving application data: ', err)
//       }
//     }

//     fetchApplications()
//   }, []);

//   return (
//     <div className="relative flex flex-col min-h-screen pb-10">
      
//       <CatBot />
//       <NavigationBar />
//       <Whisker />
//       <div className='grid grid-cols-[80%_20%] w-full h-full'>
//         <div className='flex flex-col pl-50 p-10'>
//           <table className='flex flex-col w-full gap-2'>
//             <thead className='flex w-full'>
//               <tr className='grid grid-cols-5 justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
//                 <th>Application No.</th>
//                 <th>Applicant Name</th>
//                 <th>Date Applied</th>
//                 <th>Application Form</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody className='flex flex-col w-full'>
//               {applicant.map((application) => (
//                 <tr key={application.application_number} className='grid grid-cols-5 justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
//                   <td>{application.application_number}</td>
//                   <td>{`${application.firstname} ${application.lastname}`}</td>
//                   <td>{application.date_applied}</td>
//                   <td>
//                     <Link to={`/applicationfeeding/applicationview/${application.application_number}`} className='flex items-center gap-4 text-[#DC8801] underline font-bold hover:text-[#977655] active:text-[#DC8801]'>
//                       {application.application_form}
//                     </Link>
//                   </td>
//                   <td className={application.status == 'Accepted' 
//                     ? 'bg-[#B5C04A] text-[#FFF] font-bold p-1 pl-4 pr-4 rounded-[10px]' 
//                     : application.status == 'Rejected'
//                       ? 'bg-[#977655] text-[#FFF] font-bold p-1 pl-4 pr-4 rounded-[10px]'
//                       : 'bg-[#595959] text-[#FFF] font-bold p-1 pl-4 pr-4 rounded-[10px]'
//                       }>{application.status}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
            


//         </div>

//         {user?.role === "head_volunteer" ? (
//           <HeadVolunteerSideBar />
//         ) : (
//           <SideNavigation />
//         )}
//       </div>
//       <Footer/>
//       <Outlet />
//     </div>
//   )
// }

// export default FeederApplication
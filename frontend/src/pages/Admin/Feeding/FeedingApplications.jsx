import React from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import HeadVolunteerSideBar from '../../../components/HeadVolunteerSideBar'
import { useSession } from '../../../context/SessionContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'

const FeedingApplications = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;
    
  const { user, logout, loading: sessionLoading } = useSession();
  const [applicant, setApplicant] = useState([]);
    const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${url}/admin/feeders/application`);
        setApplicant(response.data)
      } catch(err) {
          console.error('Error retrieving application data: ', err)
      }
    }

    fetchApplications()
  }, []);


  const filterFeedingApplication = applicant.filter((app) => {
    const firstnameMatch = app.firstname?.toLowerCase().includes(searchInput.toLowerCase());
    const lastnameMatch = app.lastname?.toLowerCase().includes(searchInput.toLowerCase());

    return firstnameMatch && lastnameMatch;
  });



  

  if (!user && user?.role !== 'admin' || user?.role !== 'head_volunteer') {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-5'>
        <div className='size-20'>
          <img src="/assets/icons/warning_admin.png" alt="" />
        </div>
        <span className='font-bold text-[#E1341E] text-2xl text-center'>YOU CAN'T ACCESS THIS PAGE!</span>
        <Link to="/home" className='bg-[#B5C04A] px-3 py-1 rounded-[10px] hover:scale-101 active:scale-98 text-[#FFF]'>Go back Home page</Link>
      </div>
    )
  } else if (sessionLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <span className='font-bold text-2xl text-[#2F2F2F]'>Loading ...</span>
      </div>
    )
  }


  return (
    <div className='relative flex flex-col h-screen overflow-hidden'>
        <div className='flex flex-row w-full'> 
          <AdminSideBar className='max-w-[400px]'/>

          <div className='flex flex-col items-center xl:p-10 lg:p-10 min-h-screen w-full gap-5 mx-auto'>
            <div className='xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-screen gap-3 rounded-[15px]'>
                <label className='text-2xl text-[#2F2F2F] text-center'>Unable to access this page</label>
                <label className='text-[#8f8f8f] text-center'>You can access the page on larger screen size such as desktop/laptop screens</label>
            </div>

            <div className='hidden xl:flex lg:flex flex-row justify-start w-full border-b-2 border-b-[#525252]'>
              <label className='font-bold text-[24px]'>Feeding Application</label>
            </div>


            {/* FILTERS */}
            <div className='hidden xl:flex lg:flex flex-row justify-between w-full'>
              <form className='flex gap-2'>
                <input type="search" placeholder='Search' value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                className='bg-[#FFF] p-2 min-w-[400px] border-1 border-[#595959] rounded-[15px]'/>
              </form>
            </div>


            {/* Application ID/Application Name/ Date Applied */}
            <table className='hidden xl:flex lg:flex flex-col w-full gap-2'>
              <thead className='flex w-full'>
                <tr className='grid grid-cols-5 justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
                  <th>Application No.</th>
                  <th>Applicant Name</th>
                  <th>Date Applied</th>
                  <th>Application Form</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className='flex flex-col w-full overflow-y-scroll scrollbar-thin min-h-[600px]'>
                {filterFeedingApplication.map((application) => (
                  <tr key={application.application_number} className='grid grid-cols-5 justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                    <td>{application.application_number}</td>
                    <td>{`${application.firstname} ${application.lastname}`}</td>
                    <td>{application.date_applied}</td>
                    <td>
                      <Link to={`/feedingapplications/feedingapplicationview/${application.application_number}`} className='flex items-center gap-4 text-[#DC8801] underline font-bold hover:text-[#977655] active:text-[#DC8801]'>
                        View Application
                      </Link>
                    </td>
                    <td className={application.status == 'Accepted' 
                      ? 'bg-[#B5C04A] text-[#FFF] font-bold p-2 pl-4 pr-4 rounded-[10px]' 
                      : application.status == 'Rejected'
                        ? 'bg-[#977655] text-[#FFF] font-bold p-2 pl-4 pr-4 rounded-[10px]'
                        : 'bg-[#595959] text-[#FFF] font-bold p-2 pl-4 pr-4 rounded-[10px]'
                        }>{application.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}

export default FeedingApplications
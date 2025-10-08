import React from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import HeadVolunteerSideBar from '../../../components/HeadVolunteerSideBar'
import { useSession } from '../../../context/SessionContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'

const FeedingApplications = () => {
  const { user, logout, loading: sessionLoading } = useSession();
  const [applicant, setApplicant] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/feeders/application`);
        console.log(response.data)
        setApplicant(response.data)
      } catch(err) {
          console.error('Error retrieving application data: ', err)
      }
    }

    fetchApplications()
  }, []);

  if (sessionLoading) return <div className="p-10">Loading session...</div>;
  if (!user) return <div className="p-10">No active session.</div>;


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
                <input type="search" placeholder='Search' className='bg-[#FFF] p-2 min-w-[400px] border-1 border-[#595959] rounded-[15px]'/>
              </form>

              {/* Search by date */}
              {/* <form className='flex flex-row items-center gap-2'>
                <div className='flex items-center gap-1'>
                  <label className='leading-tight'>Date</label>
                  <input type="date" name="" id="" className='bg-[#FFF] p-2 min-w-[250px] rounded-[15px] border-1 border-[#595959]'/>
                </div>
                <button className='bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]'>Search</button>
              </form> */}
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
              <tbody className='flex flex-col w-full overflow-y-scroll min-h-[600px]'>
                {applicant.map((application) => (
                  <tr key={application.application_number} className='grid grid-cols-5 justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                    <td>{application.application_number}</td>
                    <td>{`${application.firstname} ${application.lastname}`}</td>
                    <td>{application.date_applied}</td>
                    <td>
                      <Link to={`/feedingapplications/feedingapplicationview/${application.application_number}`} className='flex items-center gap-4 text-[#DC8801] underline font-bold hover:text-[#977655] active:text-[#DC8801]'>
                        {application.application_form}
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
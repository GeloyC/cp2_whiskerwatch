import React, { useState, useEffect } from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import HeadVolunteerSideBar from '../../../components/HeadVolunteerSideBar'
import { useSession } from '../../../context/SessionContext'
import axios from 'axios'

const Donation = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;
    
  const { user, logout, loading: sessionLoading } = useSession();

  const [donation, setDonate] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const response = await axios.get(`${url}/donate/donation_list`);
        console.log('Donation date: ', response.data)
        setDonate(response.data)
      } catch (err) {
        console.error('Error fetching donation data:', err);
      }
    }

    fetchDonation()
  }, []);

  const filteredDonations = donation.filter((donate) =>
    (donate.donator_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (donate.donation_type?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (donate.item_description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );



  if (sessionLoading) return <div className="flex items-center justify-center p-10 w-full h-screen">Loading session...</div>;
  if (!user) return <div className="flex items-center justify-center p-10 w-full h-screen">No active session.</div>;


  return (
    <div className='relative flex flex-col h-screen overflow-hidden'>
        <div className='flex flex-row w-full'>
            <AdminSideBar className='max-w-[400px]'/>

            <div className='flex flex-col items-center xl:p-10 lg:p-10 min-h-screen gap-5 w-full mx-auto'>
              <div className='xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-screen gap-3 rounded-[15px]'>
                <label className='text-2xl text-[#2F2F2F] text-center'>Unable to access this page</label>
                <label className='text-[#8f8f8f] text-center'>You can access the page on larger screen size such as desktop/laptop screens</label>
              </div>

              <div className='hidden xl:flex lg:flex w-full justify-between pb-2 border-b-1 border-b-[#2F2F2F]'>
                <label className='text-[24px] font-bold text-[#2F2F2F]'>Donations</label>
              </div>

              {/* FILTERS */}
              <div className='hidden xl:flex lg:flex flex-row justify-between w-full'>
                <form className='flex gap-2'>
                  <input type="search" placeholder='Search' className='bg-[#FFF] p-2 min-w-[400px] border-1 border-[#595959] rounded-[15px]' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
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


              <table className='hidden xl:flex lg:flex flex-col w-full gap-2'> 
                <thead className='flex w-full'>
                  <tr className='grid grid-cols-[15%_15%_30%_20%_20%] justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
                    <th>Donation Type</th>
                    <th>Quantity/Amount</th>
                    <th>Description</th>
                    <th>Donated By</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody className='hidden xl:flex lg:flex flex-col w-full overflow-y-scroll h-[575px] gap-1'>
                  {filteredDonations.map((donate) => (
                    <tr key={donate.item_id} className='grid grid-cols-[15%_15%_30%_20%_20%] justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[10px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                      <td>{donate.donation_type}</td>
                      <td>{donate.quantity}</td>
                      <td>
                        {donate.item_description || 
                        <a href={`${url}/FileUploads/donation_image/${donate.donation_image}`} target='_blank' className='hover:underline'>{donate.donation_image}</a>}
                      </td>
                      {/* <td>{donate.donation_image || 'No Image'}</td> */}

                      <td>{donate.donator_name}</td>
                      <td>{donate.date_donated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>

    </div>
  )
}

export default Donation
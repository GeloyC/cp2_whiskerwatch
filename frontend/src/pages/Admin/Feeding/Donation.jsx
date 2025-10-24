import React, { useState, useEffect } from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import HeadVolunteerSideBar from '../../../components/HeadVolunteerSideBar'
import { useSession } from '../../../context/SessionContext'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Donation = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;
    
  const { user, logout, loading: sessionLoading } = useSession();

  const [donation, setDonate] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  // FIX DONATION REPORT FORMAT ON EXCEL

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const response = await axios.get(`${url}/donate/donation_list`);
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

  const exportToCSV = () => {
    if (filteredDonations.length === 0) {
        alert("No data to export.");
        return;
    }

    const headers = [
        "Donation Type",
        "Quantity/Amount",
        "Description",
        "Donated By",
        "Date Donated",
        "Proof Image URL"
    ];
    
    // Map data fields to the order of the headers
    const dataRows = filteredDonations.map(donate => [
        donate.donation_type,
        `"${donate.quantity_display || 'N/A'}"`, 
        `"${donate.item_description || 'N/A'}"`, 
        `"${donate.donator_name}"`,
        donate.date_donated,
        `"${donate.donation_image || ''}"`
    ]);

    const csvContent = headers.join(',') + '\n' + 
    dataRows.map(row => row.join(',')).join('\n');
    
    // 2. Create a Blob and URL for download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Create a filename with the current date
    const filename = `donations_export_${new Date().toISOString().slice(0, 10)}.csv`;
    
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', filename);
    

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`Data exported successfully to ${filename}!`);
  };

  // if (!user && user?.role !== 'admin' || user?.role !== 'head_volunteer') {
  //   return (
  //       <div className='flex flex-col items-center justify-center h-screen gap-5'>
  //       <div className='size-20'>
  //           <img src="/assets/icons/warning_admin.png" alt="" />
  //       </div>
  //       <span className='font-bold text-[#E1341E] text-2xl text-center'>YOU CAN'T ACCESS THIS PAGE!</span>
  //       <Link to="/home" className='bg-[#B5C04A] px-3 py-1 rounded-[10px] hover:scale-101 active:scale-98 text-[#FFF]'>Go back Home page</Link>
  //       </div>
  //   )
  // } else if (sessionLoading) {
  //   return (
  //       <div className='flex flex-col items-center justify-center h-full'>
  //       <span className='font-bold text-2xl text-[#2F2F2F]'>Loading ...</span>
  //       </div>
  //   )
  // }


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

                <button onClick={exportToCSV} className='flex items-center gap-2 bg-[#2F2F2F] text-[#FFF] px-5 py-2 cursor-pointer rounded-full hover:bg-[#4E4E4E]'>
                  Export Data
                  <div className='size-6'>
                    <img src="/assets/icons/download.png" alt="" />
                  </div>
                </button>
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

                {/* <tbody className='hidden xl:flex lg:flex flex-col w-full overflow-y-scroll scrollbar-thin h-[575px] gap-1'>
                  {filteredDonations.map((donate) => (
                    <tr key={donate.item_id} className='grid grid-cols-[15%_15%_30%_20%_20%] justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[10px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                      <td>{donate.donation_type}</td>
                      <td>{donate.quantity}</td>
                      <td>
                        {donate.item_description || 
                        <a href={`${donate.donation_image}`} target='_blank' className='underline hover:text-[#DC8801]'>View transaction receipt</a>}
                      </td>
                      <td>{donate.donator_name}</td>
                      <td>{donate.date_donated}</td>
                    </tr>
                  ))}
                </tbody> */}

                <tbody className='hidden xl:flex lg:flex flex-col w-full overflow-y-scroll scrollbar-thin h-[575px] gap-1'>
                  {filteredDonations.map((donate) => (
                    <tr key={donate.item_id} className='grid grid-cols-[15%_15%_30%_20%_20%] justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[10px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                      <td>{donate.donation_type}</td>
                        {/* Use the new combined field for display */}
                      <td>{donate.quantity_display}</td> 
                      <td>
                        {/* If it's a Money donation AND the image URL exists, 
                            display the link. Otherwise, display the text description.
                        */}
                        {(donate.donation_type === 'Money' && donate.donation_image) ? (
                            <a 
                                href={donate.donation_image} 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='underline hover:text-[#DC8801]'
                            >
                                View transaction receipt
                            </a>
                        ) : (
                            <span>{donate.item_description || 'N/A'}</span>
                        )}
                      </td>
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
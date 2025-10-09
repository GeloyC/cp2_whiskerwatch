import React from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import HeadVolunteerSideBar from '../../../components/HeadVolunteerSideBar'
import { useSession } from '../../../context/SessionContext'
import { useState, useEffect } from 'react'
import axios from 'axios'

const FeedingVolunteers = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;
    
  const { user, logout, loading: sessionLoading } = useSession();
    const [searchInput, setSearchInput] = useState('');

  const [feeders, setFeeders] = useState([]);
  const [feedingDates, setFeedingDates] = useState({});

  useEffect(() => {
    const fetchFeeders = async () => {
      try {
        const response = await axios.get(`${url}/admin/feeders`);
        setFeeders(response.data);
        console.log(response.data)
        

        const initialDates = {};
        response.data.forEach(feeder => {
          initialDates[feeder.feeder_id] = formatDateForInput(feeder.feeding_date);
        });

        setFeedingDates(initialDates);
      } catch (err) {
          console.error('Error fetching user:', err.response?.data || err.message);
      }
    }

    fetchFeeders()
  }, []);

  const formatDateForInput = (datetimeString) => {
    const date = new Date(datetimeString);
      return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
    };

  const updateFeedingDate = async (feeder_id) => {
    try {
      const feeding_date = feedingDates[feeder_id];
      if (!feeding_date) {
        alert('Please select a valid feeding date');
        return;
      }
      

      await axios.patch(`${url}/admin/feeders/feeding_date`, {
        feeding_date,
        feeder_id
      });

      alert('Feeding date updated successfully!');
      console.log(feeding_date)
      // Refetch data or update UI as needed
      const response = await axios.get(`${url}/admin/feeders`);
      setFeeders(response.data);

    } catch (error) {
      console.error('Failed to update feeding date:', error.response?.data || error.message);
      alert('Failed to update feeding date');
    }
  };

  // if (sessionLoading) return <div className="p-10">Loading session...</div>;
  // if (!user) return <div className="p-10">No active session.</div>;



  const filteredVolunteers = feeders.filter((feeder) => {
    const firstnameMatches = feeder.firstname?.toLowerCase().includes(searchInput.toLowerCase());
    const lastnameMatches = feeder.lastname?.toLowerCase().includes(searchInput.toLowerCase());

    return firstnameMatches || lastnameMatches;
  })

  return (
    <div className='relative flex flex-col h-screen'>
        <div className='flex flex-row w-full overflow-x-hidden'> 
          <AdminSideBar className='max-w-[400px]'/>
          
          <div className='flex flex-col items-start justify-between xl:p-10 lg:p-10 min-h-screen w-full gap-10 mx-auto'>
            <div className='xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-full gap-3 rounded-[15px]'>
                <label className='text-2xl text-[#2F2F2F] text-center'>Unable to access this page</label>
                <label className='text-[#8f8f8f] text-center'>You can access the page on larger screen size such as desktop/laptop screens</label>
            </div>

            <div className='hidden xl:flex lg:flex flex-col w-full gap-5'>
              <label className='flex items-start text-[#2F2F2F] text-[24px] font-bold border-b-2 border-b-[#595959]'>Feeding Volunteers</label>

              <div className='flex flex-col gap-4'>
                {/* FILTERS */}
                <div className='flex flex-row justify-between w-full'>
                  <form className='flex gap-2'>
                    <input type="search" placeholder='Search' value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                    className='bg-[#FFF] p-2 min-w-[400px] border-1 border-[#595959] rounded-[15px]'/>
                  </form>


                  {/* <form className='flex flex-row items-center gap-2'>
                    <div className='flex items-center gap-1'>
                      <label className='leading-tight'>Date</label>
                      <input type="datetime-local" name="" id="" className='bg-[#FFF] p-2 min-w-[250px] rounded-[15px] border-1 border-[#595959]'/>
                    </div>
                    <button className='bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]'>Search</button>
                  </form> */}
                </div>

                <table className='flex flex-col gap-2 w-full'>
                  <thead className='flex flex-col w-full gap-2'>
                    <tr className='grid grid-cols-5 justify-items-start place-items-center w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Contact No.</th>
                      <th>Schedule</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody className='flex flex-col w-full  overflow-y-scroll min-h-[600px]'>
                    {filteredVolunteers.map((feeder) => (
                      <tr key={feeder.feeder_id} className='grid grid-cols-5 justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                        <td>{feeder.feeder_id}</td>
                        <td>{`${feeder.firstname} ${feeder.lastname}`}</td>
                        <td>{feeder.contactnumber}</td>
                        <td className='pl-2 '><input type="datetime-local" className='underline'
                        value={feedingDates[feeder.feeder_id] || ''}
                        onChange={(e) => {
                          const updatedDate = e.target.value;
                            setFeedingDates(prev => ({
                              ...prev,
                              [feeder.feeder_id]: updatedDate
                            }));
                          }}/>
                        </td>
                        <td> 
                          {feedingDates[feeder.feeder_id] !== formatDateForInput(feeder.feeding_date) && (
                            <button onClick={() => updateFeedingDate(feeder.feeder_id)}
                            className='bg-[#bbbbbb] p-1 pl-4 pr-4 text-[#2F2F2F] rounded-[15px] cursor-pointer active:bg-[#a3a3a3]'>Update</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default FeedingVolunteers
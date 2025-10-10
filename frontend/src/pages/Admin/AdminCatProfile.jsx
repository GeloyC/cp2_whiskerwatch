import React, {useState, useEffect} from 'react'
import AdminSideBar from '../../components/AdminSideBar'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';

const AdminCatProfile = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;
    

  const [cats, setCats] = useState([]);
  const [searchInput, setSearchInput] = useState('');

 
  const fetchCat = async () => {
    try {
      const response = await axios.get(`${url}/cat/list`);
      setCats(response.data)
    }catch(err) {
      console.error('Error fetching cat:', err);
    }
  }
  
  
  const filteredItems = cats.filter((cat) =>{
    return cat.name.toLowerCase().includes(searchInput.toLowerCase())
  });

  // const handleDeleteCatProfile = async (cat_id) => {
  //   try {
  //     await axios.delete(`${url}/cat/delete_cat/${cat_id}`);

  //     fetchCat();
  //   } catch (err) {
  //     console.error('Failed to delete cat profile: ', err);
  //   }
  // };

  const handleDeleteCatProfile = async (cat) => {
    if (cat.adoption_status !== "Available") {
      alert(`Cannot delete ${cat.name}. Status: ${cat.adoption_status}`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${cat.name}?`)) return;

    try {
      await axios.delete(`${url}/cat/delete_cat/${cat.cat_id}`);
      fetchCat();
    } catch (err) {
      console.error('Failed to delete cat profile:', err);
    }
  };



  useEffect(() => {
    fetchCat()
  }, []);

  return (
    <div className='flex flex-col min-h-screen w-auto overflow-hidden'>
      <div className='flex overflow-x-hidden w-full'>
        <AdminSideBar className='max-w-[400px]' />

        <div className='flex flex-col items-start xl:p-10 lg:p-10 h-screen gap-5 w-full mx-auto'>
          <div className='xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-full gap-3 rounded-[15px]'>
                <label className='text-2xl text-[#2F2F2F] text-center'>Unable to access this page</label>
                <label className='text-[#8f8f8f] text-center'>You can access the page on larger screen size such as desktop/laptop screens</label>
            </div>

          <div className='hidden xl:flex lg:flex w-full items-center justify-start '> 
            <label className='text-[24px] w-full text-[#2F2F2F] font-bold border-b-2 border-b-[#595959]'>Cat Profiles</label>
          </div>

          <div className='hidden xl:flex lg:flex flex-row items-center justify-between w-full gap-4'>
            <form className='flex gap-2' onSubmit={(e) => {e.preventDefault();}}>
              <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              type="search" placeholder="Search for cat's name" className='bg-[#FFF] p-2 min-w-[400px] border-1 border-[#595959] rounded-[15px]'/>
              <button className='bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]'>Search</button>
            </form>


            <div className='hidden xl:flex lg:flex flex-row items-center gap-4'>
              <Link to="/catprofilecreate" className='flex flex-row items-center justify-center gap-3 p-3 pl-6 pr-6 min-w-[225px] h-auto bg-[#B5C04A] text-[#FFF] rounded-[15px] hover:bg-[#CFDA34] active:bg-[#B5C04A]'>
                <div className='flex justify-center items-center w-[15px] h-auto'>
                  <img src="/assets/icons/add-white.png" alt="" />
                </div>  
                <label className='inline-block text-[#FFF]'>Create Cat Profile</label>
              </Link>
            </div>
          </div>          


          {/* TABLE */}
          <table className='hidden xl:flex lg:flex flex-col gap-2 w-full'>
            <thead className='flex bg-[#DC8801] text-[#FFF] rounded-[10px]'>
              <tr className='grid grid-cols-[10%_15%_15%_25%_25%_10%] place-items-start w-full p-3'>
                <th>Cat ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Description</th>
                <th>Adoption Status</th>
              </tr>
            </thead>
            <tbody className='hidden xl:flex lg:flex flex-col w-full overflow-y-scroll scrollbar-thin max-h-[550px] gap-1'>
              {filteredItems.map((cat) => (
                <tr key={cat.cat_id} className='grid grid-cols-[10%_15%_15%_25%_35%] place-items-center justify-items-start w-full p-3 bg-[#FFF] rounded-[15px] border-b-1 border-b-[#2F2F2F]'>
                  <td>{cat.cat_id}</td>
                  <td>{cat.name}</td>
                  <td>{cat.gender}</td>
                  <td className='break-words break-all whitespace-normal pr-4'>{cat.description.length > 50 ? cat.description.slice(0, 100) + '...' : cat.description}</td>
                  <td className='flex flex-row items-center justify-between w-full'>
                    <label>{cat.adoption_status}</label>

                    <div className='flex items-center gap-2'>

                      <Link to={`/catprofileproperty/${cat.cat_id}`} className='p-2 pl-6 pr-6 w-auto h-auto bg-[#2F2F2F] text-[#FFF] rounded-[15px] cursor-pointer active:bg-[#595959]'>View</Link>
                      <button onClick={() => handleDeleteCatProfile(cat)} className='w-[35px] h-[35px] p-2 border-2 border-[#DC8801] rounded-[25px] cursor-pointer active:bg-[#DC8801] hover:bg-[#FDF5D8]'>
                        <img src="/assets/icons/delete_orange.png" alt="" className='w-full h-full object-cover'/>
                      </button>
                    </div>
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

export default AdminCatProfile
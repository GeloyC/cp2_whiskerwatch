import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


import NavigationBar from '../components/NavigationBar'
import SideNavigation from '../components/SideNavigation'
import HeadVolunteerSideBar from "../components/HeadVolunteerSideBar";
import Footer from '../components/Footer'
import CatBot from '../components/CatBot'


import { useSession } from '../context/SessionContext'
import Whisker from '../components/Whisker'

const CatAdoption = () => {

  const { user } = useSession();
  const navigate = useNavigate();


  const [catList, setCatList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [genderFilter, setGenderFilter] = useState("all");

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/cat/catlist`);

        const formattedCats = response.data.map(cat => ({
          ...cat,
          thumbnail: cat.thumbnail
            ? `http://localhost:5000/FileUploads/cats/${cat.thumbnail}`
            : null
        }));

        setCatList(formattedCats);
      } catch(err) {
        console.error('Error fetching cat:', err);
      }
    };
    fetchCats();
  }, []);


  const filteredNames = catList.filter((cat) => {
    const nameMatches = cat.name?.toLowerCase().includes(searchInput.toLowerCase());
    const genderMatches = genderFilter === "all" || cat.gender === genderFilter;

    return nameMatches && genderMatches;
  })



  return (
    <div className='flex flex-col h-screen'>
      <CatBot message={"There's a cat out there dreaming of a home like yours. When you adopt, you're not just saving a life — you're gaining a loyal companion who'll fill your days with love, laughter, and purrs."}/>
      <NavigationBar />

      <Whisker />

      <div className='flex flex-col items-center h-full justify-start py-10 px-10 xl:px-30 lg:px-20 md:px-10 '>
        <div className='flex flex-col gap-5 h-full'>
          {/* ALL CONTENTS HERE */}
          <div className='flex flex-col xl:flex-row lg:flex-row md:flex-col items-center gap-2 w-full'>
            <label className='w-[100%] font-bold text-center xl:text-left lg:text-left md:text-center'>Filter the list of Cats</label>
            <div className='flex items-center w-full'>
              <input type="search" placeholder='Search for name' value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            className='w-full bg-[#FFF] p-2 border-[#A3A3A3] border-1 rounded-[10px]'/>
            </div>

            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className='w-full bg-[#FFF] p-2 border-[#A3A3A3] border-1 rounded-[10px]'>
              <option value="all">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 h-auto place-items-start gap-2'> 

          {filteredNames.map((cat) => (
              <div key={cat.cat_id} onClick={() => navigate(`/catprofile/${cat.cat_id}`)}
              className='w-full w-[300px] h-auto grid grid-cols-2 lg:grid-cols-none lg:grid-rows-[auto_auto] md:grid-cols-none md:grid-rows-[auto_auto] border-2 border-white overflow-hidden rounded-[25px] bg-white hover:shadow-lg hover:border-[#889132] hover:scale-103 active:scale-95 transition-all duration-100'
              >
                <div className='overflow-hidden xl:rounded-t-[25px] lg:rounded-t-[25px] w-full h-[250px]'>
                  <img 
                  src={cat.thumbnail} 
                  alt={`cat image ${cat.cat_id}`} 
                  className='overflow-hidden w-full h-full object-cover'/>
                </div>

                <div className='flex flex-col justify-center p-3'> 

                <div className='flex flex-col gap-4'>
                  <div className='grid grid-rows-2'>
                    <label className='flex items-end gap-2 text-[30px] font-bold text-[#889132]'>
                      {cat.name}
                    </label>

                    <div className="flex flex-row flex-wrap gap-3 border-dashed border-b-2 border-b-[#B5C04A]">
                      <label className="flex flex-row items-center font-bold text-[12px] gap-[5px]">
                        <div className="flex items-center justify-center w-[20px] h-auto">
                          <img
                            src="/assets/icons/genders-black.png"
                            alt="female sign"
                            className="object-cover"
                          />
                        </div>
                        {cat.gender}
                      </label>
                      <label className="flex flex-row items-center font-bold text-[12px] gap-[5px]">
                        <div className="flex items-center justify-center w-[15px] h-auto">
                          <img src="/assets/icons/hourglass.png" alt="hourglas" />
                        </div>
                        {cat.age} years old
                      </label>
                    </div>
                  </div>
                
                  <textarea rows={5} disabled className='resize-none pl-2 text-[14px] h-[40px] text-[#555555] leading-tight  break-words break-all whitespace-normal'>
                    {cat.description.length > 50 ? cat.description.slice(0, 50) + '...' : cat.description}
                  </textarea>
                </div>
              </div>
            </div>
          ))}

          </div>
        </div>

        {/* <SideNavigation /> */}
      </div>
      <Footer />
    </div>
  )
}

export default CatAdoption
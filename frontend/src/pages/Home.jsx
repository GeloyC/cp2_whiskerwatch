import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

import NavigationBar from '../components/NavigationBar'
import Footer from '../components/Footer'
import CatBot from '../components/CatBot'


import { useSession } from '../context/SessionContext'
import Whisker from '../components/Whisker'

const Home = () => {
  const { cat_id } = useParams();
  const { user } = useSession();
  const navigate = useNavigate();

  const url = `https://whiskerwatch-0j6g.onrender.com`;

  // Displays the arrays of cat image
  const [catList, setCatList] = useState([]);
  const [selectedImage] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get(`${url}/cat/catlist/limit`);

        const formattedCats = response.data.map(cat => ({
          ...cat,
          thumbnail: cat.thumbnail
            ? `${url}/FileUploads/cats/${cat.thumbnail}`
            : null
        }));

        setCatList(formattedCats);
      } catch(err) {
        console.error('Error fetching cat:', err);
      }
    };
    fetchCats();
  }, []);






  return (
    <div className='relative flex flex-col w-full h-auto '>
      <CatBot message = {`${!user ? "Hi there! Glad you're here today. Join us now and explore more about WhiskerWatch" : `Glad to have you back ${user.firstname} ${user.lastname}`}! We hope you're having a wonderful day!`}/>


      <NavigationBar />
      <Whisker /> 
      {/* Cat Community News Section */}
      <div className='flex flex-col items-center h-full w-full overflow-hidden pb-10'>
          <div className='flex flex-col box-border w-full'>
            
            {/* MAIN CONTENT STARTS HERE */}
            <div className="relative w-full h-[500px] xl:h-[600px] bg-[url('/assets/cats/cat-donate-bg.jpg')] bg-center bg-cover bg-no-repeat border-b-2 border-b-[#DC8801]">
              <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-[400px] xl:w-auto lg:w-auto md:w-auto gap-5'>
                <img src="/assets/image/Slogan_image_outline.png" alt="stray-today-safe-tomorrow" className=''/>

                <div className='flex gap-1 items-center justify-center'>
                    <Link to={!user ? '/signup' : '/donate'} className='bg-[#B5C04A] p-2 px-4 rounded-[10px] font-bold text-[#FFF] hover:scale-105 active:scale-95 transition-all duration-100'>{!user ? 'JOIN US NOW' : 'DONATE'}</Link>
                    <Link to='/aboutus' className='bg-[#FFF] p-2 px-4 rounded-[10px] font-bold text-[#889132] hover:scale-105 active:scale-95 transition-all duration-100'>MORE INFO</Link>
                </div>
                
              </div>


            </div>


            <div className='flex flex-col items-center w-full'>
              <div className='flex flex-col items-center gap-5 py-10 w-full bg-[#FFF] bg-[url(/assets/background-paws.png)] bg-cover bg-fit bg-repeat'>
                <label className='text-[#2F2F2F] text-[40px] text-center font-bold leading-tight'>From Stray to Stay: <br/> Caring for a Rescue Cat</label>

                <div className='text-center text-[#2F2F2F] text-[20px] font-bold w-[400px] xl:w-[500px] lg:w-[500px] md:w-[500px]'>
                  Adopting is a big responsibility as cats who once lived on the streets need time, patience and extra love to adjust to their new home.
                </div>
              </div>
              
              <div className='flex flex-col xl:flex-row w-full justify-center gap-10 py-10 leading-tight bg-[#B5C04A] border-y-2 border-y-[#889132] bg-[url(/assets/background-paws.png)] bg-cover bg-fit bg-repeat'>
                <div className='flex flex-col items-center justify-center rounded-[15px] p-4'>
                  <div className='text-[60px] text-[#FFF] text-center font-bold w-[350px]'>10, 000</div>
                  <div className='font-bold text-[20px] text-[#2F2F2F]'>Total Cats Adopted</div>
                </div>

                <div className='flex flex-col items-center justify-center rounded-[15px] p-4'>
                  <div className='text-[60px] text-[#FFF] text-center font-bold min-w-[350px]'>₱10, 000</div>
                  <div className='font-bold text-[20px] text-[#2F2F2F]'>Total Donations Received</div>
                </div>
              </div>

              <div className='flex flex-col items-center justify-center gap-4 bg-[#F9F7DC] bg-[url(src/assets/background-paws.png)] bg-cover bg-fit bg-repeat w-[500px] xl:px-20 lg:px-20 xl:w-auto lg:w-auto md:w-auto sm:w-full'>
                <div className='grid grid-cols-[auto_auto_auto_auto] overflow-y-auto w-full xl:w-full lg:w-auto px-10 sm:grid-cols-4 sm:w-full p-4 xl:grid xl:grid-cols-[auto_auto_auto_auto] lg:grid-cols-[auto_auto_auto_auto] md:grid-cols-[auto_auto] sm:grid-cols-[auto_auto] gap-2 xl:px-[5%] lg:px-[5%]'>
                  {catList.map((cat) => (
                    <div key={cat.cat_id} onClick={() => navigate(`/catprofile/${cat.cat_id}`)}
                    className='w-[300px] xl:w-full lg:w-full md:w-[300px] sm:w-full grid grid-rows-[auto_auto] rounded-[25px] border-2 border-[#FFF] bg-white hover:border-2 hover:border-[#B5C04A] hover:scale-102 active:scale-98 transition-all duration-100'>
                      <div className='overflow-hidden flex rounded-t-[25px] w-auto h-[250px] xl:w-full lg:w-full md:w-full '>
                        <img 
                        src={cat.thumbnail} 
                        alt={`cat image ${cat.cat_id}`} 
                        className='overflow-hidden w-[300px] sm:w-full h-auto object-cover'/>
                      </div>
      
                      <div className='flex flex-col justify-center p-3 overflow-hidden'> 
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
                        
                          <p className='pl-2 text-[14px] text-[#555555] leading-tight text-justify break-words whitespace-normal h-[40px]'>
                            {cat.description.length > 50 ? cat.description.slice(0, 50) + '...' : cat.description}
                          </p>
      
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/catadoption" className='w-fit self-center bg-[#99A339] text-[#FFF] font-bold p-3 rounded-[15px] hover:scale-105 active:scale-95 transition-all duration-100'>SEE MORE CATS</Link>
              </div>

              
            </div>

            {/* <div className='flex flex-col items-center justify-center p-5  w-full'>
              <label className='font-bold text-[#2F2F2F] text-[50px]'>WHO ARE WE</label>

              <div className='grid grid-rows-1 w-[400px] xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 xl:w-auto lg:w-auto md:w-auto sm:w-auto gap-5 place-items-center rounded-[15px] bg-[#DC8801] p-5'>
                <div className='rounded-[15px] overflow-hidden'>
                  <img src="/src/assets/image/who_are_we.jpg" alt="" />
                </div>
                <div className='flex flex-col items-center font-bold text-center text-[#FFF] text-[16px] gap-10'>
                  <div className='flex flex-col gap-3'>
                    <div className='text-[30px] leading-tight'>
                      Siena Park Residences Cat Community
                    </div>
                    The Siena Park Cat Community is a dedicated group focused on the welfare of stray cats in Siena Park Residences. Supported by DMCI Homes, the group advocates for responsible pet ownership through a shared vision of reducing the stray cat population and finding forever homes for these cats.
                  </div>

                  <div className='flex gap-2 items-center'>
                    <Link to="/aboutus" className='w-fit bg-[#FFF] text-[#DC8801] font-bold p-3 rounded-[15px] hover:scale-105 active:scale-95 transition-all duration-100'>JOINS US NOW</Link>

                    <label htmlFor="">OR</label>

                    <a href="https://www.facebook.com/sprcats" target="_blank" className="w-[15px] h-[15px] object-fit hover:scale-105 active:scale-95 transition-all duration-100">
                      <img src="/src/assets/icons/facebook.png" alt="facebook logo" className="w-full h-full object cover"/>
                    </a>
                  </div>
                </div>
              </div>
            </div> */}
            {/* CONTENT ENDS HERE */}
          </div>

      </div>
      <Footer />
    </div>

  )
}

export default Home
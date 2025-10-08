import React from 'react'
import { Link } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar';
import SideNavigation from '../components/SideNavigation';
import HeadVolunteerSideBar from '../components/HeadVolunteerSideBar';
import Footer from '../components/Footer';
import CatBot from '../components/CatBot';


import { useSession } from '../context/SessionContext'
import Whisker from '../components/Whisker';


const AboutUs = () => {
  
  const { user } = useSession();

  return (
    <div className='flex flex-col min-h-screen'>
      <CatBot message={'For more information about our community cats, please visit our FB page at https://www.facebook.com/sprcats'}/>
      <NavigationBar />

      <Whisker />

      <div className='flex flex-col items-center h-full xl:p-10 lg:p-10 md:p-10 xl:px-30 lg:px-10 md:px-10'>
        <div className='flex flex-col box-border'>
          {/* ALL CONTENTS HERE */}
          <div className='relative flex flex-col items-center justify-center w-full h-auto p-10 bg-[#FFF] gap-5 xl:rounded-[25px] lg:rounded-[25px] md:rounded-[25px] shadow-md'>

            <h1 className='font-bold text-3xl text-center'> About Siena Park Residences Cat Community </h1>

            <label className='text-justify'>
              The Siena Park Cat Community is a dedicated group focused on the welfare of stray cats in Siena Park Residences. Supported by DMCI Homes, the group advocates for responsible pet ownership through a shared vision of reducing the stray cat population and finding forever homes for these cats.
            </label>
            
            <label className='flex items-start pb-1 border-b-2 border-b-[#DC8801] w-full font-bold text-2xl text-[#DC8801]'>Community Pillars</label>

            <div className='flex flex-col gap-8 w-full'>
              <div className='flex flex-col'>
                <label className='font-bold'>Humane Advocacy for Stray Carts</label>
                <label className='text-justify'>Advocating for the humane treatment of stray and community cats, the group promotes empathy, compassion, and responsible actions toward animals living within the residential environment.</label>
              </div>
              <div className='flex flex-col'>
                <label className='font-bold'>Implementation of Trap-Neuter-Realease (TNVR) Program</label>
                <label className='text-justify'>At the core of the community's initiatives is the TNVR program that focuses on humanely controlling the stray cat popuilation, reducing nuisance behaviors of feral cats and improve overall public health.</label>
              </div>
              <div className='flex flex-col'>
                <label className='font-bold'>Rescue, Rehabilitation, and Rehoming</label>
                <label className='text-justify'>The community rescues injured, sick, or abandoned cats, providing necessary care and support. Efforts are made to rehabilitate these cats and place them in foster homes or secure permanent adoptions.</label>
              </div>
              <div className='flex flex-col'>
                <label className='font-bold'>Sustained Community Engagement</label>
                <label className='text-justify'>Encouraging active involvement from residents, volunteers, and supperters though regular feeding, care giving, and monitoring work are done to ensuring the safety and well-being of the cats.</label>
              </div>
            </div>
          </div>
        </div>
        
        {/* <SideNavigation/> */}
        
      </div>
      <Footer />
    </div>
  )
}

export default AboutUs
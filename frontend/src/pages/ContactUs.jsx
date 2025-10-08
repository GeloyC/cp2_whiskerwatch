import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar';
import SideNavigation from '../components/SideNavigation';
import HeadVolunteerSideBar from '../components/HeadVolunteerSideBar';
import Footer from '../components/Footer';
import CatBot from '../components/CatBot';

import { useSession } from '../context/SessionContext'
import Whisker from '../components/Whisker';

const ContactUs = () => {

  const { user } = useSession();


  return (
    <div className='flex flex-col items-center min-h-screen'>
      <CatBot message={`Contact us anytime, we're always here to help!`}/>
      <NavigationBar />

      <Whisker />
      <div className='flex flex-col items-center xl:py-10 lg:py-10 md:py-7 sm:py-3'>
        <div className='flex flex-col items-center justify-center'> 
          <div className='relative flex flex-col items-center bg-[#FFF] xl:w-[1000px] overflow-hidden p-10 gap-5 rounded-[25px] shadow-md'>
            <label className='font-bold text-2xl text-center'>Pet Shops and Veterinary Clinics Near Us</label>

            <div className='flex flex-col w-full xl:grid xl:grid-cols-3 gap-7'>
              <div className='flex flex-col bg-[#FDF5D8] p-3 drop-shadow-[0px_-12px_0px_rgba(181,192,74,1)] w-full rounded-[25px] gap-3'>
                <div className='flex flex-row items-center justify-between border-b-2 border-b-[#B5C04A] pb-2'>
                  <label className='font-bold text-[18px]'>Delivery Option</label>
                  <div className='flex items-center justify-center h-auto w-[50px] p-2 bg-[#CFDA34] rounded-[25px]'>
                    <img src="/assets/icons/delivery.png" alt="box" className='w-full h-full object-contain'/>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <label className='font-bold text-[#DC8801]'>Barkbol Pet Supplies and Trading</label>
                  <label>Las Pinas City</label>
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='leading-tight'>Free delivery with minimum purchase!</label>
                  <label className='underline'>0960 604 1885</label>
                </div>
              </div>

              <div className='flex flex-col bg-[#FDF5D8] p-3 drop-shadow-[0px_-12px_0px_rgba(181,192,74,1)] w-full rounded-[25px] gap-3'>
                <div className='flex flex-row items-center justify-between border-b-2 border-b-[#B5C04A] pb-2'>
                  <label className='font-bold text-[18px]'>Veterinary Clinics</label>
                  <div className='flex items-center justify-center h-auto w-[50px] p-2 bg-[#CFDA34] rounded-[25px]'>
                    <img src="/assets/icons/clip-board.png" alt="box" className='max-w-full max-h-full object-contain'/>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <label className='font-bold text-[#DC8801]'>Petpaws Animal Clinic</label>
                  <label className='leading-tight'>Dona Soledad, Paranaque City</label>
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='leading-tight'>Open 24 Hours for your pet's needs!</label>
                  <label>
                    <label className='underline'>0919 306 7808</label>
                    <label> or </label>
                    <label className='underline'>0915 615 7776</label>
                  </label>
                </div>
              </div>

              <div className='flex flex-col bg-[#FDF5D8] p-3 drop-shadow-[0px_-12px_0px_rgba(181,192,74,1)] w-full rounded-[25px] gap-3'>
                <div className='flex flex-row items-center justify-between border-b-2 border-b-[#B5C04A] pb-2'>
                  <label className='font-bold text-[18px]'>Delivery Option</label>
                  <div className='flex items-center justify-center h-auto w-[50px] p-2 bg-[#CFDA34] rounded-[25px]'>
                    <img src="/assets/icons/delivery.png" alt="box" className='max-w-full max-h-full object-contain'/>
                  </div>
                </div>
                <div className='flex flex-row justify-between items-center'>
                  <div className='flex flex-col'>
                    <label className='font-bold leading-tight'>Jeal's Petshop</label>
                    <label>Paranaque City</label>
                  </div>
                  <div>
                    <label className='underline'>0960 354 4354</label>
                  </div>
                </div>
                <div className='flex flex-row justify-between  items-center'>
                  <div className='flex flex-col w-fit'>
                    <label className='font-bold leading-tight'>Grinsy Petshop</label>
                    <label className='leading-tight'>Dona Soledad, Paranaque City</label>
                  </div>
                  <div>
                    <label className='underline whitespace-norwap'>0927 335 7878</label>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='flex items-center justify-center object-cover w-[430px] h-[250px]'>
              <img src="src/assets/cat-contacts.png" alt="cat image" className='h-full w-full object-cover'/>
            </div> */}

            <div className='w-full h-[250px] rounded-[15px] overflow-hidden'>
              <img src="/assets/cat-contacts.png" alt="" className='w-full h-full object-cover'/>
            </div>

            <label className='leading-tight text-center'>
              Stay updated on pet care tips, events, and adorable cat pictures follow us at 
              <Link to="https://www.facebook.com/sprcats" target='_blank' className='text-[#DC8801]'> https://www.facbook.com/sprcats</Link> 
            </label>
          </div>
        </div>

        {/* <SideNavigation/> */}
      </div>  

      <Footer />    
    </div>
  )
}

export default ContactUs
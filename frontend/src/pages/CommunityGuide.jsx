import React from 'react'
import { Link } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import Footer from '../components/Footer'
import SideNavigation from '../components/SideNavigation'
import HeadVolunteerSideBar from "../components/HeadVolunteerSideBar";
import CatBot from '../components/CatBot'


import { useSession } from '../context/SessionContext'
import Whisker from '../components/Whisker'



const CommunityGuide = () => {

  const { user } = useSession();

  return (
    <div className='flex flex-col justify-start items-center min-h-screen w-auto'>
      <CatBot message={`Community Guidelines!! Best to follow them all the time.`}/>
      <NavigationBar />

      <Whisker />

      <div className='flex items-start justify-center h-screen w-full xl:w-[1000px] lg:w-[1000px] xl:pt-10 lg:pt-10 md:pt-0'>
        <div className='flex flex-col h-full xl:h-auto lg:h-auto md:h-full w-full'>
          <div className='flex flex-col h-full w-auto'>
            <div className='relative flex flex-col  w-auto h-full bg-[#FFF] p-10 xl:rounded-[25px] lg:rounded-[25px] gap-10'>

              <div className='flex items-start gap-5'>
                <div className='flex size-12 p-2 xl:size-17 lg:size-17 md:size-15 xl:p-4 lg:p-3 bg-[#f3e0c3] object-fill rounded-[75px]'>
                  <img src="/assets/icons/id.png" alt="id" className='min-w-full min-h-full object-cover'/>
                </div>

                <div className='flex flex-col items-start w-full gap-2'>
                  <label className='font-bold border-b-2 border-b-[#DC8801] pb-2'>Only official Volunteers may feed the cats at a designated time and place.</label>
                  <label className='leading-tight italic text-[#8f8f8f] text-[14px]'>Ang mga opisyal na voluteer lang ang puwedeng magpakain sa mga pusa sa tamang oras at lugar.</label>
                </div>
              </div>

              <div className='flex items-start gap-5'>
                <div className='flex size-12 p-2 xl:size-17 lg:size-17 md:size-15 xl:p-4 lg:p-3 bg-[#f3e0c3] object-fill rounded-[75px]'>
                  <img src="/assets/icons/trash-bin-black.png" alt="id" className='min-w-full min-h-full object-cover'/>
                  {/* <img src="src/assets/icons/check.png" alt="check mark" className='absolute bottom-[-10%] right-[-10%] size-7'/> */}
                </div>

                <div className='flex flex-col items-start w-full gap-2'>
                  <label className='font-bold border-b-2 border-b-[#DC8801] pb-2'>Please ensure that your food waste is properly sealed and disposed inside the bins so the cats won't sniff it out.</label>
                  <label className='leading-tight italic text-[#8f8f8f] text-[14px]'>Pakiusuyong ayusin ang pagtapon ng mga tirang pagkain. Iwasto ang pagsilid nito sa basurahan upang hindi ito kalkalin ng mga pusa.</label>
                </div>

              </div>

              <div className='flex items-start gap-5'>
                <div className='flex size-12 p-2 xl:size-17 lg:size-17 md:size-15 xl:p-4 lg:p-3 bg-[#f3e0c3] object-fill rounded-[75px]'>
                  <img src="/assets/icons/cat-food.png" alt="id" className='min-w-full min-h-full object-cover'/>
                  {/* <img src="src/assets/icons/check.png" alt="check mark" className='absolute bottom-[-10%] right-[-10%] w-[35px] h-auto'/> */}
                </div>

                <div className='flex flex-col items-start w-full gap-2'>
                  <label className='font-bold border-b-2 border-b-[#DC8801] pb-2'>Please don't feed them food that's meant for humans. If you wish to donate CAT FOOD, please coordinate with our volunteers.</label>
                  <label className='leading-tight italic text-[#8f8f8f] text-[14px]'>Huwag pakainin ng pagkaing pang-tao ang mga pusa. Kung nais mong mag-donate ng cat food, paki paalam sa ating mga volunteer.</label>
                </div>

              </div>

              {/* <div className='flex items-start gap-5'>
                <div className='flex size-12 p-2 xl:size-17 lg:size-17 md:size-15 xl:p-4 lg:p-3 bg-[#f3e0c3] object-fill rounded-[75px]'>
                  <img src="/assets/icons/canned-food.png" alt="id" className='min-w-full min-h-full object-cover'/>
                  
                </div>

                <div className='flex flex-col items-start w-auto gap-2'>
                  <label className='font-bold border-b-2 border-b-[#DC8801] pb-2'>Only official volunteers are allowed to feed the cats at the designated time and place.</label>
                  <label className='leading-tight italic text-[#8f8f8f] text-[14px]'>Ang mga opisyal na voluteer lang ang puwedeng magpakain sa mga pusa sa tamang oras at lugar.</label>
                </div>

              </div> */}
              
            </div>
          </div>
        </div>

        {/* <SideNavigation /> */}

      </div>
      <Footer />

    </div>
  )
}

export default CommunityGuide
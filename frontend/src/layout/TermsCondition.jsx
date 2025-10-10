import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useLocation, useNavigate  } from 'react-router-dom'

const TermsCondition = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back one step in the history
  };

  
  return (
    <div className='aboslute top-o left-0 flex flex-col w-auto items-start justify-center bg-[#FFF]'>
        <button className='absolute left-3 top-3 bg-[#DC8801] p-2 rounded-[10px] flex gap-2 item-center'>
          <div className='size-6'>
            <img src="/assets/icons/right-arrow.png" alt="" className='rotate-180'/>
          </div>
          <span className='text-[#FFF] font-bold'>Go back</span>
        </button>
        <div className='flex flex-col gap-10 items-center justify-start h-full p-10'>

          <div className='max-w-[250px] min-w-[150px] h-auto object-cover'>
            <img src="/assets/whiskerwatchlogo-vertical.png" alt="" className='w-full h-full object-cover'/>
          </div>
          
          <span className='text-3xl text-[#2F2F2F] font-bold'>WhiskerWatch Terms and Conditions</span>
          <div className='xl:w-[700px] lg:w-[700px] md:w-[700px] flex flex-col gap-10'>
            <span className='text-center text-[#2F2F2F]'>
              Welcome to WhiskerWatch, a web-based platform for managing stray cat welfare activities within DMCI Siena Park Residences. By accessing or using this platform, you agree to the following Terms and Conditions. Please read them carefully before continuing.
            </span>

            <div className='flex flex-col gap-1 text-center'>
              <span className='font-bold'>Acceptance of Terms</span>
              <span>
                By creating an account or using WhiskerWatch, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions.
              </span>
            </div>

            <div className='flex flex-col gap-1 text-center'>
              <span className='font-bold'>Purpose of the Platform</span>
              <span>
                WhiskerWatch is designed to manage cat adoptions, donations, and feeding schedules, promote community participation through gamified features, and provide monthly analytics and welfare reports. The platform is intended for residents and authorized volunteers of the Siena Park Residences community.
              </span>
            </div>

            <div className='flex flex-col gap-1 text-center'>
              <span className='font-bold'>User Responsibilities</span>
              <span>
                Users agree to provide accurate and truthful information during registration and use. They must use the platform solely for legitimate cat welfare activities, respect others’ privacy, and avoid abusive or inappropriate content. Misuse of the system is strictly prohibited.
              </span>
            </div>

            <div className='flex flex-col gap-1 text-center'>
              <span className='font-bold'>Data Privacy and Security</span>
              <span>
                WhiskerWatch collects basic user data such as name, email, and contact information for identification and system functionality. All data is securely stored and used only for cat welfare management purposes. The platform complies with applicable data privacy regulations. 
              </span>
            </div>

            <div className='flex flex-col gap-1 text-center'>
              <span className='font-bold'>Adoption, Donation, and Feeding Activities</span>
              <span>
                All adoption, donation, and feeding applications are subject to review and approval by the head volunteer or admin. Donations made through the platform are considered final and non-refundable. WhiskerWatch is not responsible for disputes or arrangements made outside the system.
              </span>
            </div>

            <div className='flex flex-col gap-1 text-center'>
              <span className='font-bold'>Gamification and Rewards</span>
              <span>
                Users may earn digital badges or progress recognition through participation in welfare activities. These rewards are for engagement purposes only and do not have any monetary value.
              </span>
            </div>


            <div className='flex flex-col gap-1 text-center'>
              <span className='font-bold'>Account Suspension or Termination</span>
              <span>
                Administrators reserve the right to suspend or delete accounts that violate community rules, falsify information, or misuse the system. Decisions made by the administrators are final.
              </span>
            </div>


            <div className='flex flex-col gap-1 text-center'>
              <span className='font-bold'>Limitation of Liability</span>
              <span>
                WhiskerWatch, its developers, and associated volunteers are not liable for any damages or losses resulting from misuse of the system, technical errors, or service interruptions.
              </span>
            </div>


            <div className='flex flex-col gap-1 text-center'>
              <span className='font-bold'>Modifications to Terms</span>
              <span>
                The WhiskerWatch administration may update or modify these Terms and Conditions at any time. Users will be notified of any updates, and continued use of the platform will constitute acceptance of the new terms.
              </span>
            </div>


          </div>
        </div>

      {/* <Footer /> */}
    </div>
  )
}

export default TermsCondition
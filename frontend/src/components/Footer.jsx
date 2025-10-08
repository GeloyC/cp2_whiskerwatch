import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='flex flex-row justify-between items-center bg-[#DC8801] w-screen h-12 px-5 xl:px-10 lg:px-10 md:px-30 sm:px-10'>
        <label className='text-[#FFF]'>WhiskerWatch est. 2025</label>
        <Link to="https://www.facebook.com/sprcats" target='_blank' className='flex items-center justify-center w-[50px] p-[8px] h-auto  drop-shadow-lg'>
            <img src="src/assets/icons/facebook.png" alt="" className='max-w-full max-h-full object-contain'/>
        </Link>
    </div>
  )
}

export default Footer
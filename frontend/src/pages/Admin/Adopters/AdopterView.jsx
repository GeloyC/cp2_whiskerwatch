import React from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import { Link } from 'react-router-dom'

const AdopterView = () => {
  return (
    <div className='relative flex flex-col h-screen'>
        <div className='grid grid-cols-[20%_80%] overflow-x-hidden'> 
            <AdminSideBar />
            <div className='flex flex-col items-start p-10 min-h-screen gap-5 mx-auto overflow-y-scroll'>  
                <div className='flex flex-row w-full justify-between items-center'>
                    <label className='text-[#2F2F2F] text-[24px] font-bold'>Adopter Profile</label>
                    <Link to="/adopterslist" className='bg-[#2F2F2F] p-2 pl-4 pr-4 text-[#FFF] font-bold rounded-[10px]'> Go Back</Link>
                </div>
           
                <div className='flex flex-col w-full h-auto bg-[#FFF] p-5 gap-6 rounded-[10px]'>
                    <div className='flex flex-row items-center justify-between gap-10 pb-2 border-b-1 border-b-[#CFCFCF]'>
                        <div className='flex flex-row items-center gap-10'>
                            <div className='flex flex-row items-center gap-2'>
                                <label className='text-[#2F2F2F] text-[16px]'>Name of Adopter:</label>
                                <label className='text-[#2F2F2F] text-[16px] font-bold'>Angelo Cabangal</label>
                            </div>
                            <div className='flex flex-row items-center gap-2'>
                                <label className='text-[#2F2F2F] text-[16px]'>Cat Adopted:</label>
                                <label className='text-[#2F2F2F] text-[16px] font-bold'>Bob</label>
                            </div>
                        </div>

                        <div className='flex flex-row items-center gap-2'>
                            <label className='text-[#2F2F2F] text-[16px]'>Date of Adoption:</label>
                            <label className='text-[16px] font-bold'>00/00/000</label>
                        </div>
                    </div>

                    <div className='flex w-full items-center justify-center'>
                        <div className='block p-5 w-[1000px] h-auto'>
                            <img src="/src/assets/AdoptionCertificate/Certificate.png" alt="" className='self-center'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdopterView
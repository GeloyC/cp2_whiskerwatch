import React from 'react'
import AdminSideBar from '../../components/AdminSideBar'

const Volunteers = () => {
  return (
    <div className='relative flex flex-col min-h-screen overflow-hidden'>
      <div className='grid grid-cols-[20%_80%]'>
        <AdminSideBar />
        <div className='flex flex-col items-center p-10 min-h-screen gap-10 mx-auto overflow-y-scroll'>
          Volunteers
        </div>
      </div>

    </div>
  )
}

export default Volunteers
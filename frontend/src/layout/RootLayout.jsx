import React from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='relative w-full min-h-screen bg-[#f9f7dc] bg-[url(/assets/background-paws.png)] bg-cover bg-fit bg-repeat'> 
        {/* <CatBot /> */}
        <ScrollRestoration />
        <Outlet />
    </div>
  )
}

export default RootLayout
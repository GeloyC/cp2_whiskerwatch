import React, { useState, useEffect } from 'react'
import AdminSideBar from '../../components/AdminSideBar'

const DonationApplication = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className='relative flex flex-col h-screen overflow-hidden'>
            <div className='flex flex-row w-full'>
                <AdminSideBar className='max-w-[400px]'/>

                <div className='flex flex-col items-center xl:p-10 lg:p-10 min-h-screen gap-5 w-full mx-auto'>
                    <div className='xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-screen gap-3 rounded-[15px]'>
                        <label className='text-2xl text-[#2F2F2F] text-center'>Unable to access this page</label>
                        <label className='text-[#8f8f8f] text-center'>You can access the page on larger screen size such as desktop/laptop screens</label>
                    </div>

                    <div className='hidden xl:flex lg:flex w-full justify-between pb-2 border-b-1 border-b-[#2F2F2F]'>
                        <label className='text-[24px] font-bold text-[#2F2F2F]'>Donation Applications</label>
                    </div>
                    
                    <div className='hidden xl:flex lg:flex flex-row justify-between w-full'>
                        <form className='flex gap-2'>
                            <input type="search" placeholder='Search' className='bg-[#FFF] p-2 min-w-[400px] border-1 border-[#595959] rounded-[15px]' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                        </form>
                    </div>


                    <table className='hidden xl:flex lg:flex flex-col w-full gap-2'>
                        <thead className='flex w-full'>
                            <tr className='grid grid-cols-[15%_15%_40%_20%_10%] justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
                                <th>Application No.</th>
                                <th>Donator</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Decision</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className='grid grid-cols-[15%_15%_40%_20%_10%] justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[10px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                                <td>100</td>
                                <td>Angelo Cabangal</td>
                                <td>asdjhaskdjahsd</td>
                                <td className='bg-[#CCCCCC] px-3 py-1 rounded-[5px] font-bold text-[#2F2F2F]'>
                                    Pending
                                </td>
                                <td className='flex items-center gap-1'>
                                    <button className='cursor-pointer bg-[#889132] rounded-full size-8 p-2 active:bg-[#B5C04A]'>
                                        <img src="/assets/icons/admin-icons/check.png" alt="" />
                                    </button>
                                    <button className='cursor-pointer bg-[#e52c1a] rounded-full size-8 p-2 active:bg-[#d95a51]'>
                                        <img src="/assets/icons/admin-icons/reject.png" alt="" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default DonationApplication
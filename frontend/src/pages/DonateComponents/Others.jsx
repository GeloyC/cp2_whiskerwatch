import React from 'react'
import { useState } from 'react';

const Others = () => {
  const [otherDescription, setOtherDescription] = useState('');

  const handleOtherDescription = (e) => {
    e.preventDefault();
    
    console.log('Items description: ', otherDescription)
  }

  return (
    <form onSubmit={handleOtherDescription} className='flex flex-col items-center p-2 w-full '>
        <label className='text-[#2F2F2F] text-[24px] font-bold'>OTHERS</label>
        
        <div className='flex items-start justify-start w-full gap-5 pb-5'>
            <div className='flex flex-col items-start w-full'>
                <label className='text-[16px] text-[#2F2F2F] font-bold'>Description</label>
                <textarea name="" id="" rows={6} placeholder='Add description'
                value={otherDescription} onChange={(e) => setOtherDescription(e.target.value)}
                className='w-full p-2 rounded-[10px] border-1 border-[#A3A3A3] resize-none'></textarea>
            </div>
        </div>
    </form>
  )
}

export default Others
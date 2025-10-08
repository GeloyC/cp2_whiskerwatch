import React, { useState } from 'react'

const Items = () => {
  const [itemDescription, setItemDescription] = useState('');

  const handleItemDescription = (e) => {
    e.preventDefault();
    
    console.log('Items description: ', itemDescription)
  }

  return (
    <form onSubmit={handleItemDescription} className='flex flex-col items-center p-2 w-full '>
        <label className='text-[#2F2F2F] text-[24px] font-bold'>ITEMS</label>
        
        <div className='flex items-start justify-start w-full gap-5 pb-5'>
            <div className='flex flex-col items-start w-full'>
                <label className='text-[16px] text-[#2F2F2F] font-bold'>Description</label>
                <textarea name="" id="" rows={6} placeholder='Add description'
                value={itemDescription} onChange={(e) => setItemDescription(e.target.value)}
                className='w-full p-2 rounded-[10px] border-1 border-[#A3A3A3] resize-none'></textarea>
            </div>
        </div>
    </form>
  )
}

export default Items
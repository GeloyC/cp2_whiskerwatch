import React from 'react'
import { useState } from 'react';

const Food = () => {
    const [amount, setAmount] = useState(1);
    const [foodType, setFoodType] = useState('');
    const [description, setDescription] = useState('')

    const addAmount = () => {
        setAmount(prev => prev + 1)
    }

    const subtractAmount = () => {
        setAmount(prev => (prev > 1 ? prev - 1 : 1))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Selected Food Type:", foodType);
        console.log("Quantity:", amount);
        console.log("Description: ", description)
        // Do something with the values
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center p-2 w-full '>
            <label className='text-[#2F2F2F] text-[24px] font-bold'>FOOD</label>
            
            <div className='flex items-start justify-start w-full gap-5 pb-5'>
                <div className='flex flex-col justify-between w-[150px] h-full'>
                    <div className='flex flex-col w-full'>
                    <label className='text-[16px] text-[#2F2F2F] font-bold'>Type of food</label>
                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor="wet_food" className='flex items-center gap-4 border-1 border-[#A3A3A3] rounded-[10px] p-2 w-fit'>
                        <input type="radio" name="donation_food" id="wet_food" checked={foodType === 'wet'}
                        value="wet" onChange={(e) => setFoodType(e.target.value)}/>
                        Wet Food
                        </label>
                        <label htmlFor="dry_food" className='flex items-center gap-4 border-1 border-[#A3A3A3] rounded-[10px] p-2 w-fit'>
                        <input type="radio" name="donation_food" id="dry_food" checked={foodType === 'dry'}
                        value="dry" onChange={(e) => setFoodType(e.target.value)} />
                        Dry Food
                        </label>
                    </div>
                    </div>

                    <div className='flex flex-col w-full'>
                    <label className='text-[16px] text-[#2F2F2F] font-bold'>Quantity</label>
                    <div className='flex gap-2 items-center w-fit p-1 border-1 border-[#DC8801] rounded-[25px]'>
                        <button type='button' onClick={subtractAmount}
                        className='w-[20px] h-[20px] cursor-pointer active:scale-90'>
                        <img src="/src/assets/icons/subtract.png" alt="" className='w-full h-full object-cover'/>
                        </button>
                        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                        className='appearance-none bg-[#ECECEC] text-center inset-0 w-[50px]'/>
                        <button type='button' onClick={addAmount}
                        className='w-[20px] h-[20px] cursor-pointer active:scale-90'>
                        <img src="/src/assets/icons/plus.png" alt="" className='w-full h-full object-cover'/>
                        </button>
                    </div>
                    </div>
                </div>

                <div className='flex flex-col gap-2 items-start w-full'>
                    <label className='text-[16px] text-[#2F2F2F] font-bold'>Description</label>
                    <textarea name="" id="" rows={6} placeholder='Add description' value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='w-full p-2 rounded-[10px] border-1 border-[#A3A3A3] resize-none'></textarea>
                </div>
            </div>
        </form>
    )
}

export default Food
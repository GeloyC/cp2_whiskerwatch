import React, { useState } from 'react'

const Money = () => {
    const [amount, setAmount] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');

    const handleMoneyDonation = (e) => {
        e.preventDefault();

        console.log('Amount: ', amount);
        console.log('Reference Number: ', referenceNumber);
    }

    return (
        <form onSubmit={handleMoneyDonation} className='flex flex-col items-center p-2 w-full gap-4'>
            <div className='flex justify-between items-center'>
            <label className='text-[#2F2F2F] text-[24px] font-bold'>MONEY</label>
            </div>

            <div className='flex justify-center w-full gap-5 pb-5'>
                <div className='flex flex-col gap-10'>
                    <div className='flex flex-col w-[300px]'>
                    <label className='text-[14px] text-[#A3A3A3]'>Please specify the amount and scan the QR code:</label>
                    <div className='flex items-center gap-2'>
                        ₱
                        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)}
                        className='p-3 border-b-1 border-b-[#595959] rounded-[10px]' placeholder='Add amount here' required/>
                    </div>
                    </div>

                    <div className='flex flex-col w-[300px]'>
                    <label className='text-[14px] text-[#A3A3A3]'>Enter the reference number of the transaction after:</label>
                    <div htmlFor="" className='flex items-center gap-2'>
                        <input type="text" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)}
                        className='p-3 border-b-1 border-b-[#595959] rounded-[10px]' placeholder='Reference Number' required/>
                    </div>
                    </div>
                </div>

                <div className='flex flex-col'>
                    <div className='w-[250px] h-[250px] bg-[#A3A3A3] overflow-hidden rounded-[10px] object-contain border-1 border-[#CCCCCC]'>
                    <img src="/src/assets/UserProfile/test_qr_code.jpg" alt="" className='w-full h-full object-cover'/>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Money
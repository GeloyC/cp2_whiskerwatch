// import React, { useState, useEffect } from 'react'
// import AdminSideBar from '../../components/AdminSideBar'

// const DonationApplication = () => {
//     const [searchQuery, setSearchQuery] = useState('');

//     return (
//         <div className='relative flex flex-col h-screen overflow-hidden'>
//             <div className='flex flex-row w-full'>
//                 <AdminSideBar className='max-w-[400px]'/>

//                 <div className='flex flex-col items-center xl:p-10 lg:p-10 min-h-screen gap-5 w-full mx-auto'>
//                     <div className='xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-screen gap-3 rounded-[15px]'>
//                         <label className='text-2xl text-[#2F2F2F] text-center'>Unable to access this page</label>
//                         <label className='text-[#8f8f8f] text-center'>You can access the page on larger screen size such as desktop/laptop screens</label>
//                     </div>

//                     <div className='hidden xl:flex lg:flex w-full justify-between pb-2 border-b-1 border-b-[#2F2F2F]'>
//                         <label className='text-[24px] font-bold text-[#2F2F2F]'>Donation Applications</label>
//                     </div>
                    
//                     <div className='hidden xl:flex lg:flex flex-row justify-between w-full'>
//                         <form className='flex gap-2'>
//                             <input type="search" placeholder='Search' className='bg-[#FFF] p-2 min-w-[400px] border-1 border-[#595959] rounded-[15px]' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
//                         </form>
//                     </div>


//                     <table className='hidden xl:flex lg:flex flex-col w-full gap-2'>
//                         <thead className='flex w-full'>
//                             <tr className='grid grid-cols-[15%_15%_40%_20%_10%] justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
//                                 <th>Application No.</th>
//                                 <th>Donator</th>
//                                 <th>Description</th>
//                                 <th>Status</th>
//                                 <th>Decision</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             <tr className='grid grid-cols-[15%_15%_40%_20%_10%] justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[10px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
//                                 <td>100</td>
//                                 <td>Angelo Cabangal</td>
//                                 <td>asdjhaskdjahsd</td>
//                                 <td className='bg-[#CCCCCC] px-3 py-1 rounded-[5px] font-bold text-[#2F2F2F]'>
//                                     Pending
//                                 </td>
//                                 <td className='flex items-center gap-1'>
//                                     <button className='cursor-pointer bg-[#889132] rounded-full size-8 p-2 active:bg-[#B5C04A]'>
//                                         <img src="/assets/icons/admin-icons/check.png" alt="" />
//                                     </button>
//                                     <button className='cursor-pointer bg-[#e52c1a] rounded-full size-8 p-2 active:bg-[#d95a51]'>
//                                         <img src="/assets/icons/admin-icons/reject.png" alt="" />
//                                     </button>
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default DonationApplication


import React, { useState, useEffect } from 'react';
import AdminSideBar from '../../components/AdminSideBar';
import axios from 'axios'; // Make sure you have axios installed: npm install axios

const DonationApplication = () => {
    const url = `https://whiskerwatch-0j6g.onrender.com`;

    const [searchQuery, setSearchQuery] = useState('');
    const [applications, setApplications] = useState([]); // State to hold fetched data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch pending applications
    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            // NOTE: Update the URL to your correct backend endpoint
            const response = await axios.get(`${url}/donate/donation_applications_pending`); 
            setApplications(response.data);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError('Failed to load pending applications.');
        } finally {
            setLoading(false);
        }
    };

    // Handler for Accept/Reject buttons
    const handleDecision = async (application_id, decision, donator_id) => {
        // For rejection, you might want to prompt for admin_remarks
        let admin_remarks = '';
        if (decision === 'Rejected') {
            admin_remarks = prompt("Please provide a brief reason for rejecting this donation:");
            if (admin_remarks === null) { // User clicked cancel
                return;
            }
        }
        
        try {
            // NOTE: Update the URL to your correct backend endpoint
            await axios.post(`${url}/donate/donation_review`, {
                application_id,
                decision, // 'Accepted' or 'Rejected'
                admin_remarks,
                donator_id // Optionally send for local debugging/logging
            });
            
            // Success message
            alert(`Application ${application_id} ${decision.toLowerCase()} successfully!`);

            // Refresh the list
            fetchApplications();

        } catch (err) {
            console.error("Decision Error:", err.response ? err.response.data : err);
            alert(`Error: Failed to process decision. ${err.response?.data?.message || 'Server error.'}`);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchApplications();
    }, []);

    // Filter applications based on search query
    const filteredApplications = (Array.isArray(applications) ? applications : [])
        .filter(app => 
            app.application_id.toString().includes(searchQuery) ||
            app.donator_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function to map status to a color class
    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending': return 'bg-[#CCCCCC] text-[#2F2F2F]';
            case 'Accepted': return 'bg-green-500 text-white';
            case 'Rejected': return 'bg-red-500 text-white';
            default: return 'bg-gray-400 text-white';
        }
    };


    if (!user && user?.role !== 'admin' || user?.role !== 'head_volunteer') {
        return (
            <div className='flex flex-col items-center justify-center h-screen gap-5'>
            <div className='size-20'>
                <img src="/assets/icons/warning_admin.png" alt="" />
            </div>
            <span className='font-bold text-[#E1341E] text-2xl text-center'>YOU CAN'T ACCESS THIS PAGE!</span>
            <Link to="/home" className='bg-[#B5C04A] px-3 py-1 rounded-[10px] hover:scale-101 active:scale-98 text-[#FFF]'>Go back Home page</Link>
            </div>
        )
    } else if (sessionLoading) {
        return (
            <div className='flex flex-col items-center justify-center h-full'>
            <span className='font-bold text-2xl text-[#2F2F2F]'>Loading ...</span>
            </div>
        )
    }


    return (
        <div className='relative flex flex-col h-screen overflow-hidden'>
            <div className='flex flex-row w-full'>
                <AdminSideBar className='max-w-[400px]'/>

                <div className='flex flex-col items-center xl:p-10 lg:p-10 min-h-screen gap-5 w-full mx-auto'>
                    
                    {/* ... (Existing mobile warning and header JSX) ... */}
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

                    {/* DYNAMIC TABLE */}
                    <table className='hidden xl:flex lg:flex flex-col w-full gap-2'>
                        <thead className='flex w-full'>
                            <tr className='grid grid-cols-[10%_15%_35%_25%_10%] justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
                                <th>App. ID</th>
                                <th>Donator</th>
                                <th>Items/Description</th>
                                <th>Date/Status</th>
                                <th>Decision</th>
                            </tr>
                        </thead>

                        

                        <tbody className='flex flex-col gap-1'>
                            {filteredApplications.length > 0 ? filteredApplications.map((app) => {
                                // Find the proof URL if the application contains a Money donation with proof
                                const moneyItemWithProof = app.items.find(item => 
                                    item.donation_type === 'Money' && item.proof_image
                                );

                                return (
                                    <tr key={app.application_id} className='grid grid-cols-[10%_15%_35%_25%_10%] justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[10px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                                        <td className='text-md font-bold'>{app.application_id}</td>
                                        <td className='text-md'>{app.donator_name}</td>
                                        
                                        <td>
                                            <div className='flex flex-row text-sm gap-6'>
                                                {/* <p className='font-bold mb-1'>Items ({app.items.length}):</p> */}
                                                <span className='list-disc list-inside ml-2 text-sm'>
                                                    {app.items.map((item, index) => (
                                                        <span key={index} className='truncate pr-2'>
                                                            {item.donation_type}: 
                                                            {item.donation_type === 'Money' 
                                                                ? ` PHP ${item.amount}` 
                                                                : item.quantity ? ` ${item.quantity}` : ' Item'}
                                                        </span>
                                                    ))}
                                                </span>
                                                
                                                {/* Conditional Rendering of Description vs. View Proof */}
                                                {moneyItemWithProof ? (
                                                    // If Money donation with proof exists, display only the link
                                                    <a 
                                                        href={moneyItemWithProof.proof_image} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-blue-600 underline text-sm mt-2 font-bold"
                                                    >
                                                        View Proof (Money Donation)
                                                    </a>
                                                ) : (
                                                    // Otherwise, display the textual description/summary
                                                    <li className='mt-2 italic flex-wrap max-w-full'>
                                                        {app.description}
                                                    </li>
                                                )}
                                            </div>
                                        </td>
                                        
                                        {/* ... remaining columns (Date/Status, Decision) ... */}
                                        <td className='flex flex-row items-center justify-center gap-2'>
                                            <p className='text-sm text-gray-500 mb-1'>{app.date_applied}</p>
                                            <span className={`px-3 py-1 rounded-[5px] font-bold text-center text-sm ${getStatusClass(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className='flex items-center gap-1'>
                                            <button 
                                                onClick={() => handleDecision(app.application_id, 'Accepted', app.donator_id)}
                                                className='cursor-pointer bg-[#889132] rounded-full size-8 p-2 active:bg-[#B5C04A]'
                                                title="Accept Donation"
                                            >
                                                <img src="/assets/icons/admin-icons/check.png" alt="Accept" />
                                            </button>
                                            <button 
                                                onClick={() => handleDecision(app.application_id, 'Rejected', app.donator_id)}
                                                className='cursor-pointer bg-[#B67101] rounded-full size-8 p-2 active:bg-[#DC8801]'
                                                title="Reject Donation"
                                            >
                                                <img src="/assets/icons/admin-icons/reject.png" alt="Reject" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan="5" className='text-center py-5 text-[#595959]'>
                                        No pending donation applications found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DonationApplication;
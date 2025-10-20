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
            const response = await axios.get('/api/donation_applications_pending'); 
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
            await axios.post('/api/donation_review', {
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
    const filteredApplications = applications.filter(app => 
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


    if (loading) return <div className='text-center w-full mt-10'>Loading...</div>;
    if (error) return <div className='text-center w-full mt-10 text-red-600'>{error}</div>;


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
                            <tr className='grid grid-cols-[10%_15%_45%_15%_15%] justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
                                <th>App. ID</th>
                                <th>Donator</th>
                                <th>Items/Description</th>
                                <th>Date/Status</th>
                                <th>Decision</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredApplications.length > 0 ? filteredApplications.map((app) => (
                                <tr key={app.application_id} className='grid grid-cols-[10%_15%_45%_15%_15%] justify-items-start place-items-start w-full bg-[#FFF] p-3 rounded-[10px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                                    <td className='text-sm font-semibold'>{app.application_id}</td>
                                    <td className='text-sm'>{app.donator_name}</td>
                                    <td>
                                        <div className='flex flex-col text-sm'>
                                            <p className='font-bold mb-1'>Items ({app.items.length}):</p>
                                            <ul className='list-disc list-inside ml-2 text-xs'>
                                                {app.items.map((item, index) => (
                                                    <li key={index} className='truncate'>
                                                        **{item.donation_type}**: 
                                                        {item.donation_type === 'Money' ? ` PHP${item.amount}` : item.quantity ? ` ${item.quantity}` : ' Item'}
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className='mt-2 italic truncate max-w-full' title={app.description}>
                                                Description: {app.description}
                                            </p>
                                            {/* Link to view proof image if available */}
                                            {app.items.find(item => item.proof_image) && (
                                                <a 
                                                    href={app.items.find(item => item.proof_image).proof_image} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-blue-500 underline text-xs mt-1"
                                                >
                                                    View Proof
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className='flex flex-col justify-center'>
                                        <p className='text-xs text-gray-500 mb-1'>{app.date_applied}</p>
                                        <span className={`px-3 py-1 rounded-[5px] font-bold text-center text-xs ${getStatusClass(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className='flex items-center gap-1'>
                                        {/* Accept Button */}
                                        <button 
                                            onClick={() => handleDecision(app.application_id, 'Accepted', app.donator_id)}
                                            className='cursor-pointer bg-[#889132] rounded-full size-8 p-2 active:bg-[#B5C04A]'
                                            title="Accept Donation"
                                        >
                                            <img src="/assets/icons/admin-icons/check.png" alt="Accept" />
                                        </button>
                                        {/* Reject Button */}
                                        <button 
                                            onClick={() => handleDecision(app.application_id, 'Rejected', app.donator_id)}
                                            className='cursor-pointer bg-[#e52c1a] rounded-full size-8 p-2 active:bg-[#d95a51]'
                                            title="Reject Donation"
                                        >
                                            <img src="/assets/icons/admin-icons/reject.png" alt="Reject" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
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
// import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom';
// import { useSession } from '../../context/SessionContext'
// import axios from 'axios';

// const FeedingReport = () => {
//     const { user } = useSession();
//     const [feedingDate, setFeedingDate] = useState('');

//     const [description, setDescription] = useState('');
//     const [submitMessage, setSubmitMessage] = useState('');
//     const [submitError, setSubmitError] = useState('');

    

//     useEffect(() => {
//         const fetchFeedingDate = async () => {
//             if (!user?.user_id) return; 

//             try {
//             const response = await axios.get(`http://localhost:5000/admin/feeding_date/${user?.user_id}`);
//             console.log('Feeding date: ', response.data);
//             setFeedingDate(response.data.feeding_date);
//             } catch (err) {
//             console.error('Failed to fetch feeding date:', err);
//             }
//         };

//         fetchFeedingDate();
//     }, []);

//     const handleFeedingReport = async (e) => {
//         e.preventDefault();

//         try {
//             await axios.post(`http://localhost:5000/user/feeding_report/${user?.user_id}`, {
//             report: description,
//             });

//             setSubmitMessage('Thank you for submitting a report!');
//         } catch (err) {
//             console.error('Failed to submit report:', err);
//             setSubmitError('Failed to submit report. Please try again.');
//         }
//     };

//     // feedingreport.js
//     const handleSubmitReport = async () => {
//         try {
//             await axios.post('http://localhost:5000/user/feeding_report', {
//             user_id: user.user_id,
//             report: reportText
//             });

//             alert("Report submitted successfully!");

//             // Optional: redirect back to Feeding page
//             navigate("/feeding", { state: { reportSubmitted: true } });
//         } catch (err) {
//             console.error("Failed to submit report:", err);
//         }
//     };




//     return (
//         <div className='fixed inset-0 bg-black/25 bg-opacity-50 flex justify-center items-center z-1000'>
//             <form onSubmit={handleFeedingReport}  className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col p-5 gap-4 min-w-[800px] h-auto bg-[#FFF] rounded-[20px] z-100'>
//                 <div className='flex w-full justify-between items-center'>
//                     <label className='text-[20px] text-[#2F2F2F] font-bold'>Report</label>
//                     <label className='text-[14px] text-[#A3A3A3]'>Feeding report for {feedingDate}</label>
//                 </div>


//                 {!submitMessage ? (
//                     <>
//                         <div className='flex flex-col w-full h-auto gap-2'>
//                             <label className='text-[#595959] text-[14px]'>Thank you for helping feed the cats in our community! We’d love to hear about your experience. Your efforts make a real difference!</label>
//                             <textarea rows={8} placeholder='Describe your experience here' 
//                             value={description} onChange={(e) => setDescription(e.target.value)}
//                             className='p-3 rounded-[15px] border-1 border-[#A3A3A3] resize-none' ></textarea>
//                         </div>

//                         <div className='flex w-full justify-end items-center gap-1'>
//                             <button className='cursor-pointer bg-[#99A339] p-2 pl-4 pr-4 rounded-[10px] text-[#FFF] hover:scale-102 active:scale-98 transition-all duration-100'>Submit</button>
//                             <Link to="/feeding" type='button' className='cursor-pointer bg-[#DC8801] p-2 pl-4 pr-4 rounded-[10px] text-[#FFF] hover:scale-102 active:scale-98 transition-all duration-100'>Cancel</Link>
//                         </div>
//                     </>
//                 ): (
//                     <div className='flex flex-col w-full h-auto gap-2'>
//                         <label className='flex w-full items-center justify-center'>{submitMessage || submitError}</label>
//                         <Link to="/feeding" className='w-fit self-end cursor-pointer bg-[#DC8801] p-2 pl-4 pr-4 rounded-[10px] text-[#FFF]'>Close</Link>
//                     </div>
//                 )}
//             </form>
//         </div>
//     )
// }

// export default FeedingReport


import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext'
import axios from 'axios';

const FeedingReport = () => {
    const url = `https://whiskerwatch-0j6g.onrender.com`;
    
    const { user } = useSession();
    const [feedingDate, setFeedingDate] = useState('');
    const [description, setDescription] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchFeedingDate = async () => {
        if (!user?.user_id) return;

        try {
            const response = await axios.get(`${url}/admin/feeders/feeding_date/${user.user_id}`);
            console.log('Feeding date:', response.data);
            setFeedingDate(response.data.feeding_date);
        } catch (err) {
            console.error('Failed to fetch feeding date:', err);
        }
        };

        fetchFeedingDate();
    }, [user]);

    const handleFeedingReport = async (e) => {
        e.preventDefault();

        try {
        await axios.post(`${url}/user/feeding_report/${user.user_id}`, {
            report: description,
        });

        navigate('/feeding', { state: { reportSubmitted: true } });

        } catch (err) {
        console.error('Failed to submit report:', err);
        setSubmitError('Failed to submit report. Please try again.');
        }
    };

    return (
        <div className='sticky xl:fixed lg:fixed md:fixed inset-0 bg-black/25 bg-opacity-50 flex justify-center w-screen h-screen items-center xl:z-1000 lg:z-1000 md:z-1000'>
        <form 
            onSubmit={handleFeedingReport}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col p-5 gap-4 h-screen w-screen  xl:w-[800px] xl:h-auto lg:w-[800px] lg:h-auto md:w-[800px] md:h-auto bg-[#FFF] xl:rounded-[20px] lg:rounded-[20px] md:rounded-[20px] z-100'
        >
            <div className='flex w-full justify-between items-center'>
            <label className='text-[20px] text-[#2F2F2F] font-bold'>Report</label>
            <label className='text-[14px] text-[#A3A3A3]'>
                Feeding report for {feedingDate}
            </label>
            </div>

            <div className='flex flex-col w-full h-auto gap-2'>
            <label className='text-[#595959] text-[14px]'>
                Thank you for helping feed the cats in our community! We’d love to hear about your experience. Your efforts make a real difference!
            </label>
            <textarea
                rows={8}
                placeholder='Describe your experience here'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='p-3 rounded-[15px] border-1 border-[#A3A3A3] resize-none'
                required
            ></textarea>
            </div>

            <div className='flex w-full justify-end items-center gap-1'>
            <button
                type='submit'
                className='cursor-pointer bg-[#99A339] p-2 pl-4 pr-4 rounded-[10px] text-[#FFF] hover:scale-102 active:scale-98 transition-all duration-100'
            >
                Submit
            </button>
            <Link
                to="/feeding"
                className='cursor-pointer bg-[#DC8801] p-2 pl-4 pr-4 rounded-[10px] text-[#FFF] hover:scale-102 active:scale-98 transition-all duration-100'
            >
                Cancel
            </Link>
            </div>

            {submitError && (
            <p className='text-red-600 text-sm text-right mt-2'>{submitError}</p>
            )}
        </form>
        </div>
    );    
};

export default FeedingReport;

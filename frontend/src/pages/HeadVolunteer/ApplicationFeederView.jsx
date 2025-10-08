import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'


const ApplicationFeederView = () => {

    const { application_id } = useParams();
    const [applicant, setApplicant] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');


    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/admin/form/${application_id}`);
                console.log(response.data)
                setApplicant(response.data);
            } catch(err) {
                console.error('Error fetching user:', err.response?.data || err.message);
            }
        }

        fetchApplications()
    },[]);


    return (
        <div className='absolute top-[52%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-[999] flex flex-col w-[1000px]'>
            {applicant && (
                <div className='flex flex-col p-5 bg-[#FFF] h-auto rounded-[10px] gap-2'> 
                <div className='flex w-full justify-between border-dashed border-b-2 border-b-[#977655] pb-2'>
                    <label htmlFor="">Application View</label>
                    <Link to="/applicationfeeding" className='w-fit bg-[#2F2F2F] text-[#FFF] p-1 pl-3 pr-3 rounded-[10px]'>
                    Close
                    </Link>
                </div>
                    <div className='flex items-center justify-between pb-3'>
                        <div className='flex justify-start items-center gap-10'>
                            <div className='flex flex-col justify-start leading-tight'>
                                <label className='text-[#595959] text-[14px]'>Application No.:</label>
                                <label className='text-[#2F2F2F] font-bold' >{applicant.application_id}</label>
                            </div>
                            <div className='flex flex-col justify-start leading-tight'>
                                <label className='text-[#595959] text-[14px]'>Name of Applicant:</label>
                                <label className='text-[#2F2F2F]  font-bold' >{`${applicant.firstname} ${applicant.lastname}`}</label>
                            </div>
                            <div className='flex flex-col justify-start leading-tight'>
                                <label className='text-[#595959] text-[14px]'>Date of Application:</label>
                                <label className='text-[#2F2F2F] font-bold' >{applicant.date_applied}</label>
                            </div>
                        </div>

                        {!statusMessage ? (
                            <div className='flex gap-2 items-center' >
                                <button onClick={() => handleUpdateStatus('Accepted')} className='bg-[#B5C04A] text-[#FFF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer active:bg-[#E3E697] active:text-[#2F2F2F]'>Accept</button>
                                <button onClick={() => handleUpdateStatus('Rejected')} className='bg-[#DC8801] text-[#FFF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer active:bg-[#977655]'>Reject</button>
                            </div>
                        ) : <label className={
                            applicant.status === 'Accepted' ? 'bg-[#FDF5D8] rounded-[10px] p-2 text-[#8D9634]' 
                            : 'bg-[#FDF5D8] rounded-[10px] p-2 text-[#DC8801]'
                        }> {statusMessage} </label>}
                    </div>

                    {applicant.application_form && (
                        <object
                            data={`http://localhost:5000/FileUploads/${applicant.application_form}`}
                            type="application/pdf"
                            width="100%"
                            height="500px" >
                            <p> Your browser does not support embedded PDFs.
                                <a href={`http://localhost:5000/FileUploads/${applicant.application_form}`} target="_blank" rel="noopener noreferrer">
                                    Click here to download the PDF.
                                </a>
                            </p>
                        </object>
                    )}

                </div>
            )}
        </div>
    )
}

export default ApplicationFeederView
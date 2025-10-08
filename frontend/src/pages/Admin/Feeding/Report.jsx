import React, { useEffect, useState } from 'react'
import AdminSideBar from '../../../components/AdminSideBar';
import HeadVolunteerSideBer from '../../../components/HeadVolunteerSideBar'

import { useSession } from '../../../context/SessionContext'
import axios from 'axios';

const Report = () => {
    const { user } = useSession();
    const [searchInput, setSearchInput] = useState('');

    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/feeding_reports`);
                console.log(response.data)
                setReports(response.data)
            } catch (err) {

            }
        }

        fetchReport();
    }, []);

    return (
        <div className='relative flex flex-col h-screen overflow-x-hidden'>
            <div className='flex flex-row w-full overflow-y-hidden'>
                <AdminSideBar className='max-w-[400px]'/>

                <div className='flex flex-col items-start xl:p-10 lg:p-10 min-h-screen gap-5 mx-auto w-full overflow-y-scroll'>
                    <div className='xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-full gap-3 rounded-[15px]'>
                        <label className='text-2xl text-[#2F2F2F] text-center'>Unable to access this page</label>
                        <label className='text-[#8f8f8f] text-center'>You can access the page on larger screen size such as desktop/laptop screens</label>
                    </div>

                    <div className='hidden xl:flex lg:flex w-full items-start justify-start border-b-2 border-b-[#2F2F2F]'>
                        <label className='text-[#2F2F2F] text-[24px] font-bold'>Feeding Report</label>
                    </div>

                    <input type="search" name="" id="" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className='hidden xl:flex lg:flex bg-[#FFF] p-2 min-w-[400px] border-1 border-[#595959] rounded-[15px]'/>

                    <table className='hidden xl:flex lg:flex flex-col w-full gap-2'>
                        <thead className='flex w-full'>
                            <tr className='grid grid-cols-[15%_20%_45%_20%] justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
                                <th>Report No.</th>
                                <th>Name</th>
                                <th>Report</th>
                                <th>Date submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.report_id} className='grid grid-cols-[15%_20%_45%_20%] justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                                    <td>{report.report_id}</td>
                                    <td>{`${report.firstname} ${report.lastname}`}</td>
                                    <td>{report.report}</td>
                                    <td>{report.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Report
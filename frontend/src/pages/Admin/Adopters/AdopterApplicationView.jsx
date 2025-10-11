// import React, { useState, useEffect } from 'react';
// import AdminSideBar from '../../../components/AdminSideBar';
// import { useSession } from '../../../context/SessionContext';
// import { Link, useParams } from 'react-router-dom';
// import axios from 'axios';

// import { Viewer, Worker } from '@react-pdf-viewer/core';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// import { PdfJs } from '@react-pdf-viewer/core';
// PdfJs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.min.js';

// const AdopterApplicationView = () => {
//     const url = `https://whiskerwatch-0j6g.onrender.com`;
//     const { user, logout, loading: sessionLoading } = useSession();
//     const { application_id } = useParams();

//     const [applicant, setApplicant] = useState({});
//     const [statusMessage, setStatusMessage] = useState('');
//     const [pdfError, setPdfError] = useState('');

//     const defaultLayoutPluginInstance = defaultLayoutPlugin();

//     useEffect(() => {
//         const fetchApplications = async () => {
//             try {
//                 const response = await axios.get(`${url}/admin/adoption_form/${application_id}`, {
//                     withCredentials: true,
//                 });
//                 setApplicant(response.data || {});
//             } catch (err) {
//                 console.error('Error fetching user:', err.response?.data || err.message);
//                 setStatusMessage('Failed to load application details.');
//             }
//         };
//         fetchApplications();
//     }, [application_id]);

//     const handleUpdateStatus = async (status) => {
//         try {
//             const response = await axios.patch(
//                 `${url}/admin/adoption_form/status_update/${application_id}`, // Use useParams
//                 { status },
//                 { withCredentials: true }
//             );
//             setApplicant((prev) => ({ ...prev, status }));
//             setStatusMessage(
//                 status === 'Accepted'
//                     ? `${(applicant.firstname || '')} ${(applicant.lastname || '')}'s application is accepted. Update successful!`
//                     : `${(applicant.firstname || '')} ${(applicant.lastname || '')}'s application is rejected. Update successful!`
//             );
//         } catch (err) {
//             console.error('Update failed:', err.response?.data || err.message);
//             setStatusMessage('Failed to update status. Please try again.');
//         }
//     };

//     const getPdfUrl = (url) => {
//         if (!url) return '';
//         if (url.includes('/raw/upload/')) {
//             return url.replace('/raw/upload/', '/raw/upload/fl_attachment:false/'); // Inline display
//         }
//         return url;
//     };

//     if (sessionLoading) return <div>Loading...</div>;
//     if (!user) return <div>Please log in to view this page.</div>;

//     return (
//         <div className="relative flex flex-col h-screen overflow-x-hidden">
//             <div className="flex flex-row w-full overflow-x-hidden">
//                 <AdminSideBar className="max-w-[400px]" />
//                 <div className="flex flex-col p-10 min-h-screen w-full gap-4 mx-auto overflow-hidden">
//                     <div className="xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-full gap-3 rounded-[15px]">
//                         <label className="text-2xl text-[#2F2F2F] text-center">Unable to access this page</label>
//                         <label className="text-[#8f8f8f] text-center">
//                             You can access the page on larger screen size such as desktop/laptop screens
//                         </label>
//                     </div>

//                     <div className="hidden xl:flex lg:flex w-full justify-between pb-2 border-b-1 border-b-[#2F2F2F]">
//                         <label className="text-[24px] font-bold text-[#2F2F2F]">Adoption Application Form</label>
//                         <Link to="/adopterapplications" className="flex items-center bg-[#2F2F2F] p-1 pl-6 pr-6 text-[#FFF] font-bold rounded-[15px]">
//                             Go Back
//                         </Link>
//                     </div>

//                     <div className="hidden xl:flex lg:flex flex-col p-5 bg-[#FFF] h-auto w-full rounded-[10px] gap-2">
//                         <div className="flex items-center justify-between border-b-1 border-b-[#595959] shadow-md pb-3">
//                             {applicant && (
//                                 <div className="flex justify-start items-center gap-10">
//                                     <div className="flex flex-col justify-start">
//                                         <label className="text-[#595959] text-[14px]">Application No.:</label>
//                                         <label className="text-[#2F2F2F] text-[18px] font-bold">{applicant.application_id || 'N/A'}</label>
//                                     </div>
//                                     <div className="flex flex-col justify-start">
//                                         <label className="text-[#595959] text-[14px]">Name of Applicant:</label>
//                                         <label className="text-[#2F2F2F] text-[18px] font-bold">{`${applicant.firstname || ''} ${applicant.lastname || ''}` || 'N/A'}</label>
//                                     </div>
//                                     <div className="flex flex-col justify-start">
//                                         <label className="text-[#595959] text-[14px]">Date of Application:</label>
//                                         <label className="text-[#2F2F2F] text-[18px] font-bold">{applicant.application_date || 'N/A'}</label>
//                                     </div>
//                                 </div>
//                             )}

//                             {!statusMessage ? (
//                                 <div className="hidden xl:flex lg:flex gap-2 items-center">
//                                     <button
//                                         onClick={() => handleUpdateStatus('Accepted')}
//                                         className="bg-[#B5C04A] text-[#FFF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer active:bg-[#E3E697] active:text-[#2F2F2F]"
//                                     >
//                                         Accept
//                                     </button>
//                                     <button
//                                         onClick={() => handleUpdateStatus('Rejected')}
//                                         className="bg-[#DC8801] text-[#FFF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer active:bg-[#977655]"
//                                     >
//                                         Reject
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <label
//                                     className={
//                                         applicant.status === 'Accepted'
//                                             ? 'bg-[#FDF5D8] rounded-[10px] p-2 text-[#8D9634]'
//                                             : 'bg-[#FDF5D8] rounded-[10px] p-2 text-[#DC8801]'
//                                     }
//                                 >
//                                     {statusMessage}
//                                 </label>
//                             )}
//                         </div>

//                         {/* {applicant.application_form && (
//                             <div className='flex flex-col items-start'>
//                                 <iframe
//                                     src={applicant.application_form}
//                                     title="Adoption Application PDF"
//                                     width="100%"
//                                     height="600px"
//                                     style={{ border: 'none' }}
//                                     onError={() => setPdfError('Failed to load PDF. Please try downloading it.')}
//                                 />
//                                 {pdfError && <p className="text-red-500">{pdfError}</p>}
//                                 <a
//                                     href={applicant.application_form}
//                                     download
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-[#889132] underline mt-2 inline-block"
//                                 >
//                                     Download the PDF
//                                 </a>
//                             </div>
//                         )} */}

//                         {applicant.application_form ? (
//                             <div style={{ height: '600px' }}>
//                                 <Worker workerUrl={PdfJs.GlobalWorkerOptions.workerSrc}>
//                                     <Viewer
//                                         fileUrl={getPdfUrl(applicant.application_form)}
//                                         plugins={[defaultLayoutPluginInstance]}
//                                         onError={(error) => {
//                                             console.error('PDF Viewer Error:', error);
//                                             setPdfError('Failed to load PDF. Please try downloading it.');
//                                         }}
//                                     />
//                                 </Worker>
//                                 {pdfError && <p className="text-red-500">{pdfError}</p>}
//                                 <a
//                                     href={getPdfUrl(applicant.application_form).replace('/fl_attachment:false/', '/fl_attachment/')}
//                                     download
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-[#889132] underline mt-2 inline-block"
//                                 >
//                                     Download the PDF
//                                 </a>
//                             </div>
//                         ) : (
//                             <p className="text-red-500">No application form available.</p>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdopterApplicationView;


import React, { useState, useEffect } from 'react';
import AdminSideBar from '../../../components/AdminSideBar';
import { useSession } from '../../../context/SessionContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';

// Set the worker source to match the installed pdfjs-dist version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const AdopterApplicationView = () => {
    const url = `https://whiskerwatch-0j6g.onrender.com`;
    const { user, logout, loading: sessionLoading } = useSession();
    const { application_id } = useParams();

    const [applicant, setApplicant] = useState({});
    const [statusMessage, setStatusMessage] = useState('');
    const [pdfError, setPdfError] = useState('');
    const [numPages, setNumPages] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`${url}/admin/adoption_form/${application_id}`, {
                    withCredentials: true,
                });
                setApplicant(response.data || {});
            } catch (err) {
                console.error('Error fetching user:', err.response?.data || err.message);
                setStatusMessage('Failed to load application details.');
            }
        };
        fetchApplications();
    }, [application_id]);

    const handleUpdateStatus = async (status) => {
        try {
            const response = await axios.patch(
                `${url}/admin/adoption_form/status_update/${application_id}`,
                { status },
                { withCredentials: true }
            );
            setApplicant((prev) => ({ ...prev, status }));
            setStatusMessage(
                status === 'Accepted'
                    ? `${(applicant.firstname || '')} ${(applicant.lastname || '')}'s application is accepted. Update successful!`
                    : `${(applicant.firstname || '')} ${(applicant.lastname || '')}'s application is rejected. Update successful!`
            );
        } catch (err) {
            console.error('Update failed:', err.response?.data || err.message);
            setStatusMessage('Failed to update status. Please try again.');
        }
    };

    const getPdfUrl = (url) => {
        if (!url) return '';
        if (url.includes('/raw/upload/')) {
            return url.replace('/raw/upload/', '/raw/upload/fl_attachment:false/'); // Inline display
        }
        return url;
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPdfError(''); // Clear error on successful load
    };

    const onDocumentLoadError = (error) => {
        console.error('PDF Load Error:', error);
        setPdfError('Failed to load PDF. Please try downloading it.');
    };

    if (sessionLoading) return <div>Loading...</div>;
    if (!user) return <div>Please log in to view this page.</div>;

    return (
        <div className="relative flex flex-col h-screen overflow-x-hidden">
            <div className="flex flex-row w-full overflow-x-hidden">
                <AdminSideBar className="max-w-[400px]" />
                <div className="flex flex-col p-10 min-h-screen w-full gap-4 mx-auto overflow-hidden">
                    <div className="xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-full gap-3 rounded-[15px]">
                        <label className="text-2xl text-[#2F2F2F] text-center">Unable to access this page</label>
                        <label className="text-[#8f8f8f] text-center">
                            You can access the page on larger screen size such as desktop/laptop screens
                        </label>
                    </div>

                    <div className="hidden xl:flex lg:flex w-full justify-between pb-2 border-b-1 border-b-[#2F2F2F]">
                        <label className="text-[24px] font-bold text-[#2F2F2F]">Adoption Application Form</label>
                        <Link to="/adopterapplications" className="flex items-center bg-[#2F2F2F] p-1 pl-6 pr-6 text-[#FFF] font-bold rounded-[15px]">
                            Go Back
                        </Link>
                    </div>

                    <div className="hidden xl:flex lg:flex flex-col p-5 bg-[#FFF] h-auto w-full rounded-[10px] gap-2">
                        <div className="flex items-center justify-between border-b-1 border-b-[#595959] shadow-md pb-3">
                            {applicant && (
                                <div className="flex justify-start items-center gap-10">
                                    <div className="flex flex-col justify-start">
                                        <label className="text-[#595959] text-[14px]">Application No.:</label>
                                        <label className="text-[#2F2F2F] text-[18px] font-bold">{applicant.application_id || 'N/A'}</label>
                                    </div>
                                    <div className="flex flex-col justify-start">
                                        <label className="text-[#595959] text-[14px]">Name of Applicant:</label>
                                        <label className="text-[#2F2F2F] text-[18px] font-bold">{`${applicant.firstname || ''} ${applicant.lastname || ''}` || 'N/A'}</label>
                                    </div>
                                    <div className="flex flex-col justify-start">
                                        <label className="text-[#595959] text-[14px]">Date of Application:</label>
                                        <label className="text-[#2F2F2F] text-[18px] font-bold">{applicant.application_date || 'N/A'}</label>
                                    </div>
                                </div>
                            )}

                            {!statusMessage ? (
                                <div className="hidden xl:flex lg:flex gap-2 items-center">
                                    <button
                                        onClick={() => handleUpdateStatus('Accepted')}
                                        className="bg-[#B5C04A] text-[#FFF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer active:bg-[#E3E697] active:text-[#2F2F2F]"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus('Rejected')}
                                        className="bg-[#DC8801] text-[#FFF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer active:bg-[#977655]"
                                    >
                                        Reject
                                    </button>
                                </div>
                            ) : (
                                <label
                                    className={
                                        applicant.status === 'Accepted'
                                            ? 'bg-[#FDF5D8] rounded-[10px] p-2 text-[#8D9634]'
                                            : 'bg-[#FDF5D8] rounded-[10px] p-2 text-[#DC8801]'
                                    }
                                >
                                    {statusMessage}
                                </label>
                            )}
                        </div>

                        {applicant.application_form ? (
                            <div style={{ height: '600px' }}>
                                <Document
                                    file={getPdfUrl(applicant.application_form)}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={onDocumentLoadError}
                                    loading={<p>Loading PDF...</p>}
                                >
                                    {Array.from({ length: numPages }, (_, index) => (
                                        <Page key={index + 1} pageNumber={index + 1} width={window.innerWidth * 0.8} />
                                    ))}
                                </Document>
                                {pdfError && <p className="text-red-500">{pdfError}</p>}
                                <a
                                    href={getPdfUrl(applicant.application_form).replace('/fl_attachment:false/', '/fl_attachment/')}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#889132] underline mt-2 inline-block"
                                >
                                    Download the PDF
                                </a>
                            </div>
                        ) : (
                            <p className="text-red-500">No application form available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdopterApplicationView;
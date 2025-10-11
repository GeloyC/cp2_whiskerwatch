// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import NavigationBar from '../../components/NavigationBar';
// import Footer from '../../components/Footer';
// import SideNavigation from '../../components/SideNavigation';
// import CatBot from '../../components/CatBot';
// import axios from 'axios';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import { useSession } from '../../context/SessionContext';

// const AdopteeForm = () => {
//     const url = `https://whiskerwatch-0j6g.onrender.com`;
//     const { cat_id } = useParams();
//     const { user } = useSession();

//     const [imageSrc, setImageSrc] = useState('/assets/icons/id-card.png');
//     const [foundOut, setFoundOut] = useState('');
//     const [catRaised, setCatRaised] = useState('');
//     const [havePets, setHavePets] = useState('');
//     const [livingSituation, setLivingSituation] = useState('');
//     const [income, setIncome] = useState('');
//     const [pickup, setPickup] = useState('');
//     const [moreInfo, setMoreInfo] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [submitMessage, setSubmitMessage] = useState('');
//     const [catprofile, setCatprofile] = useState([]);

//     const printRef = useRef(null);

//     useEffect(() => {
//         if (!cat_id) return;

//         const fetchProfile = async () => {
//         try {
//             const response = await axios.get(`${url}/cat/catprofile/${cat_id}`);
//             setCatprofile(response.data);
//         } catch (err) {
//             console.error('Error fetching cat:', err);
//         }
//         };
//         fetchProfile();
//     }, [cat_id]);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//         if (file.size > 10 * 1024 * 1024) {
//             alert('File size exceeds 10MB limit. Please upload an image of 10MB or smaller.');
//             return;
//         }
//         const reader = new FileReader();
//         reader.onload = () => {
//             setImageSrc(reader.result);
//         };
//         reader.readAsDataURL(file);
//         }
//     };

//     const generateAdoptionForm = async () => {
//         if (!foundOut || !imageSrc || !catRaised || !havePets.trim() || !livingSituation || !income || !pickup) {
//         setError('*Please complete all questions before submitting the form.');
//         return;
//         }

//         const element = printRef.current;
//         if (!element) return;

//         setLoading(true);
//         const canvas = await html2canvas(element);
//         const imgData = canvas.toDataURL('image/png');
//         const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'px',
//         format: 'a4',
//         });

//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const imgProps = pdf.getImageProperties(imgData);
//         const pdfWidth = pageWidth;
//         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//         pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

//         const pdfBlob = pdf.output('blob');
//         const formData = new FormData();
//         const filename = `Adoption_form_${user.firstname}_${user.lastname}.pdf`;

//         formData.append('file', pdfBlob, filename);
//         formData.append('user_id', user.user_id);
//         formData.append('cat_id', catprofile.cat_id);

//         try {
//         await axios.post(`${url}/user/adoption/form`, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         setSubmitMessage('Application submitted successfully!');
//         } catch (err) {
//         if (err.response && err.response.data && err.response.data.message) {
//             setError(err.response.data.message);
//         } else {
//             setError('Something went wrong. Please try again.');
//         }
//         } finally {
//         setLoading(false);
//         }
//     };

//     const isFormStarted = Boolean(
//         foundOut ||
//         catRaised ||
//         havePets.trim() ||
//         livingSituation ||
//         income ||
//         pickup ||
//         moreInfo.trim() ||
//         imageSrc !== '/assets/icons/id-card.png'
//     );

//     return (
//         <div className="flex flex-col min-h-screen">
//         <CatBot />
//         <NavigationBar />
//         <main className="flex-grow flex flex-col items-center py-0 xl:py-10 lg:py-10 w-full">
//             <div className="flex flex-col w-full max-w-[1200px] gap-5 px-4 sm:px-6 xl:px-0">
//             <div className="flex flex-col w-full xl:grid xl:grid-cols-[20%_80%] gap-2">
//                 <div className="hidden xl:flex xl:flex-col lg:flex lg:flex-row md:flex md:hidden w-full xl:gap-10 lg:gap-2 md:gap-2">
//                 <div className="flex flex-row justify-between items-center p-3 bg-[#FFF] rounded-[15px] w-full">
//                     <label className="font-bold text-[#DC8801]">Adoptee Form</label>
//                     <div className="flex items-center justify-center w-[30px] h-auto">
//                     <img src="/assets/icons/clipboard-white.png" alt="Clipboard icon" className="w-full h-auto" />
//                     </div>
//                 </div>
//                 <div className="flex flex-row justify-between items-center w-full p-3 border-dashed border-2 border-[#DC8801] rounded-[15px]">
//                     <label className="text-[#DC8801]">
//                     Please answer the following questions to submit an adoption request to be reviewed by our Head Volunteers!
//                     </label>
//                 </div>
//                 </div>

//                 <div className="xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-full gap-3 bg-[#FFF] rounded-[15px]">
//                 <label className="text-2xl text-[#2F2F2F] text-center">Unable to access the adoption form</label>
//                 <label className="text-[#8f8f8f] text-center">
//                     You can access the form on larger screen sizes such as desktop/laptop screens
//                 </label>
//                 </div>

//                 {!submitMessage ? (
//                 <form ref={printRef} className="hidden xl:flex xl:flex-col lg:flex lg:flex-col items-start w-full p-5 gap-5 bg-[#FFF] rounded-[15px]">
//                     <div className="flex flex-row gap-2 w-full justify-between">
//                     {catprofile && (
//                         <div className="flex gap-2">
//                         <label>1. You will be adopting:</label>
//                         <label className="font-bold pl-4">{catprofile.name}</label>
//                         <label className="italic">{catprofile.age} Years old, </label>
//                         <label className="italic">{catprofile.gender}, </label>
//                         <label className="italic">{catprofile.sterilization_status} </label>
//                         </div>
//                     )}
//                     </div>

//                     <div className="flex flex-col gap-2 w-full">
//                     <span>2. Please let us know how you found out about the adoption opportunity:</span>
//                     <div className="grid grid-cols-3 w-full gap-2">
//                         <label htmlFor="radioFBPage" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             id="radioFBPage"
//                             name="adaptionOpportunity"
//                             value="SPR Cats Facebook Page"
//                             onChange={(e) => setFoundOut(e.target.value)}
//                         />
//                         SPR Cats Facebook Page
//                         </label>
//                         <label htmlFor="radioFBGroup" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             id="radioFBGroup"
//                             name="adaptionOpportunity"
//                             value="Facebook Group"
//                             onChange={(e) => setFoundOut(e.target.value)}
//                         />
//                         Facebook Group
//                         </label>
//                         <label htmlFor="radioCommunityPage" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             id="radioCommunityPage"
//                             name="adaptionOpportunity"
//                             value="SPR Community Page"
//                             onChange={(e) => setFoundOut(e.target.value)}
//                         />
//                         SPR Community Page
//                         </label>
//                         <label htmlFor="referral" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             id="referral"
//                             name="adaptionOpportunity"
//                             value="Referred by a Volunteer"
//                             onChange={(e) => setFoundOut(e.target.value)}
//                         />
//                         Referred by a Volunteer
//                         </label>
//                         <label htmlFor="other" className="flex gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             name="adaptionOpportunity"
//                             id="other"
//                             className="bg-[#e6e6e6] rounded-[5px]"
//                             onChange={(e) => setFoundOut(e.target.value)}
//                         />
//                         Others
//                         </label>
//                     </div>
//                     </div>

//                     <div className="flex flex-col gap-2">
//                     <div className="flex flex-col">
//                         <span>3. Kindly attach an ID to verify your identity - we do our best to make sure our cats are adopted by verified people so that they are assured a safe home. Thank you for understanding.</span>
//                         <span className="italic text-[14px] text-[#828282]">(You may opt to blur sensitive data like Social Security info and etc.)</span>
//                     </div>
//                     <div className="flex flex-row items-center gap-2">
//                         <div className="flex items-center justify-center w-[400px] min-h-[200px] border-dashed border-2 border-[#898989] p-2 rounded-[15px]">
//                         <img src={imageSrc} alt="ID card" className="w-full h-full object-contain" />
//                         </div>
//                         <div className="flex flex-col w-auto">
//                         <label
//                             htmlFor="idUpload"
//                             className="bg-[#DC8801] p-2 rounded-[10px] text-[#FFF] hover:bg-[#B67101] active:scale-97"
//                         >
//                             Attach ID Photo
//                             <input type="file" accept="image/*" id="idUpload" hidden onChange={handleImageChange} required />
//                         </label>
//                         <span className="italic text-[#828282] text-[14px]">(Upload 1 supported file. Max. 10MB)</span>
//                         </div>
//                     </div>
//                     </div>

//                     <div className="flex flex-col gap-2">
//                     <span>4. Have you raised a cat before?</span>
//                     <div className="flex gap-2">
//                         <label htmlFor="raisedYes" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             name="raisedCat"
//                             id="raisedYes"
//                             value="Yes, I know how to take care of a pet cat."
//                             onChange={(e) => setCatRaised(e.target.value)}
//                         />
//                         Yes, I know how to take care of a pet cat.
//                         </label>
//                         <label htmlFor="raisedNo" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             name="raisedCat"
//                             id="raisedNo"
//                             value="No, this is my first time."
//                             onChange={(e) => setCatRaised(e.target.value)}
//                         />
//                         No, this is my first time.
//                         </label>
//                     </div>
//                     </div>

//                     <div className="flex flex-col gap-3">
//                     <div className="flex flex-col">
//                         <span>5. Do you have other pets right now? Kindly provide information:</span>
//                         <span className="italic text-[14px] text-[#7d7d7d]">(E.g., "Yes, I have two dogs.")</span>
//                     </div>
//                     <input
//                         type="text"
//                         placeholder="Your answer here"
//                         className="flex items-center p-2 border border-[#A3A3A3] rounded-[8px]"
//                         onChange={(e) => setHavePets(e.target.value)}
//                     />
//                     </div>

//                     <div className="flex flex-col gap-2 w-full">
//                     <span>6. What is your current living situation?</span>
//                     <div className="flex flex-wrap gap-2 w-full">
//                         <label htmlFor="alone" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             name="currentSituation"
//                             id="alone"
//                             value="I live alone"
//                             onChange={(e) => setLivingSituation(e.target.value)}
//                         />
//                         I live alone
//                         </label>
//                         <label htmlFor="family" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             name="currentSituation"
//                             id="family"
//                             value="I live with my family (no children)."
//                             onChange={(e) => setLivingSituation(e.target.value)}
//                         />
//                         I live with my family (no children).
//                         </label>
//                         <label htmlFor="nochildren" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             name="currentSituation"
//                             id="nochildren"
//                             value="I live with my family (with one or more children)."
//                             onChange={(e) => setLivingSituation(e.target.value)}
//                         />
//                         I live with my family (with one or more children).
//                         </label>
//                     </div>
//                     </div>

//                     <div className="flex flex-col gap-2">
//                     <div className="flex flex-col">
//                         <span>7. Do you have a regular income?</span>
//                         <span className="italic text-[14px] leading-tight text-[#898989]">
//                         (Raising indoor cats involves costs for essentials like food, litter, vitamins, vaccinations, and other necessities. SPR cats are trained to be indoor-only pets (owners are advised to keep them indoors for safety) and are litter box-trained before being made available for adoption.)
//                         </span>
//                     </div>
//                     <div className="flex flex-row gap-2">
//                         <label htmlFor="answerYes" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             name="yesNo"
//                             id="answerYes"
//                             value="Yes"
//                             onChange={(e) => setIncome(e.target.value)}
//                         />
//                         Yes
//                         </label>
//                         <label htmlFor="answerNo" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             name="yesNo"
//                             id="answerNo"
//                             value="No"
//                             onChange={(e) => setIncome(e.target.value)}
//                         />
//                         No
//                         </label>
//                     </div>
//                     </div>

//                     <div className="flex flex-col gap-2 w-full">
//                     <span>8. Are you available to pick up the cat from Siena Park Residences in Bicutan, or would you prefer to meet halfway?</span>
//                     <div className="flex flex-wrap gap-2 w-full">
//                         <label htmlFor="yesPickUp" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             name="pickup"
//                             id="yesPickUp"
//                             value="Yes, I'm able to do a pick-up."
//                             onChange={(e) => setPickup(e.target.value)}
//                         />
//                         Yes, I'm able to do a pick-up.
//                         </label>
//                         <label htmlFor="YesMeeting" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
//                         <input
//                             type="radio"
//                             name="pickup"
//                             id="YesMeeting"
//                             value="Yes, we can arrange a halfway meeting."
//                             onChange={(e) => setPickup(e.target.value)}
//                         />
//                         Yes, we can arrange a halfway meeting.
//                         </label>
//                     </div>
//                     </div>

//                     <div className="flex flex-col gap-2">
//                     <span>9. Please share any additional information in order for us to know you better, we'd love to know more about you.</span>
//                     <textarea
//                         rows="5"
//                         placeholder="Your answer here"
//                         value={moreInfo}
//                         onChange={(e) => setMoreInfo(e.target.value)}
//                         className="p-2 border border-[#A3A3A3] rounded-[8px] resize-none"
//                     />
//                     </div>
//                     {error && <label className="font-[14px] italic text-[#DC8801]">{error}</label>}
//                 </form>
//                 ) : (
//                 <div className="flex items-center justify-center p-5 bg-[#FFF] rounded-[15px] w-full h-full">
//                     {error ? (
//                     <label className="font-[14px] italic text-[#DC8801]">{error}</label>
//                     ) : (
//                     <label className="text-[#DC8801] text-center">{submitMessage}</label>
//                     )}
//                 </div>
//                 )}
//             </div>

//             {isFormStarted && (
//                 <button
//                 type="button"
//                 onClick={generateAdoptionForm}
//                 disabled={loading}
//                 className={`self-end cursor-pointer w-full xl:w-fit lg:w-fit md:w-fit text-center font-bold p-2 pl-5 pr-5 rounded-[10px] ${
//                     loading ? 'bg-gray-400' : 'bg-[#B5C04A] hover:bg-[#CFDA34] active:bg-[#B5C04A]'
//                 } text-white`}
//                 >
//                 {loading ? 'Submitting...' : 'Submit'}
//                 </button>
//             )}
//             </div>
//         </main>
//         <Footer />
//         </div>
//     );
// };

// export default AdopteeForm;




import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import SideNavigation from '../../components/SideNavigation';
import CatBot from '../../components/CatBot';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { useSession } from '../../context/SessionContext';

const AdopteeForm = () => {
    const url = `https://whiskerwatch-0j6g.onrender.com`;
    const { cat_id } = useParams();
    const { user } = useSession();

    const [imageSrc, setImageSrc] = useState('/assets/icons/id-card.png');
    const [foundOut, setFoundOut] = useState('');
    const [catRaised, setCatRaised] = useState('');
    const [havePets, setHavePets] = useState('');
    const [livingSituation, setLivingSituation] = useState('');
    const [income, setIncome] = useState('');
    const [pickup, setPickup] = useState('');
    const [moreInfo, setMoreInfo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [catprofile, setCatprofile] = useState({});

    const printRef = useRef(null);

    useEffect(() => {
        if (!cat_id) return;

        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${url}/cat/catprofile/${cat_id}`);
                setCatprofile(response.data || {});
            } catch (err) {
                console.error('Error fetching cat:', err);
                setError('Failed to load cat profile.');
            }
        };
        fetchProfile();
    }, [cat_id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('File size exceeds 10MB limit. Please upload an image of 10MB or smaller.');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setError(''); // Clear error on successful upload
            };
            reader.onerror = () => setError('Error reading the uploaded file.');
            reader.readAsDataURL(file);
        }
    };

    const generateAdoptionForm = async () => {
        if (!foundOut || !imageSrc || !catRaised || !havePets.trim() || !livingSituation || !income || !pickup) {
            setError('*Please complete all questions before submitting the form.');
            return;
        }

        const element = printRef.current;
        if (!element) {
            setError('Form content not found for conversion.');
            return;
        }

        setLoading(true);
        setError(''); // Clear previous errors

        try {
            // Capture the form as an image
            const canvas = await html2canvas(element, {
                scale: 2, // Increase resolution for better quality
                useCORS: true, // Handle cross-origin images if needed
                logging: true, // Enable logging for debugging
            });
            const imgData = canvas.toDataURL('image/png'); // Generate PNG image
            const byteString = atob(imgData.split(',')[1]);
            const mimeString = imgData.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });

            const filename = `Adoption_form_${user.firstname || 'User'}_${user.lastname || 'Unknown'}.png`;

            const formData = new FormData();
            formData.append('file', blob, filename);
            formData.append('user_id', user.user_id);
            formData.append('cat_id', catprofile.cat_id);

            // Upload to backend
            const response = await axios.post(`${url}/user/adoption/form`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setSubmitMessage('Application submitted successfully!');
        } catch (err) {
            console.error('Error generating or uploading form:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const isFormStarted = Boolean(
        foundOut ||
        catRaised ||
        havePets.trim() ||
        livingSituation ||
        income ||
        pickup ||
        moreInfo.trim() ||
        imageSrc !== '/assets/icons/id-card.png'
    );

    return (
        <div className="flex flex-col min-h-screen">
            <CatBot />
            <NavigationBar />
            <main className="flex-grow flex flex-col items-center py-0 xl:py-10 lg:py-10 w-full">
                <div className="flex flex-col w-full max-w-[1200px] gap-5 px-4 sm:px-6 xl:px-0">
                    <div className="flex flex-col w-full xl:grid xl:grid-cols-[20%_80%] gap-2">
                        <div className="hidden xl:flex xl:flex-col lg:flex lg:flex-row md:flex md:hidden w-full xl:gap-10 lg:gap-2 md:gap-2">
                            <div className="flex flex-row justify-between items-center p-3 bg-[#FFF] rounded-[15px] w-full">
                                <label className="font-bold text-[#DC8801]">Adoptee Form</label>
                                <div className="flex items-center justify-center w-[30px] h-auto">
                                    <img src="/assets/icons/clipboard-white.png" alt="Clipboard icon" className="w-full h-auto" />
                                </div>
                            </div>
                            <div className="flex flex-row justify-between items-center w-full p-3 border-dashed border-2 border-[#DC8801] rounded-[15px]">
                                <label className="text-[#DC8801]">
                                    Please answer the following questions to submit an adoption request to be reviewed by our Head Volunteers!
                                </label>
                            </div>
                        </div>

                        <div className="xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-full gap-3 bg-[#FFF] rounded-[15px]">
                            <label className="text-2xl text-[#2F2F2F] text-center">Unable to access the adoption form</label>
                            <label className="text-[#8f8f8f] text-center">
                                You can access the form on larger screen sizes such as desktop/laptop screens
                            </label>
                        </div>

                        {!submitMessage ? (
                            <form ref={printRef} className="hidden xl:flex xl:flex-col lg:flex lg:flex-col items-start w-full p-5 gap-5 bg-[#FFF] rounded-[15px]">
                                <div className="flex flex-row gap-2 w-full justify-between">
                                    {catprofile && (
                                        <div className="flex gap-2">
                                            <label>1. You will be adopting:</label>
                                            <label className="font-bold pl-4">{catprofile.name || 'N/A'}</label>
                                            <label className="italic">{catprofile.age || 'N/A'} Years old, </label>
                                            <label className="italic">{catprofile.gender || 'N/A'}, </label>
                                            <label className="italic">{catprofile.sterilization_status || 'N/A'}</label>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 w-full">
                                    <span>2. Please let us know how you found out about the adoption opportunity:</span>
                                    <div className="grid grid-cols-3 w-full gap-2">
                                        <label htmlFor="radioFBPage" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                id="radioFBPage"
                                                name="adaptionOpportunity"
                                                value="SPR Cats Facebook Page"
                                                onChange={(e) => setFoundOut(e.target.value)}
                                            />
                                            SPR Cats Facebook Page
                                        </label>
                                        <label htmlFor="radioFBGroup" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                id="radioFBGroup"
                                                name="adaptionOpportunity"
                                                value="Facebook Group"
                                                onChange={(e) => setFoundOut(e.target.value)}
                                            />
                                            Facebook Group
                                        </label>
                                        <label htmlFor="radioCommunityPage" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                id="radioCommunityPage"
                                                name="adaptionOpportunity"
                                                value="SPR Community Page"
                                                onChange={(e) => setFoundOut(e.target.value)}
                                            />
                                            SPR Community Page
                                        </label>
                                        <label htmlFor="referral" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                id="referral"
                                                name="adaptionOpportunity"
                                                value="Referred by a Volunteer"
                                                onChange={(e) => setFoundOut(e.target.value)}
                                            />
                                            Referred by a Volunteer
                                        </label>
                                        <label htmlFor="other" className="flex gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                name="adaptionOpportunity"
                                                id="other"
                                                onChange={(e) => setFoundOut(e.target.value)}
                                            />
                                            Others
                                        </label>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col">
                                        <span>3. Kindly attach an ID to verify your identity - we do our best to make sure our cats are adopted by verified people so that they are assured a safe home. Thank you for understanding.</span>
                                        <span className="italic text-[14px] text-[#828282]">(You may opt to blur sensitive data like Social Security info and etc.)</span>
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <div className="flex items-center justify-center w-[400px] min-h-[200px] border-dashed border-2 border-[#898989] p-2 rounded-[15px]">
                                            <img src={imageSrc} alt="ID card" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex flex-col w-auto">
                                            <label
                                                htmlFor="idUpload"
                                                className="bg-[#DC8801] p-2 rounded-[10px] text-[#FFF] hover:bg-[#B67101] active:scale-97"
                                            >
                                                Attach ID Photo
                                                <input type="file" accept="image/*" id="idUpload" hidden onChange={handleImageChange} required />
                                            </label>
                                            <span className="italic text-[#828282] text-[14px]">(Upload 1 supported file. Max. 10MB)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span>4. Have you raised a cat before?</span>
                                    <div className="flex gap-2">
                                        <label htmlFor="raisedYes" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                name="raisedCat"
                                                id="raisedYes"
                                                value="Yes, I know how to take care of a pet cat."
                                                onChange={(e) => setCatRaised(e.target.value)}
                                            />
                                            Yes, I know how to take care of a pet cat.
                                        </label>
                                        <label htmlFor="raisedNo" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                name="raisedCat"
                                                id="raisedNo"
                                                value="No, this is my first time."
                                                onChange={(e) => setCatRaised(e.target.value)}
                                            />
                                            No, this is my first time.
                                        </label>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col">
                                        <span>5. Do you have other pets right now? Kindly provide information:</span>
                                        <span className="italic text-[14px] text-[#7d7d7d]">(E.g., "Yes, I have two dogs.")</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Your answer here"
                                        className="flex items-center p-2 border border-[#A3A3A3] rounded-[8px]"
                                        onChange={(e) => setHavePets(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 w-full">
                                    <span>6. What is your current living situation?</span>
                                    <div className="flex flex-wrap gap-2 w-full">
                                        <label htmlFor="alone" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                name="currentSituation"
                                                id="alone"
                                                value="I live alone"
                                                onChange={(e) => setLivingSituation(e.target.value)}
                                            />
                                            I live alone
                                        </label>
                                        <label htmlFor="family" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                name="currentSituation"
                                                id="family"
                                                value="I live with my family (no children)."
                                                onChange={(e) => setLivingSituation(e.target.value)}
                                            />
                                            I live with my family (no children).
                                        </label>
                                        <label htmlFor="nochildren" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                name="currentSituation"
                                                id="nochildren"
                                                value="I live with my family (with one or more children)."
                                                onChange={(e) => setLivingSituation(e.target.value)}
                                            />
                                            I live with my family (with one or more children).
                                        </label>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col">
                                        <span>7. Do you have a regular income?</span>
                                        <span className="italic text-[14px] leading-tight text-[#898989]">
                                            (Raising indoor cats involves costs for essentials like food, litter, vitamins, vaccinations, and other necessities. SPR cats are trained to be indoor-only pets (owners are advised to keep them indoors for safety) and are litter box-trained before being made available for adoption.)
                                        </span>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <label htmlFor="answerYes" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                name="yesNo"
                                                id="answerYes"
                                                value="Yes"
                                                onChange={(e) => setIncome(e.target.value)}
                                            />
                                            Yes
                                        </label>
                                        <label htmlFor="answerNo" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                name="yesNo"
                                                id="answerNo"
                                                value="No"
                                                onChange={(e) => setIncome(e.target.value)}
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 w-full">
                                    <span>8. Are you available to pick up the cat from Siena Park Residences in Bicutan, or would you prefer to meet halfway?</span>
                                    <div className="flex flex-wrap gap-2 w-full">
                                        <label htmlFor="yesPickUp" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                name="pickup"
                                                id="yesPickUp"
                                                value="Yes, I'm able to do a pick-up."
                                                onChange={(e) => setPickup(e.target.value)}
                                            />
                                            Yes, I'm able to do a pick-up.
                                        </label>
                                        <label htmlFor="YesMeeting" className="flex items-center gap-2 p-2 border border-[#252525] rounded-[8px]">
                                            <input
                                                type="radio"
                                                name="pickup"
                                                id="YesMeeting"
                                                value="Yes, we can arrange a halfway meeting."
                                                onChange={(e) => setPickup(e.target.value)}
                                            />
                                            Yes, we can arrange a halfway meeting.
                                        </label>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span>9. Please share any additional information in order for us to know you better, we'd love to know more about you.</span>
                                    <textarea
                                        rows="5"
                                        placeholder="Your answer here"
                                        value={moreInfo}
                                        onChange={(e) => setMoreInfo(e.target.value)}
                                        className="p-2 border border-[#A3A3A3] rounded-[8px] resize-none"
                                    />
                                </div>
                                {error && <label className="font-[14px] italic text-[#DC8801]">{error}</label>}
                            </form>
                        ) : (
                            <div className="flex items-center justify-center p-5 bg-[#FFF] rounded-[15px] w-full h-full">
                                {error ? (
                                    <label className="font-[14px] italic text-[#DC8801]">{error}</label>
                                ) : (
                                    <label className="text-[#DC8801] text-center">{submitMessage}</label>
                                )}
                            </div>
                        )}
                    </div>

                    {isFormStarted && (
                        <button
                            type="button"
                            onClick={generateAdoptionForm}
                            disabled={loading}
                            className={`self-end cursor-pointer w-full xl:w-fit lg:w-fit md:w-fit text-center font-bold p-2 pl-5 pr-5 rounded-[10px] ${
                                loading ? 'bg-gray-400' : 'bg-[#B5C04A] hover:bg-[#CFDA34] active:bg-[#B5C04A]'
                            } text-white`}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdopteeForm;
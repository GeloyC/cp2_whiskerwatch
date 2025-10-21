// import React, { useState, useEffect } from 'react';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import NavigationBar from '../../components/NavigationBar';
// import Footer from '../../components/Footer';
// import Whisker from '../../components/Whisker';
// import { useSession } from '../../context/SessionContext';

// const CatProfile = () => {
//     const url = 'https://whiskerwatch-0j6g.onrender.com'; // Update if backend moves to Vercel
//     const { user } = useSession();
//     const [showAlert, setShowAlert] = useState(false);
//     const navigate = useNavigate();
//     const { cat_id } = useParams();

//     const [catInfo, setCatInfo] = useState(null);
//     const [catImages, setCatImages] = useState([]);
//     const [selectedImage, setSelectedImage] = useState('');
//     const [selectedImageIndex, setSelectedImageIndex] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const verifyLoggedIn = (e, path) => {
//         e.preventDefault();
//         if (!user) {
//             setShowAlert(true);
//         } else {
//             navigate(path);
//         }
//     };

//     const calculateCatAgeFromBirthDate = (birthDateStr) => {
//         const currentDate = new Date();
//         const birthDate = new Date(birthDateStr);

//         if (isNaN(birthDate.getTime())) {
//             console.error('Invalid birth date:', birthDateStr);
//             return { error: 'Invalid date format' };
//         }
//         if (birthDate > currentDate) {
//             console.error('Birth date in future:', birthDateStr);
//             return { error: 'Birth date is in the future' };
//         }

//         const diffMs = currentDate - birthDate;
//         const diffDays = diffMs / (1000 * 60 * 60 * 24);
//         const diffYears = Math.floor(diffDays / 365.25);
//         const diffMonths = Math.floor((diffDays % 365.25) / 30.44);

//         const formattedCatAge =
//             diffYears === 0
//                 ? `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`
//                 : `${diffYears} year${diffYears !== 1 ? 's' : ''}${diffMonths > 0 ? ` and ${diffMonths} month${diffMonths !== 1 ? 's' : ''}` : ''}`;

//         const catAgeInYears = diffYears + diffMonths / 12;
//         const humanYears =
//             catAgeInYears <= 1
//                 ? catAgeInYears * 15
//                 : catAgeInYears <= 2
//                 ? 15 + (catAgeInYears - 1) * 9
//                 : 24 + (catAgeInYears - 2) * 4;

//         const humanYearsInt = Math.floor(humanYears);
//         const humanMonths = Math.round((humanYears % 1) * 12);

//         const formattedHumanAge =
//             humanYearsInt === 0
//                 ? `${humanMonths} month${humanMonths !== 1 ? 's' : ''} in human age`
//                 : `${humanYearsInt} year${humanYearsInt !== 1 ? 's' : ''}${humanMonths > 0 ? ` and ${humanMonths} month${humanMonths !== 1 ? 's' : ''}` : ''} in human age`;

//         return { formattedCatAge, formattedHumanAge };
//     };

//     useEffect(() => {
//         const fetchCat = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(`${url}/cat/catlist`, {
//                     withCredentials: true,
//                 });
//                 const cats = response.data;

//                 const foundCat = cats.find(
//                     (cat) => cat.cat_id.toString() === cat_id && cat.status !== 'Pending'
//                 );
//                 if (!foundCat) {
//                     console.error('Cat not found or is Pending for ID:', cat_id);
//                     setError('Cat not found or unavailable');
//                     return;
//                 }

//                 const ageData = calculateCatAgeFromBirthDate(foundCat.birthday);
//                 if (ageData.error) {
//                     console.error('Age calculation error:', ageData.error);
//                     setError(ageData.error);
//                     return;
//                 }

//                 setCatInfo({
//                     ...foundCat,
//                     formattedCatAge: ageData.formattedCatAge,
//                     formattedHumanAge: ageData.formattedHumanAge,
//                 });
//             } catch (err) {
//                 console.error('Error fetching cat profiles:', err);
//                 setError('Failed to fetch cat data');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCat();
//     }, [cat_id, url]);

//     useEffect(() => {
//         const fetchCatImage = async () => {
//             if (!catInfo?.cat_id) return;

//             try {
//                 const response = await axios.get(`${url}/cat/images/${catInfo.cat_id}`, {
//                     withCredentials: true,
//                 });
//                 const imageUrls = Array.isArray(response.data)
//                     ? response.data.map((image) => ({
//                         ...image,
//                         url: image.url || image.image_filename,
//                     }))
//                     : [];

//                 setCatImages(imageUrls);
//                 if (imageUrls.length > 0) {
//                     setSelectedImage(imageUrls[0].url);
//                     setSelectedImageIndex(0);
//                 } else {
//                     setSelectedImage('');
//                     setSelectedImageIndex(null);
//                 }
//             } catch (err) {
//                 console.error('Error fetching cat images:', err);
//                 setCatImages([]);
//                 setSelectedImage('');
//                 setSelectedImageIndex(null);
//             }
//         };

//         fetchCatImage();
//     }, [catInfo, url]);

//     const handleImageClick = (index) => {
//         setSelectedImageIndex(index);
//         setSelectedImage(catImages[index].url);
//     };

//     if (loading) {
//         return (
//             <div className="flex flex-col min-h-screen w-full">
//                 <NavigationBar />
//                 <div className="flex-grow flex items-center justify-center">
//                     <div className="text-center">Loading...</div>
//                 </div>
//                 <Footer />
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex flex-col min-h-screen w-full">
//                 <NavigationBar />
//                 <div className="flex-grow flex items-center justify-center">
//                     <div className="text-center text-red-500">{error}</div>
//                 </div>
//                 <Footer />
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col min-h-screen w-full">
//             <Whisker />
//             <NavigationBar />
//             <main className="flex-grow flex flex-col items-center w-full">
//                 <div className="flex flex-col justify-start items-center xl:w-[1000px] lg:w-[900px] md:w-[700px] sm:w-full px-4">
//                     <div className="flex flex-col w-full">
//                         <div className="flex flex-col items-center gap-2">
//                             <div className="grid xl:grid-cols-2 lg:grid-cols-2 justify-items-center w-full p-5 gap-4 rounded-[10px]">
//                                 <div className="flex flex-col items-center justify-center w-full gap-2 xl:gap-4 lg:gap-4 md:gap-4 overflow-hidden rounded-[10px]">
//                                     <div className="w-full min-w-[300px] h-[500px] sm:min-w-[400px] md:min-w-[500px] min-h-[200px] rounded-[10px] overflow-hidden flex items-center justify-center bg-gray-100">
//                                         {selectedImage ? (
//                                             <img
//                                                 src={selectedImage}
//                                                 alt="cat image"
//                                                 className="w-full h-full object-cover"
//                                             />
//                                         ) : (
//                                             <div className="text-gray-400">No image available</div>
//                                         )}
//                                     </div>
//                                     <div className="grid grid-cols-5 gap-2 overflow-x-auto w-full">
//                                         {catImages.map((imageURL, index) => {
//                                             const isSelected = index === selectedImageIndex;
//                                             return (
//                                                 <div
//                                                     key={index}
//                                                     className={`max-w-[100px] max-h-[100px] overflow-hidden rounded-[10px] ${
//                                                         isSelected ? 'opacity-100' : 'opacity-40'
//                                                     } hover:opacity-100 active:opacity-40`}
//                                                 >
//                                                     <img
//                                                         src={imageURL.url}
//                                                         alt={`cat image ${index}`}
//                                                         className="w-full h-full object-cover"
//                                                         onClick={() => handleImageClick(index)}
//                                                     />
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>

//                                 {catInfo && (
//                                     <div className="flex flex-col justify-between items-start w-full">
//                                         <div className="flex flex-col gap-2 items-start w-full">
//                                             <div className="flex flex-row items-center w-full border-b-2 border-b-[#DC8801]">
//                                                 <label className="font-bold text-[25px] xl:text-[36px] lg:text-[32px] md:text-[28px] text-[#889132]">
//                                                     {catInfo.name || 'Unknown Cat'}
//                                                 </label>
//                                             </div>
//                                             <div className="flex flex-col w-full">
//                                                 <div className="flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1">
//                                                     <div className="flex flex-col items-center justify-center h-[25px] w-[25px] xl:h-[30px] xl:w-[30px] lg:h-[30px] lg:w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]">
//                                                         <img src="/assets/icons/genders.png" alt="gender" />
//                                                     </div>
//                                                     <div className="text-[14px]">
//                                                         <label className="font-bold pr-2">Gender:</label>
//                                                         <label>I am a <strong>{catInfo.gender || 'Unknown'}</strong></label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1">
//                                                     <div className="flex flex-col items-center justify-center h-[25px] w-[25px] xl:h-[30px] xl:w-[30px] lg:h-[30px] lg:w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]">
//                                                         <img src="/assets/icons/hourglass-white.png" alt="age" />
//                                                     </div>
//                                                     <div className="text-[14px]">
//                                                         <label className="font-bold pr-2">Age:</label>
//                                                         <label>
//                                                             {catInfo.formattedCatAge || 'Unknown'} (
//                                                             {catInfo.formattedHumanAge || 'Unknown'})
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1">
//                                                     <div className="flex flex-col items-center justify-center h-[25px] w-[25px] xl:h-[30px] xl:w-[30px] lg:h-[30px] lg:w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]">
//                                                         <img src="/assets/icons/status.png" alt="status" />
//                                                     </div>
//                                                     <div className="text-[14px]">
//                                                         <label className="font-bold pr-2">Sterilization Status:</label>
//                                                         <label>{catInfo.sterilization_status || 'Unknown'}</label>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="flex flex-col gap-2 text-justify text-[#2F2F2F] leading-tight py-5">
//                                                 <label className="text-[18px] xl:text-[20px] lg:text-[20px] md:text-[18px] font-bold text-[#889132]">
//                                                     About {catInfo.name || 'Unknown Cat'}
//                                                 </label>
//                                                 <p className="text-sm xl:text-md text-[#2F2F2F]">
//                                                     {catInfo.description || 'No description available'}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                         <div className="flex flex-col xl:flex-row lg:flex-row w-full gap-2">
//                                             <Link
//                                                 onClick={(e) => verifyLoggedIn(e, `/adopteeform/${catInfo.cat_id}`)}
//                                                 className="bg-[#889132] text-[#FFF] font-bold p-2 rounded-[10px] w-full text-center hover:bg-[#B5C04A] active:bg-[#889132]"
//                                             >
//                                                 I want to adopt {catInfo.name || 'this cat'}
//                                             </Link>
//                                             <Link
//                                                 to="/catadoption"
//                                                 className="border-[#B5C04A] border-2 text-[#B5C04A] bg-[#FFF] w-full font-bold p-2 rounded-[10px] text-center hover:bg-[#B5C04A] hover:text-[#FFF] active:bg-[#CFDA34] active:border-[#CFDA34]"
//                                             >
//                                                 See other Cats
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {showAlert && (
//                                 <div className="fixed inset-0 flex justify-center bg-black/50 bg-opacity-50 items-center z-50">
//                                     <div className="flex flex-col gap-3 bg-white p-6 rounded-[15px] shadow-md text-center max-w-sm w-full">
//                                         <h2 className="text-lg font-semibold mb-4">ACCOUNT REQUIRED</h2>
//                                         <p className="mb-4">Please log in to access the page.</p>
//                                         <div className="flex justify-center gap-4">
//                                             <Link
//                                                 to="/login"
//                                                 onClick={() => setShowAlert(false)}
//                                                 className="bg-[#99A339] text-white px-4 py-2 rounded-[10px] hover:scale-105 active:scale-95 transition-all duration-100"
//                                             >
//                                                 Go to Login
//                                             </Link>
//                                             <Link
//                                                 to={`/catprofile/${catInfo?.cat_id}`}
//                                                 onClick={() => setShowAlert(false)}
//                                                 className="bg-[#DC8801] text-[#FFF] px-4 py-2 rounded-[10px] hover:scale-105 active:scale-95 transition-all duration-100"
//                                             >
//                                                 Cancel
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </main>
//             <Footer />
//         </div>
//     );
// };

// export default CatProfile;



import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import Whisker from '../../components/Whisker';
import { useSession } from '../../context/SessionContext';

const CatProfile = () => {
    const url = 'https://whiskerwatch-0j6g.onrender.com';
    const { user } = useSession();
    // 1. New state for age restriction alert
    const [showAlert, setShowAlert] = useState(false);
    const [showAgeAlert, setShowAgeAlert] = useState(false); 
    const navigate = useNavigate();
    const { cat_id } = useParams();

    const [catInfo, setCatInfo] = useState(null);
    const [catImages, setCatImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to check if the user is 18 or older
    const isUserAbove18 = (birthDateStr) => {
        if (!birthDateStr) return false;
        
        const birthDate = new Date(birthDateStr);
        const currentDate = new Date();
        const ageLimit = new Date(
            currentDate.getFullYear() - 18,
            currentDate.getMonth(),
            currentDate.getDate()
        );
        
        return birthDate <= ageLimit;
    };

    // 2. Updated verifyLoggedIn to include the age check
    const verifyLoggedIn = (e, path) => {
        e.preventDefault();
        
        if (!user) {
            // Case 1: Not logged in
            setShowAlert(true);
        } else if (user.birthday && !isUserAbove18(user.birthday)) {
            // Case 2: Logged in, but under 18 (assuming 'user.birthday' holds the date)
            setShowAgeAlert(true);
        } else {
            // Case 3: Logged in and 18+
            navigate(path);
        }
    };
    
    // ... (Your calculateCatAgeFromBirthDate function remains the same)
    const calculateCatAgeFromBirthDate = (birthDateStr) => {
        const currentDate = new Date();
        const birthDate = new Date(birthDateStr);
        // ... (rest of the age calculation logic)
        
        if (isNaN(birthDate.getTime())) {
            console.error('Invalid birth date:', birthDateStr);
            return { error: 'Invalid date format' };
        }
        if (birthDate > currentDate) {
            console.error('Birth date in future:', birthDateStr);
            return { error: 'Birth date is in the future' };
        }

        const diffMs = currentDate - birthDate;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        const diffYears = Math.floor(diffDays / 365.25);
        const diffMonths = Math.floor((diffDays % 365.25) / 30.44);

        const formattedCatAge =
            diffYears === 0
                ? `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`
                : `${diffYears} year${diffYears !== 1 ? 's' : ''}${diffMonths > 0 ? ` and ${diffMonths} month${diffMonths !== 1 ? 's' : ''}` : ''}`;

        const catAgeInYears = diffYears + diffMonths / 12;
        const humanYears =
            catAgeInYears <= 1
                ? catAgeInYears * 15
                : catAgeInYears <= 2
                ? 15 + (catAgeInYears - 1) * 9
                : 24 + (catAgeInYears - 2) * 4;

        const humanYearsInt = Math.floor(humanYears);
        const humanMonths = Math.round((humanYears % 1) * 12);

        const formattedHumanAge =
            humanYearsInt === 0
                ? `${humanMonths} month${humanMonths !== 1 ? 's' : ''} in human age`
                : `${humanYearsInt} year${humanYearsInt !== 1 ? 's' : ''}${humanMonths > 0 ? ` and ${humanMonths} month${humanMonths !== 1 ? 's' : ''}` : ''} in human age`;

        return { formattedCatAge, formattedHumanAge };
    };

    // ... (Your useEffect hooks remain the same)
    useEffect(() => {
        const fetchCat = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}/cat/catlist`, {
                    withCredentials: true,
                });
                const cats = response.data;

                const foundCat = cats.find(
                    (cat) => cat.cat_id.toString() === cat_id && cat.status !== 'Pending'
                );
                if (!foundCat) {
                    console.error('Cat not found or is Pending for ID:', cat_id);
                    setError('Cat not found or unavailable');
                    return;
                }

                const ageData = calculateCatAgeFromBirthDate(foundCat.birthday);
                if (ageData.error) {
                    console.error('Age calculation error:', ageData.error);
                    setError(ageData.error);
                    return;
                }

                setCatInfo({
                    ...foundCat,
                    formattedCatAge: ageData.formattedCatAge,
                    formattedHumanAge: ageData.formattedHumanAge,
                });
            } catch (err) {
                console.error('Error fetching cat profiles:', err);
                setError('Failed to fetch cat data');
            } finally {
                setLoading(false);
            }
        };

        fetchCat();
    }, [cat_id, url]);

    useEffect(() => {
        const fetchCatImage = async () => {
            if (!catInfo?.cat_id) return;

            try {
                const response = await axios.get(`${url}/cat/images/${catInfo.cat_id}`, {
                    withCredentials: true,
                });
                const imageUrls = Array.isArray(response.data)
                    ? response.data.map((image) => ({
                        ...image,
                        url: image.url || image.image_filename,
                    }))
                    : [];

                setCatImages(imageUrls);
                if (imageUrls.length > 0) {
                    setSelectedImage(imageUrls[0].url);
                    setSelectedImageIndex(0);
                } else {
                    setSelectedImage('');
                    setSelectedImageIndex(null);
                }
            } catch (err) {
                console.error('Error fetching cat images:', err);
                setCatImages([]);
                setSelectedImage('');
                setSelectedImageIndex(null);
            }
        };

        fetchCatImage();
    }, [catInfo, url]);

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setSelectedImage(catImages[index].url);
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen w-full">
                <NavigationBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">Loading...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen w-full">
                <NavigationBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center text-red-500">{error}</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-full">
            <Whisker />
            <NavigationBar />
            <main className="flex-grow flex flex-col items-center w-full">
                <div className="flex flex-col justify-start items-center xl:w-[1000px] lg:w-[900px] md:w-[700px] sm:w-full px-4">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col items-center gap-2">
                            {/* ... (Your Cat Profile Display JSX remains the same) ... */}
                            <div className="grid xl:grid-cols-2 lg:grid-cols-2 justify-items-center w-full p-5 gap-4 rounded-[10px]">
                                <div className="flex flex-col items-center justify-center w-full gap-2 xl:gap-4 lg:gap-4 md:gap-4 overflow-hidden rounded-[10px]">
                                    <div className="w-full min-w-[300px] h-[500px] sm:min-w-[400px] md:min-w-[500px] min-h-[200px] rounded-[10px] overflow-hidden flex items-center justify-center bg-gray-100">
                                        {selectedImage ? (
                                            <img
                                                src={selectedImage}
                                                alt="cat image"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-gray-400">No image available</div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-5 gap-2 overflow-x-auto w-full">
                                        {catImages.map((imageURL, index) => {
                                            const isSelected = index === selectedImageIndex;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`max-w-[100px] max-h-[100px] overflow-hidden rounded-[10px] ${
                                                        isSelected ? 'opacity-100' : 'opacity-40'
                                                    } hover:opacity-100 active:opacity-40`}
                                                >
                                                    <img
                                                        src={imageURL.url}
                                                        alt={`cat image ${index}`}
                                                        className="w-full h-full object-cover"
                                                        onClick={() => handleImageClick(index)}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {catInfo && (
                                    <div className="flex flex-col justify-between items-start w-full">
                                        <div className="flex flex-col gap-2 items-start w-full">
                                            <div className="flex flex-row items-center w-full border-b-2 border-b-[#DC8801]">
                                                <label className="font-bold text-[25px] xl:text-[36px] lg:text-[32px] md:text-[28px] text-[#889132]">
                                                    {catInfo.name || 'Unknown Cat'}
                                                </label>
                                            </div>
                                            <div className="flex flex-col w-full">
                                                <div className="flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1">
                                                    <div className="flex flex-col items-center justify-center h-[25px] w-[25px] xl:h-[30px] xl:w-[30px] lg:h-[30px] lg:w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]">
                                                        <img src="/assets/icons/genders.png" alt="gender" />
                                                    </div>
                                                    <div className="text-[14px]">
                                                        <label className="font-bold pr-2">Gender:</label>
                                                        <label>I am a <strong>{catInfo.gender || 'Unknown'}</strong></label>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1">
                                                    <div className="flex flex-col items-center justify-center h-[25px] w-[25px] xl:h-[30px] xl:w-[30px] lg:h-[30px] lg:w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]">
                                                        <img src="/assets/icons/hourglass-white.png" alt="age" />
                                                    </div>
                                                    <div className="text-[14px]">
                                                        <label className="font-bold pr-2">Age:</label>
                                                        <label>
                                                            {catInfo.formattedCatAge || 'Unknown'} (
                                                            {catInfo.formattedHumanAge || 'Unknown'})
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1">
                                                    <div className="flex flex-col items-center justify-center h-[25px] w-[25px] xl:h-[30px] xl:w-[30px] lg:h-[30px] lg:w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]">
                                                        <img src="/assets/icons/status.png" alt="status" />
                                                    </div>
                                                    <div className="text-[14px]">
                                                        <label className="font-bold pr-2">Sterilization Status:</label>
                                                        <label>{catInfo.sterilization_status || 'Unknown'}</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 text-justify text-[#2F2F2F] leading-tight py-5">
                                                <label className="text-[18px] xl:text-[20px] lg:text-[20px] md:text-[18px] font-bold text-[#889132]">
                                                    About {catInfo.name || 'Unknown Cat'}
                                                </label>
                                                <p className="text-sm xl:text-md text-[#2F2F2F]">
                                                    {catInfo.description || 'No description available'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col xl:flex-row lg:flex-row w-full gap-2">
                                            <Link
                                                onClick={(e) => verifyLoggedIn(e, `/adopteeform/${catInfo.cat_id}`)}
                                                className="bg-[#889132] text-[#FFF] font-bold p-2 rounded-[10px] w-full text-center hover:bg-[#B5C04A] active:bg-[#889132]"
                                            >
                                                I want to adopt {catInfo.name || 'this cat'}
                                            </Link>
                                            <Link
                                                to="/catadoption"
                                                className="border-[#B5C04A] border-2 text-[#B5C04A] bg-[#FFF] w-full font-bold p-2 rounded-[10px] text-center hover:bg-[#B5C04A] hover:text-[#FFF] active:bg-[#CFDA34] active:border-[#CFDA34]"
                                            >
                                                See other Cats
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 3. Original Login Required Alert (showAlert) */}
                            {showAlert && (
                                <div className="fixed inset-0 flex justify-center bg-black/50 backdrop-blur-sm items-center z-50">
                                    <div className="flex flex-col gap-3 bg-white p-6 rounded-[15px] shadow-md text-center max-w-sm w-full">
                                        <h2 className="text-lg font-semibold mb-2">ACCOUNT REQUIRED</h2>
                                        <p className="mb-2">Please log in to access the adoption form.</p>
                                        <div className="flex justify-center gap-4">
                                            <Link
                                                to="/login"
                                                onClick={() => setShowAlert(false)}
                                                className="bg-[#99A339] text-white px-4 py-2 rounded-[10px] hover:scale-105 active:scale-95 transition-all duration-100"
                                            >
                                                Go to Login
                                            </Link>
                                            <button
                                                onClick={() => setShowAlert(false)}
                                                className="bg-[#DC8801] text-[#FFF] px-4 py-2 rounded-[10px] hover:scale-105 active:scale-95 transition-all duration-100"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 4. NEW Age Restriction Alert (showAgeAlert) */}
                            {showAgeAlert && (
                                <div className="fixed inset-0 flex justify-center bg-black/10 items-center z-50">
                                    <div className="flex flex-col gap-3 bg-white p-6 rounded-[15px] text-center max-w-sm w-full">
                                        <h2 className="text-lg font-semibold mb-2 text-red-600">AGE RESTRICTION</h2>
                                        <p className="mb-2">
                                            You must be at least 18 years old to submit an adoption application.
                                        </p>
                                        <button
                                            onClick={() => setShowAgeAlert(false)}
                                            className="bg-[#DC8801] text-[#FFF] px-4 py-2 rounded-[10px] hover:scale-101 active:scale-98 transition-all duration-100"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CatProfile;
import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';

import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import Whisker from '../../components/Whisker'
import CatBot from '../../components/CatBot';

import { useSession } from '../../context/SessionContext';

// TODO: Remove pending status > Change to only Available/Adopted


const CatProfile = () => {
    const url = `https://whiskerwatch-0j6g.onrender.com`;

    const { user } = useSession();
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const [currentCatIndex, setCurrentCatIndex] = useState(0)
    
    const [catInfo, setCatInfo] = useState([]);
    const [catImage, setCatImage] = useState([]); 
    const { cat_id } = useParams();


    const verifyLoggedIn = (e, path) => {
        e.preventDefault();

        if (!user) {
        setShowAlert(true);
        } else {
        navigate(path);
        }
    };
        
    // Fetches Cat data then sends cat_id to URL
    useEffect(() => {
        const fetchCat = async () => {
            try {
                const response = await axios.get(`${url}/cat/catlist`);
                const cats = response.data;

                setCatInfo(cats);

                // Find index of the cat matching the cat_id in the URL
                const index = cats.findIndex(cat => cat.cat_id.toString() === cat_id);

                // If cat found, use its index, otherwise default to 0
                setCurrentCatIndex(index !== -1 ? index : 0);
            } catch (err) {
                console.error('Error fetching cat profiles:', err);
            }
        };
        fetchCat();
    }, [cat_id]);



    // useEffect(() => {
    //     const fetchCatImage = async () => {
    //         if (!catInfo[currentCatIndex]) return;

    //         try {
    //         const catId = catInfo[currentCatIndex].cat_id;
    //         const response = await axios.get(`${url}/cat/images/${catId}`);
    //         const imageUrls = response.data.map(image => {
    //             const file = image.image_filename;
    //             return {
    //                 filename: file,
    //                 url: image.image_filename,
    //             };
    //         });

    //         setCatImage(imageUrls);
    //         setSelectedImage(imageUrls[0]?.url || '');
    //         setSelectedImageIndex(0);
    //         } catch (err) {
    //         console.error('Error fetching cat images:', err);
    //         }
    //     };

    //     fetchCatImage();
    // }, [currentCatIndex, catInfo]);

    useEffect(() => {
        const fetchCatImage = async () => {
            if (!catInfo[currentCatIndex]) return;

            try {
            const catId = catInfo[currentCatIndex].cat_id;
            const response = await axios.get(`${url}/cat/images/${catId}`);

            const imageUrls = response.data.map(image => ({
                filename: image.image_filename,
                url: image.image_filename, // Cloudinary URL
            }));

            if (imageUrls.length === 0) {
                setCatImage([]);
                setSelectedImage('');
                setSelectedImageIndex(null);
            } else {
                setCatImage(imageUrls);
                setSelectedImage(imageUrls[0].url);
                setSelectedImageIndex(0);
            }
            } catch (err) {
            console.error('Error fetching cat images:', err);
            }
        };

        fetchCatImage();
    }, [currentCatIndex, catInfo]);


    const currentCat = catInfo[currentCatIndex];

    const handlePreviousCat = () => {
        setCurrentCatIndex((prev) => (prev - 1 + catInfo.length) % catInfo.length);
    };

    const handleNextCat = () => {
        setCurrentCatIndex((prev) => (prev + 1) % catInfo.length);
    };


    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setSelectedImage(catImage[index].url); 
    };


    return (
        <div className='relative flex flex-col items-center w-full min-h-screen'>
            <Whisker />
            <NavigationBar />

            <div className='relative flex flex-col justify-start items-center xl:w-[1000px] lg:w-[900px] md:w-[700px] min-h-screen'>
                <div className='hidden xl:flex justify-between fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-5'>
                    <button onClick={handlePreviousCat} className='cursor-pointer flex items-center justify-start bg-[#B5C04A] size-15 p-3 rounded-[50%] hover:scale-105 active:scale-95 transition-all duration-100'>
                        <img src="/assets/icons/arrow-left-no-tail.png" alt="arrow left" className='w-auto h-full' />
                    </button>
                    <button onClick={handleNextCat} className='cursor-pointer  flex items-center justify-end bg-[#B5C04A] size-15 p-3 rounded-[50%] hover:scale-105 active:scale-95 transition-all duration-100'>
                        <img src="/assets/icons/arrow-right-no-tail.png" alt="arrow right" className='w-auto h-full' />
                    </button>
                </div>

                {/* Arrow left & Right */}

                <div className='relative flex flex-col h-full'>
                    <div className='relative flex flex-col items-center gap-2'>

                        <div className='relative grid xl:grid-cols-2 lg:grid-cols-2 justify-items-center w-full h-full p-5 gap-4 rounded-[10px]'>
                        

                            <div className='flex flex-col items-center justify-center w-full gap-2 xl:gap-4 lg:gap-4 md:gap-4 overflow-hidden rounded-[10px]'>

                                {/* Main Image Container */}
                                <div className='w-full min-w-[300px] h-[500px] sm:min-w-[400px] md:min-w-[500px] min-h-[200px] rounded-[10px] overflow-hidden flex items-center justify-center bg-gray-100'>
                                    {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt="cat image"
                                        className='w-full h-full object-cover'
                                    />
                                    ) : (
                                    <div className='text-gray-400'>
                                        No image available
                                    </div>
                                    )}
                                </div>

                                {/* Thumbnail Grid */}
                                <div className='grid grid-cols-5 gap-2 overflow-x-auto w-full'>
                                    {catImage.map((imageURL, index) => {
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
                                            className='w-full h-full object-cover'
                                            onClick={() => handleImageClick(index)}
                                        />
                                        </div>
                                    );
                                    })}
                                </div>

                            </div>


                            {currentCat && (
                                <div className='flex flex-col justify-between items-start w-full'>
                                    <div className='flex flex-col gap-2 items-start w-full'>
                                        <div className='flex flex-row items-center w-full border-b-2 border-b-[#DC8801]'>
                                            <label className='font-bold text-[25px] xl:text-[36px] lg:text-[32px] md:text-[28px] text-[#889132]'>{currentCat.name}</label>
                                        </div>

                                        <div className='flex flex-col w-full'>
                                            <div className='flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1'>
                                                <div className='flex flex-col items-center justify-center h-[25px] w-[25px] xl:h-[30px] xl:w-[30px] lg:h-[30px] lg:w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]'>
                                                    <img src="/assets/icons/genders.png" alt="gender" />
                                                </div>
                                                <div className='text-[14px]'>
                                                    <label className='font-bold pr-2'>Gender:</label>
                                                    <label>I am a <strong>{currentCat.gender}</strong></label>
                                                </div>  
                                            </div>
                                            <div className='flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1'>
                                                <div className='flex flex-col items-center justify-center h-[25px] w-[25px] xl:h-[30px] xl:w-[30px] lg:h-[30px] lg:w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]'>
                                                    <img src="/assets/icons/hourglass-white.png" alt="gender" />
                                                </div>
                                                <div className='text-[14px]'>
                                                    <label className='font-bold pr-2'>Age:</label>
                                                    <label>{currentCat.age} years old</label>
                                                </div>  
                                            </div>
                                            <div className='flex flex-row items-center gap-1 border-b-1 border-b-[#B5C04A] pb-1 pt-1'>
                                                <div className='flex flex-col items-center justify-center h-[25px] w-[25px] xl:h-[30px] xl:w-[30px] lg:h-[30px] lg:w-[30px] bg-[#B5C04A] p-[5px] rounded-[50%]'>
                                                    <img src="/assets/icons/status.png" alt="gender" />
                                                </div>
                                                <div className='text-[14px]'>
                                                    <label className='font-bold pr-2x'>Sterilization Status:</label>
                                                    <label> {currentCat.sterilization_status}</label>
                                                </div>  
                                            </div>
                                            
                                        </div>
                                        <div className='flex flex-col gap-2 text-justify text-[#2F2F2F] leading-tight py-5'>
                                            {/* Cat Description */} 
                                            <label className='text-[18px] xl:text-[20px] lg:text-[20px] md:text-[18px] font-bold text-[#889132]'>About {currentCat.name}</label>
                                            <p className='text-sm xl:text-md text-[#2F2F2F]'>
                                                {currentCat.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col xl:flex-row lg:flex-row w-full gap-2'>
                                        <Link onClick={(e) => verifyLoggedIn(e, `/adopteeform/${currentCat.cat_id}`)} className='bg-[#889132] text-[#FFF] font-bold p-2 rounded-[10px] w-full text-center hover:bg-[#B5C04A] active:bg-[#889132]'>
                                            I want to adopt {currentCat.name}
                                        </Link>
                                        <Link to="/catadoption" className='border-[#B5C04A] border-2 text-[#B5C04A] bg-[#FFF] w-full font-bold p-2 rounded-[10px] text-center hover:bg-[#B5C04A] hover:text-[#FFF] active:bg-[#CFDA34] active:border-[#CFDA34]'>
                                            See other Cats
                                        </Link>
                                    </div>
                                </div>
                            )}

                        </div>

                        
                    </div>


                    {showAlert && (
                        <div className="fixed inset-0 flex justify-center bg-black/50 bg-opacity-50 items-center z-999">
                            <div className="flex flex-col gap-3 bg-white p-6 rounded-[15px] shadow-md text-center max-w-sm w-full">
                            <h2 className="text-lg font-semibold mb-4">ACCOUNT REQUIRED</h2>
                            <p className="mb-4">Please log in to access the page.</p>
                            <div className="flex justify-center gap-4">
                                <Link to="/login" onClick={() => setShowAlert(false)} className="bg-[#99A339] text-white px-4 py-2 rounded-[10px] hover:scale-105 active:scale-95 transition-all duration-100">
                                Go to Login
                                </Link>
                                <Link to={`/catprofile/${currentCat.cat_id}`} onClick={() => setShowAlert(false)} className="bg-[#DC8801] text-[#FFF] px-4 py-2 rounded-[10px] hover:scale-105 active:scale-95 transition-all duration-100">
                                Cancel
                                </Link>
                            </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* <SideNavigation /> */}
            </div>
            <Footer />
        </div>
    )
}

export default CatProfile
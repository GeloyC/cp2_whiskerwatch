import React from 'react'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useLocation, useParams } from 'react-router-dom'

import NavigationBar from '../../components/NavigationBar'
import Footer from '../../components/Footer'
import CatBot from '../../components/CatBot'


import { useSession } from '../../context/SessionContext'


// TODO: Add certificate view 
// Certicate to be emailed upon successful adoption

const Profile = () => {
    const url = `https://whiskerwatch-0j6g.onrender.com`;

    const location = useLocation();
    const [profile, setProfile] = useState([]);
    const [updateProfile, setUpdateProfile] = useState(false);
    const [originalProfile, setOriginalProfile] = useState({});
    const [userCertificates, setUserCertificates] = useState([]);
    const [error, setError] = useState('');

    const { user, whiskerUpdateTrigger } = useSession();
    const [points, setPoints] = useState(0);
    

    // whiskermeter
    const MAX_POINTS = 500;
    const progressHeightPercent = Math.min((points / MAX_POINTS) * 100, 100);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
            const response = await axios.get(`${url}/user/profile`, {
                withCredentials: true, // This automatically sends your cookie
            });

            setProfile(response.data);
            setOriginalProfile(response.data);

            // Fetch certificates using user_id from the response
            if (response.data.user_id) {
                const certificateResponse = await axios.get(
                `${url}/admin/adopters_certificate/${response.data.user_id}`,
                { withCredentials: true }
                );
                setUserCertificates(certificateResponse.data);
            }

            } catch (err) {
            console.error("Error fetching user:", err.response?.data || err.message);
            }
        };

        fetchProfile();
    }, []);


    // const handleImageChange = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     const previewUrl = URL.createObjectURL(file);

    //     // Sets temporary preview and store file
    //     setProfile(prev => ({
    //         ...prev,
    //         profile_image: previewUrl, 
    //         _newFile: file,             
    //         old_image: prev.profile_image 
    //     }));
    // };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setProfile(prev => ({
            ...prev,
            profile_image: previewUrl,
            _newFile: file,
            old_image: prev.profile_image,
            old_cloudinary_id: prev.cloudinary_id, // new field
        }));
    };



    const handleSave = async () => {
        try {
            const token = Cookies.get('token');

            const formData = new FormData();
            // Append text fields
            formData.append('firstname', profile.firstname);
            formData.append('lastname', profile.lastname);
            formData.append('address', profile.address);
            formData.append('email', profile.email);
            formData.append('birthday', profile.birthday);
            formData.append('badge', profile.badge); // if needed
            formData.append('profile_image', profile.profile_image || '');
            formData.append('old_cloudinary_id', profile.old_cloudinary_id || profile.cloudinary_id || '');

            // If there's a new file, include it
            if (profile._newFile) {
                formData.append('profile_image', profile._newFile);
            }

            const response = await axios.patch(`${url}/user/profile/update`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });


            URL.revokeObjectURL(profile.profile_image); 

            setProfile(response.data.profile);
            setOriginalProfile(response.data.profile);
            setUpdateProfile(false);
            setError('');

            window.location.reload();

        } catch (err) {
            console.error("Failed to update profile", err);
            setError(err.response?.data?.error || 'Failed to update profile');
        }
    };

    const profileUpdateWindow = () => {
        if (updateProfile) {
            setProfile(originalProfile); // Restore original profile
            if (profile.profile_image?.startsWith('blob:')) {
                URL.revokeObjectURL(profile.profile_image); // Clean up blob URL
        }
        } else {
            setOriginalProfile(profile); // Save current state
        }
        setUpdateProfile((prev) => !prev);
        setError(''); // Clear error on cancel or edit
    };


    useEffect(() => {
        return () => {
        if (profile.profile_image?.startsWith('blob:')) {
            URL.revokeObjectURL(profile.profile_image);
        }
        };
    }, [profile.profile_image]);


    useEffect(() => {
        const fetchWhiskerPoints = async () => {
        if (!user?.user_id) return;
        try {
            const token = Cookies.get('token');
            const response = await axios.get(`${url}/whisker/whiskermeter/${user.user_id}`, {
                withCredentials: true, 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPoints(response.data.points || 0);
        } catch (err) {
            console.error('Failed to fetch whisker points:', err);
        }
        };
        fetchWhiskerPoints();
    }, [user, whiskerUpdateTrigger]);

    

    return (
        <div className='flex flex-col min-h-screen'>
            <CatBot message = {`Welcome to your profile ${user?.firstname} ${user?.lastname}! here you can make changes, see your WhiskerMeter progress, and your profile overview!`}/>


            <NavigationBar />
            <div className='flex flex-col h-full xl:py-10 lg:py-10'>
                <div className='flex flex-col items-center justify-center w-full'>
                    {/* ALL CONTENTS HERE */}
                    <div className='flex flex-col  rounded-[12px] overflow-hidden w-auto xl:w-[1000px] lg:w-[1000px]'>
                        

                        <div className='flex flex-col'>
                            <div className='flex flex-col  gap-4  rounded-t-[10px] border-dashed border-b-2 border-b-[#8f8f8f]'>
                                {/* MAIN PROFILE */}
                                <div className='w-full text-center font-bold text-3xl text-[#889132]'>
                                    <span>MY PROFILE</span>
                                </div>
                                {!updateProfile && (
                                    <>
                                        {profile && (
                                            <div className='relative flex flex-col p-[2%] xl:flex-row lg:flex-row gap-5'>
                                                <div className='flex flex-row xl:flex-col lg:flex-col gap-3 justify-center'>
                                                    <div className='flex w-[250px] h-[250px] bg-[#B5C04A] rounded-sm p-2'>
                                                        <img
                                                            src={
                                                                profile.profile_image?.startsWith('blob:')
                                                                ? profile.profile_image
                                                                : profile.profile_image?.startsWith('http')
                                                                    ? profile.profile_image
                                                                    : '/assets/UserProfile/default_profile_image.jpg'
                                                            }
                                                            alt="Profile"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    <div className='flex flex-row gap-2'>
                                                        <button onClick={profileUpdateWindow} className='bg-[#B5C04A] min-w-[90px] h-fit p-2 rounded-[10px] text-[#000] hover:bg-[#CFDA34] active:bg-[#B5C04A]'>Edit Profile</button>
                                                    </div>  
                                                </div>
                                                <div className='flex flex-col'>
                                                    <div className='flex flex-row gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                        <label className='font-bold'>Name:</label>
                                                        <label>{`${profile.firstname} ${profile.lastname}`}</label>
                                                    </div>
                                                    <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                        
                                                        <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                            <div className='w-[30px] h-auto'>
                                                                <img src="/assets/icons/location-orange.png" alt="" />
                                                            </div> 
                                                            Address: 
                                                        </label>
                                                        <label> {profile.address} </label>
                                                    </div>
                                                    <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                        <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                            <div className='w-[30px] h-auto'>
                                                                <img src="/assets/icons/email-orange.png" alt="" />
                                                            </div> 
                                                            Email: 
                                                        </label>
                                                        <label>{profile.email}</label>
                                                    </div>
                                                    <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                        <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                            <div className='w-[30px] h-auto'>
                                                                <img src="/assets/icons/birthday-cake.png" alt="" />
                                                            </div> 
                                                            Birthday: 
                                                        </label>
                                                        <label>{profile.birthday}</label>
                                                    </div>
                                                    <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                        <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                            <div className='w-[30px] h-auto'>
                                                                <img src="/assets/icons/badge-orange.png" alt="" />
                                                            </div> 
                                                            Badge: 
                                                        </label>
                                                        <label>{profile.badge}</label>
                                                    </div>
                                                    <label className='leading-tight text-[14px] pt-4 pb-2 text-[#645e5f]'>
                                                        You've received the <strong>{profile.badge}</strong> badge! You're cuddly corners and warming hearts along the way. <br/>
                                                        Thanks for your growing support! Your cozy contributions don't go unnoticed!
                                                    </label>

                                                    <div className='flex flex-row items-center gap-3 pt-2 pb-2'>
                                                        {userCertificates.length > 0 && (
                                                            userCertificates.map((cert, index) => (
                                                                <a
                                                                    key={index}
                                                                    href={cert.certificate}
                                                                    target='_blank'
                                                                    rel='noopener noreferrer'
                                                                    className='flex items-center justify-between self-start min-w-[300px] gap-3 p-2 pl-4 pr-4 bg-[#E3E697] text-[#2F2F2F] rounded-[10px] hover:underline border-dashed border-2 border-[#99A339]'
                                                                >
                                                                    View Certificate #{index + 1}
                                                                    <div className='w-[25px] h-auto'>
                                                                        <img src="/assets/icons/document-black.png" alt="" />
                                                                    </div>
                                                                </a>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>            
                                            </div>     
                                        )}
                                    </>
                                )}

                                {updateProfile && (
                                    <>
                                    {profile && (
                                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className='relative flex flex-col items-center xl:items-start lg:items-start xl:flex-row lg:flex-row gap-5'>
                                            <div className='relative flex w-[250px] h-[200px] bg-[#B5C04A] rounded-sm p-2'>
                                                <label htmlFor="profile_image" className='absolute bottom-3 left-3 bg-[#DC8801] rounded-[15px] cursor-pointer  pl-2 pr-2'>
                                                    <label htmlFor="profile_image" className='cursor-pointer text-[#FFF] text-[12px]'>{!profile.profile_image ? 'Add Photo' : 'Replace'}</label>
                                                    <input type="file" onChange={handleImageChange}
                                                    accept='image/jpeg, image/png' id="profile_image" hidden/>
                                                </label>
                                                <img src={
                                                    profile.profile_image?.startsWith('blob:') 
                                                    ? profile.profile_image
                                                    : profile.profile_image
                                                        ? `${url}/FileUploads/${profile.profile_image}` || '/assets/UserProfile/default_profile_image.jpg'
                                                        : '/assets/UserProfile/default_profile_image.jpg'} alt="" 
                                                className='w-full h-full object-cover'/>
                                            </div>
                                            
                                            <div className='flex flex-col w-full'>
                                                <div className='flex flex-row w-full gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                    <div className='flex items-center gap-2'>
                                                        <label className='font-bold'>Firstname:</label>
                                                        {/* <label>{`${profile.firstname} ${profile.lastname}`}</label> */}
                                                        <input type="text" className='w-full' value={profile.firstname || ''}
                                                        onChange={(e) => setProfile((prev) => ({...prev, firstname: e.target.value}))}/>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <label className='font-bold'>Lastname:</label>
                                                        <input type="text" className='w-full' value={profile.lastname || ''} 
                                                        onChange={(e) => setProfile((prev) => ({...prev, lastname: e.target.value}))}/>
                                                    </div>
                                                </div>
                                                <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                    
                                                    <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                        <div className='w-[30px] h-auto'>
                                                            <img src="/assets/icons/location-orange.png" alt="" />
                                                        </div> 
                                                        Address: 
                                                    </label>
                                                    <input type="text" value={profile.address || ''} className='w-full'
                                                    onChange={(e) => setProfile((prev) => ({...prev, address: e.target.value}))}/>
                                                </div>
                                                <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                    <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                        <div className='w-[30px] h-auto'>
                                                            <img src="/assets/icons/email-orange.png" alt="" />
                                                        </div> 
                                                        Email: 
                                                    </label>
                                                    <input type="text" value={profile.email} className='w-full'
                                                    onChange={(e) => setProfile((prev) => ({...prev, email: e.target.value}))}/>
    
                                                </div>
                                                <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                    <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                        <div className='w-[30px] h-auto'>
                                                            <img src="/assets/icons/birthday-cake.png" alt="" />
                                                        </div> 
                                                        Birthday: 
                                                    </label>
                                                    <input type="date" value={profile.birthday} 
                                                    onChange={(e) => setProfile((prev) => ({...prev, birthday: e.target.value}))}/>
                                                </div>

                                                <div className='flex flex-row justify-center xl:justify-end lg:justify-end py-3 gap-2 w-full'>
                                                    <button type='submit' className='bg-[#B5C04A] w-full xl:w-[90px] lg:w-[90px] p-2 rounded-[10px] text-[#000] hover:bg-[#CFDA34] active:bg-[#B5C04A] cursor-pointer'>Save</button>

                                                    <button type='button' onClick={profileUpdateWindow} className='bg-[#DC8801] w-full xl:w-[90px] lg:w-[90px] p-2 rounded-[10px] text-[#000] hover:bg-[#fe9f07] active:bg-[#977655] cursor-pointer'>Cancel</button>
                                                </div>              
                                            </div>
                                        </form>    
    
                                    )}
                                    </>
                                )}
                                
                            </div>

                            <div className='flex flex-col gap-4 bg-[#ffdfab] bg-[url(/src/assets/background-paws.png)] w-full bg-cover bg-fit bg-repeat p-10 rounded-b-[10px]'>
                                {/* WHISKER METER */}
                                <label className='font-bold text-[#2F2F2F] text-2xl text-center'>WHISKERMETER TRACKER</label>
                                <span className='w-fit self-center text-[#B67101] bg-[#FFF] p-1 rounded-[5px] '>{`You have ${points} points.`}</span>
                                <div className='relative flex w-full'>
                                    <div className='absolute flex justify-evenly w-full'>
                                        <div className='w-[15px] object-fit rotate-90'>
                                            <img src="/assets/icons/divider_line.png" alt="" className='w-full object-cover'/>
                                        </div>
                                        <div className='w-[15px] object-fit rotate-90'>
                                            <img src="/assets/icons/divider_line.png" alt="" className='w-full object-cover'/>
                                        </div>
                                        <div className='w-[15px] object-fit rotate-90'>
                                            <img src="/assets/icons/divider_line.png" alt="" className='w-full object-cover'/>
                                        </div>
                                        <div className='w-[15px] object-fit rotate-90'>
                                            <img src="/assets/icons/divider_line.png" alt="" className='w-full object-cover'/>
                                        </div>
                                    </div>

                                    
                                        
                                    <progress className='w-full 
                                        [&::-webkit-progress-bar]:rounded-lg 
                                        [&::-webkit-progress-value]:rounded-lg 
                                        [&::-webkit-progress-bar]:bg-[#FFF] 
                                        [&::-webkit-progress-value]:bg-[#B5C04A]
                                        [&::-moz-progress-bar]:bg-green-400' value={progressHeightPercent} max="100">
                                        100%
                                    </progress>
                                    
                                </div>

                                <div className='grid grid-cols-5 place-items-center justify-items-between min-height-[150px] max-h-[200px]'>
                                    <div className='flex flex-col items-center text-[14px]'>
                                        <div className="w-[15px] h-[15px] object-contain">
                                            <img src="/assets/icons/whisker_arrow.png" alt="Arrow icon" className="w-full h-full object-cover -rotate-90" />
                                        </div>
                                        Toe Bean Trainee

                                        <div className='size-12 object-cover'>
                                            <img src="/assets/badge/trainee-badge-icon.png" alt="" className='w-full h-full object-cover'/>
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-center text-[14px]'>
                                        <div className="w-[15px] h-[15px] object-contain">
                                            <img src="/assets/icons/whisker_arrow.png" alt="Arrow icon" className="w-full h-full object-cover -rotate-90" />
                                        </div>
                                        Snuggle Scout

                                        <div className='size-12 object-cover'>
                                            <img src="/assets/badge/scout-badge-icon.png" alt="" className='w-full h-full object-cover'/>
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-center text-[14px]'>
                                        <div className="w-[15px] h-[15px] object-contain">
                                            <img src="/assets/icons/whisker_arrow.png" alt="Arrow icon" className="w-full h-full object-cover -rotate-90" />
                                        </div>
                                        Furmidable Friend

                                        <div className='size-12 object-cover'>
                                            <img src="/assets/badge/friend-badge-icon.png" alt="" className='w-full h-full object-cover'/>
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-center text-[14px]'>
                                        <div className="w-[15px] h-[15px] object-contain">
                                            <img src="/assets/icons/whisker_arrow.png" alt="Arrow icon" className="w-full h-full object-cover -rotate-90" />
                                        </div>
                                        Meowtain Mover

                                        <div className='size-12 object-cover'>
                                            <img src="/assets/badge/mover-badge-icon.png" alt="" className='w-full h-full object-cover'/>
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-center text-[14px]'>
                                        <div className="w-[15px] h-[15px] object-contain">
                                            <img src="/assets/icons/whisker_arrow.png" alt="Arrow icon" className="w-full h-full object-cover -rotate-90" />
                                        </div>
                                        The Catnip Captain

                                        <div className='size-12 object-cover'>
                                            <img src="/assets/badge/captain-badge-icon.png" alt="" className='w-full h-full object-cover'/>
                                        </div>
                                    </div>
                                </div>


                                <label className='text-[14px] leading-tight text-justify p-2 border-dashed border-t-1 border-t-[#B5C04A]'>
                                    The WhiskerMeter tracks your journey through the WhiskerWatch! As you support and contribute, you’ll climb from humble Toe Bean Trainee to the legendary Catnip Captain. Each tier reflects your growing impact and unlocks a badge to proudly display on your profile because every pawprint matters in this cozy, cat-loving community.
                                </label>

                            </div>
                        </div>
                    </div>
                </div>
                {/* <SideNavigation /> */}
            </div>
            <Footer />
        </div>
    )
}

export default Profile
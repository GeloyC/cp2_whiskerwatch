import React, {useState, useEffect} from 'react';
import AdminSideBar from '../../../components/AdminSideBar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    
    const { user_id } = useParams();
    const [profile, setProfile] = useState({
        user_id: '',
        firstname: '',
        lastname: '',
        profile_image: '/src/assets/UserProfile/default_profile_image.jpg',
        role:'regular',
        email:'',
        contactnumber:'',
        birthday:'',
        address: ''
    });

    const [profileImage, setProfileImage] = useState([]);
    const [userOriginal, setUserOriginal] = useState(null);
    const [userCertificates, setUserCertificates] = useState([]);


    useEffect(() => {
        if (!user_id) return;
        const fetchUserProfile = async () => {
            try {   
                const response = await axios.get(`http://localhost:5000/admin/manage/userprofile/${user_id}`);
                setProfile(response.data);
                setUserOriginal(response.data);

                console.log(response.data)

                const profileImage = await axios.get(`http://localhost:5000/user/profile`, { withCredentials: true })
                setProfileImage(profileImage.data)

                const certificateResponse = await axios.get(`http://localhost:5000/admin/adopters_certificate/${user_id}`);
                const certificates = certificateResponse.data;
                console.log('Certificate: ', certificates)

                setUserCertificates(certificates);
            } catch(err) {
                console.error('Error fetch user data: ', err);
            }
        }
        fetchUserProfile();
    }, [user_id]);


    const isProfileModified = () => {
        return JSON.stringify(profile) !== JSON.stringify(userOriginal);
    };

    const handleUserUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`http://localhost:5000/admin/manage/userupdate/${user_id}`, {
                firstname: profile.firstname,
                lastname: profile.lastname,
                role: profile.role,
                email: profile.email,
                contactnumber: profile.contactnumber,
                birthday: profile.birthday,
                address: profile.address
            });


            console.log('User Update success: ', response.data);
            window.location.reload();

        } catch (err) {
            console.error('Update failed:', err.response?.data || err.message);
        }
    }


    return (
        <div className='relative flex flex-col h-screen'>
            <div className='flex flex-row w-full overflow-x-hidden'>
                <AdminSideBar className='max-w-[400px]'/>
                <div className='flex flex-col items-center p-10 min-h-screen gap-5 mx-auto w-full overflow-y-scroll'>
                    <div className='flex flex-row justify-start w-full border-b-2 border-b-[#525252]'>
                    <label className='font-bold text-[24px]'>User Profile</label>
                    </div>

                    {profile && (
                        <form onSubmit={handleUserUpdate} className='flex flex-col bg-[#FFF] gap-4 p-5 rounded-[15px] shadow-lg w-full h-auto'>
                            <div className='flex w-full items-center justify-end gap-5'>
                                <div className='flex gap-2 items-center'> 
                                    <label className='text-[14px] text-[#595959]'>User ID:</label>
                                    <label className='text-[16px] text-[#2F2F2F] font-bold'>{user_id}</label>
                                </div>
                                <div className='flex gap-2 items-center pr-10'> 
                                    <label className='text-[14px] text-[#595959]'>Role:</label>
                                    <label className='text-[16px] text-[#2F2F2F] font-bold'>{profile.role}</label>
                                </div>
                                <div className='flex gap-2 items-center'> 
                                    <label className='text-[14px] text-[#595959]'>Account Created:</label>
                                    <label className='text-[16px] text-[#2F2F2F] font-bold'>{profile.created_at}</label>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <label className='text-[14px] text-[#595959]'>Last Updated:</label>
                                    <label className='text-[16px] text-[#2F2F2F] font-bold'>{profile.updated_at}</label>
                                </div>
                            </div>

                            <div className='flex gap-3 items-center'>
                                <div className='flex w-[250px] h-[250px] object-fit rounded-[10px] overflow-hidden'>
                                    <img src={`http://localhost:5000/FileUploads/${profile.profile_image}`} alt="User profile image" className="bg-[#a3a3a3] w-full h-full object-cover"/>
                                </div>

                            </div>

                            <div className='flex items-center justify-between w-full gap-4 pt-2'>
                                <div className='flex flex-col gap-1 justify-start w-full'>
                                    <label className='text-[14px] text-[#595959]'>First name</label>
                                    <input type="text" placeholder='Add first name' className='text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                    value={profile?.firstname || ''} onChange={(e) => setProfile((prev) => ({...prev, firstname:e.target.value}))}/>
                                </div>

                                <div className='flex flex-col gap-1 justify-start w-full'>
                                    <label className='text-[14px] text-[#595959]'>Last name</label>
                                    <input type="text" placeholder='Add last name' className='text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                    value={profile?.lastname || ''} onChange={(e) => setProfile((prev) => ({...prev, lastname: e.target.value}))}/>
                                </div>
                                <div className='flex flex-col gap-1 justify-start w-full'>
                                    <label className='text-[14px] text-[#595959]'>Badge</label>
                                    <label className='text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'> Toe Bean Trainee</label>
                                </div>
                            </div>

                            <div className='flex items-center justify-between w-full gap-4 pt-2'>
                                <div className='flex flex-col gap-1 justify-start w-full'>
                                    <label className='text-[14px] text-[#595959]'>Email</label>
                                    <input type="email" placeholder='Add Email' className='text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                    value={profile?.email || ''} onChange={(e) => setProfile((prev) => ({...prev, email:e.target.value}))}/>
                                </div>
                                <div className='flex flex-col gap-1 justify-start w-full'>
                                    <label className='text-[14px] text-[#595959]'>Contact No.</label>
                                    <input type="number" placeholder='Add contact number' className='appearance-none text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                    value={profile?.contactnumber || ''} onChange={(e) => setProfile((prev) => ({...prev, contactnumber: e.target.value}))}/>
                                </div>
                                <div className='flex flex-col gap-1 justify-start w-full'>
                                    <label className='text-[14px] text-[#595959]'>Birthday</label>
                                    <input type="date" className='text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                    value={profile?.birthday} onChange={(e) => setProfile((prev) => ({...prev, birthday: e.target.value}))}/>
                                </div>
                            </div>

                            <div className='flex flex-col gap-1 justify-start w-full'>
                                <label className='text-[14px] text-[#595959]'>Address</label>
                                <input type="text" placeholder='Add Address' className='text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                value={profile?.address || ''} onChange={(e) => setProfile((prev) => ({...prev, address: e.target.value}))}/>
                            </div>
                            
                            <div className='flex items-center gap-2'>
                                
                                <div className='flex flex-col gap-1 justify-start'>
                                    <label className='text-[14px] text-[#595959]'>Adoption History</label>
                                    {userCertificates.length > 0 ? (
                                        userCertificates.map((cert, index) => (
                                            <a
                                                key={index}
                                                href={`http://localhost:5000/FileUploads/certificate/${cert.certificate}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='flex items-center justify-between self-start min-w-[300px] gap-3 p-2 pl-4 pr-4 bg-[#FDF5D8] text-[#2F2F2F] rounded-[10px] hover:underline border-dashed border-2 border-[#595959]'
                                            >
                                                View Certificate #{index + 1}
                                                <div className='w-[25px] h-auto'>
                                                    <img src="/src/assets/icons/document-black.png" alt="" />
                                                </div>
                                            </a>
                                        ))
                                    ) : (
                                        <span className='text-[#DC8801] bg-[#FDF5D8] p-2 pl-4 pr-4 rounded-[10px]'>No certificates found.</span>
                                    )}
                                </div>
                            </div>

                            <div className='flex w-full justify-end gap-2'> 
                                <button type='submit' 
                                    className={isProfileModified() ? 'p-2 pl-4 pr-4 bg-[#B5C04A] text-[#FFF] font-bold w-auto rounded-[15px] hover:bg-[#CFDA34] active:bg-[#E3E697]' : 'hidden'}>
                                    Save Changes
                                </button>

                                <button type='button' onClick={(e) => window.location.reload()}
                                className={isProfileModified() ? 'bg-[#DC8801] text-[#FFF] font-bold p-2 pl-4 pr-4 cursor-pointer rounded-[15px] active:bg-[#977655]' : 'hidden'}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserProfile
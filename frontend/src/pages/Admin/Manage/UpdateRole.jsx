import React, { useEffect, useState } from 'react';
import { Link, resolvePath, useParams, useLocation, useNavigation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSession } from '../../../context/SessionContext';

const UpdateRole = () => {
    const url = `https://whiskerwatch-0j6g.onrender.com`;
    
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSession();

    const goBack = () => {
        navigate('/adminlist');
    }

    const { user_id } = useParams();
    const [role, setRole] = useState(''); 
    const [roleOriginal, setRoleOriginal] = useState()

    const [updateMessage, setUpdateMessage] = useState('')


    useEffect(() => {
        const fetchUser = async (user_id) => {
            try {
                const response = await axios.get(`${url}/admin/manage/role/${user?.user_id}`);

                setRole(response.data.role)
                setRoleOriginal(response.data.role)

            } catch (err) {
                console.error('Failed to fetch user: ', err)
            }
        }

        fetchUser(user_id);
    }, [user_id]);

    const handleRoleUpdate = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.patch(`${url}/admin/manage/update/${user?.user_id}`, {
                firstname: user.firstname,
                lastname: user.lastname,
                role: role
            });

            console.log('Update success:', response);

            setUser(prev => ({ ...prev, role }));
            setRoleOriginal(role);
            setUpdateMessage(response.data.message)
            
        } catch (err) {
            console.error('Update failed:', err.response?.data || err.message);
        }
    }

    const isProfileModified = () => {
        return role !== roleOriginal;
    };


    // Gets the user_id of user currently logged In from cookies
    // Current user can't update its own role
    // const getUserFromCookie = () => {
    //     const cookieString = document.cookie
    //         .split('; ')
    //         .find(row => row.startsWith('user='));

    //     if (!cookieString) return null;
    //     try {
    //         const cookieValue = cookieString.split('=')[1];
    //         const decoded = decodeURIComponent(cookieValue);
    //         return JSON.parse(decoded);
    //     } catch (err) {
    //         console.error('Failed to parse user cookie', err);
    //         return null;
    //     }
    // };


    const loggedInUser = user;
    const loggedInUserId = loggedInUser?.user_id;

    const isEditingSelf = Number(user_id) === Number(loggedInUserId);


    return (
        <form onSubmit={handleRoleUpdate} className='absolute bottom-0 hidden xl:flex lg:flex flex-col w-full min-h-[250px] gap-5 bg-[#FFF] p-5 rounded-tr-[15px] rounded-tl-[15px] m-10 border-t-2 border-t-[#2F2F2F] border-r-2 border-r-[#2F2F2F] border-l-2 border-l-[#2F2F2F]'>
            <div className='flex flex-col w-full gap-3 pb-3 border-b-1 border-b-[#CCCCCC]'>
                <div className='flex justify-between w-full'>
                    <label className='self-start text-[24px] text-[#2F2F2F] font-bold'>Update Role</label>
                    <button onClick={goBack} className='cursor-pointer'>Close</button>
                </div>
            </div>

            {user && (
                <div className='flex justify-between w-full gap-4'>
                    <div className='flex flex-col w-full justify-start'>
                        <label className='text-[#595959] text-[14px]'>Firstname</label>
                        <label className='p-2 border-1 border-[#CCCCCC] rounded-[10px] font-bold'>{`${user?.firstname}`}</label>
                    </div>
                    <div className='flex flex-col w-full justify-start'>
                        <label className='text-[#595959] text-[14px]'>Lastname</label>
                        <label className='p-2 border-1 border-[#CCCCCC] rounded-[10px] font-bold'>{user?.lastname}</label>
                    </div>
                    <div className='flex flex-col w-full justify-start'>
                        <label className='text-[#595959] text-[14px]'>{isEditingSelf ? "Role: Can't update role if currently logged In"  : 'Role'}</label>
                        <select disabled={isEditingSelf}  value={role} onChange={(e) => setRole(e.target.value)}
                        className={isEditingSelf ? 'p-2 border-1 border-[#CCCCCC] text-[#CCCCCC] rounded-[10px] font-bold' : 'p-2 border-1 border-[#DC8801] text-[#DC8801] rounded-[10px] font-bold'}>
                            <option value="" disabled hidden>Select a Role</option>
                            <option value="regular">Basic</option>
                            <option value="head_volunteer">Head Volunteer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
            )}

            {updateMessage && (
                <label className="text-[#B5C04A]">{updateMessage}</label>
            )}


            <div className='flex w-full justify-end'>
                <button type='submit' onClick={() => {window.location.reload()}} className={isProfileModified() ? 'bg-[#B5C04A] active:bg-[#CFDA34] p-2 pl-6 pr-6 text-[#FFF] font-bold rounded-[15px] cursor-pointer' : 'hidden'}>Save Changes</button>
            </div>
        </form>
    )
}

export default UpdateRole
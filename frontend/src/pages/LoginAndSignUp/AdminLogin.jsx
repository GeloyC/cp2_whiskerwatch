import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import  axios  from 'axios';
import Cookies from 'js-cookie'
import Login from './Login';
import { useSession } from '../../context/SessionContext';

// TODO: Automatic validator for Head_volunteer/Admin
// Remove Dropdown selection: Head_volunteer => Email, Admin => Username

const AdminLogin = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const { login, refreshSession } = useSession(); 

    const handleAdminLogin = async (event) => {
        event.preventDefault();
        try {
        const response = await axios.post(
            'http://localhost:5000/user/adminlogin',
            { username, password },
            { withCredentials: true }
        );
        const userData = response.data.user;

        if (!userData) {
            setError('Invalid Credentials');
            return;
        }


        if (userData.role === 'admin') {
            login(userData); // Set user in session context
            await refreshSession(); // Refresh session to sync with backend
            navigate('/dashboard');
        } else {
            setError('Account invalid! Only admins can access this page.');
        }
        } catch (err) {
        const errorMessage =
            err.response?.data?.error ||
            err.response?.data?.message ||
            'Login Failed: Incorrect Username or Password';
        setError(errorMessage);
        console.error('Login error:', errorMessage);
        }
    };
    
    

    return (
        <div className='flex items-center justify-center xl:grid lg:grid md:flex xl:grid-cols-[60%_40%] lg:grid-cols-[60%_40%] xl:place-items-center md:items-center md:justify-center h-screen overflow-hidden'>
            <div className='hidden xl:block xl:items-center lg:block lg:items-center md:hidden box-border w-full h-full object-cover overflow-hidden'>
                <img src="/assets/stray-cat.jpg" alt="stray-cat" className='w-full h-full object-cover'/>
            </div>
            <div className='flex flex-col items-center gap-10 w-100% min-w-[200px] h-auto p-15'> 
                <div className='max-w-[250px]'>
                    <img src="/assets/whiskerwatchlogo-vertical.png" alt="" />
                </div>
                <form onSubmit={handleAdminLogin} className='flex flex-col items-center gap-8'>
                    <label className='text-[#2F2F2F] text-[24px] font-bold'> Admin Login </label>
                    <input type="text" placeholder='Username' value={username} onChange={(event) => setUsername(event.target.value)} className='border-b-2 border-b-[#977655] p-2' />
                    <input type="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} className='border-b-2 border-b-[#977655] p-2' />

                    <div className='flex gap-2'>
                        <button className='bg-[#DC8801] text-[#FFF] w-30 text-center p-2 rounded-[25px] cursor-pointer active:bg-[#977655]'> Log In </button>
                        <Link to="/login" replace className='border-2 border-[#DC8801] text-[#DC8801] w-30 text-center p-2 rounded-[25px] active:bg-[#977655] active:text-[#FFF] active:border-[#977655]'> Cancel </Link>
                    </div>
                </form>
                    {error && (
                    <div className='mb-4 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]'>
                        {error}
                    </div>
                    )}
            </div>
        </div> 
    )
}

export default AdminLogin
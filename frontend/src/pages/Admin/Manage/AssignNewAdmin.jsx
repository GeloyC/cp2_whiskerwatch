import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const AssignNewAdmin = () => {
    const url = `https://whiskerwatch-0j6g.onrender.com`;
    

    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${url}/admin/manage/non_admin`);

                setUsers(response.data);
                response.data.forEach(user => console.log(user.email));
            } catch (err) {
                console.error('Error fetching user data: ', err.response?.data || err.message);
            }
        }
        fetchUsers();
    }, []);


    const assignAdmin = async (event, user_id) => { 
        event.preventDefault();
        try {
            const response = await axios.patch(`${url}/admin/manage/update_admin`, {
                user_id,  // <-- send in body here
            });
            console.log('Update success:', response.data);

            setUsers((prev) => prev.filter((user) => user.user_id !== user_id));
            window.location.reload();
        } catch (err) {
            console.error('Update failed:', err.response?.data || err.message);
        }
    };


    const filteredItems = users.filter((user) =>
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div className='absolute bottom-0 hidden xl:flex lg:flex flex-col w-full min-h-[300px] bg-[#FFF] gap-5 p-5 pb-10 rounded-tr-[15px] rounded-tl-[15px] m-10 border-t-2 border-t-[#2F2F2F] border-r-2 border-r-[#2F2F2F] border-l-2 border-l-[#2F2F2F]'>
            <div className='flex flex-col w-full gap-3 pb-3 border-b-1 border-b-[#595959]'>
                <div className='flex justify-between w-full'>
                    <label className='self-start text-[24px] text-[#2F2F2F] font-bold'>Assign New Admin</label>
                    <button onClick={() => window.location.href = '/adminlist'} className='cursor-pointer'>Close</button>
                </div>

            </div>

            <div className='flex w-full justify-start gap-2 '>
                <input type="search"  placeholder='Search for a canditate'
                value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                className='p-2 border-1 border-[#a3a3a3] rounded-[10px] w-full'/>
                <button type='button' 
                className='cursor-pointer p-2 pl-4 pr-4 rounded-[25px] bg-[#DC8801] active:bg-[#feaf2f] text-[#FFF] font-bold'>Search</button>
            </div>

            <div className='flex flex-col gap-2 w-full h-auto'>

                {filteredItems.map((user) => (
                    <div key={user.user_id} className='flex items-center justify-start w-full gap-2'>
                        <div className='flex items-center w-auto gap-10 p-2 border-1 border-[#CCCCCC] rounded-[10px]'>
                        <div className='flex items-center gap-3'>
                            <label className='text-[#595959] text-[14px]'>Name: </label>
                            <label className='font-bold'>{`${user.firstname} ${user.lastname}`}</label>
                        </div>

                        <div className='flex items-center gap-3'>
                            <label className='text-[#595959] text-[14px]'>Email:</label>
                            <label className='font-bold'>{user.email}</label>
                        </div>
                        </div>
                        <button
                        onClick={(e) => assignAdmin(e, user.user_id)}
                        className='cursor-pointer bg-[#2F2F2F] active:bg-[#595959] text-[#FFF] w-[100px] p-2 border-1 rounded-[15px]'
                        >
                        Assign
                        </button>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default AssignNewAdmin



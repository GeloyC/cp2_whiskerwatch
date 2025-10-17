import React, { useState, useEffect } from 'react'
import CatBot from '../components/CatBot'
import NavigationBar from '../components/NavigationBar'
import Footer from '../components/Footer'
import axios from 'axios'

const WhiskerLeaderboard = () => {

    const url = `https://whiskerwatch-0j6g.onrender.com`;
    const [whiskerLeaders, setWhiskerleader] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const response = await axios.get(`${url}/whisker/leaderboard`)
            setWhiskerleader(response.data)
            console.log('WhiskerMeter Leaderboard data: ', response.data)
        }

        fetchLeaderboard();
    }, []);

    return (
        <div className='flex flex-col w-full h-screen'>
            <CatBot
                message={
                    "Welcome to the WhiskerWatch Leaderboard! See who's leading the way in making a difference for our furry friends!"
                }
            />

            <NavigationBar />
                <div className='flex flex-col items-center justify-start gap-2 h-full p-10'> 
                    <div className='flex flex-col items-center w-[1000px] p-5 bg-[#FFFCF6] rounded-[10px] gap-4'>
                        <label className='text-3xl text-[#2F2F2F] font-bold'>WHISKMETER LEADERBOARD</label>

                        <div className='flex flex-col gap-2 w-full items-start py-3 border-t-2 border-dashed border-[#CCCCCC]'>
                            <table className='flex flex-col w-full'>
                                <thead>
                                    <tr className='grid grid-cols-3 w-full place-items-start p-2'>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Points</th>
                                    </tr>
                                </thead>
                                <tbody className='max-h-[400px] overflow-y-scroll scrollbar-thin'>
                                    {whiskerLeaders.map((leaders, index) => (
                                        <tr className='grid grid-cols-3 w-full place-items-start bg-[#C2CB6A] p-2 rounded-[5px]'>
                                            <td>{index + 1}</td>
                                            <td>{`${leaders.firstname} ${leaders.lastname}`}</td>
                                            <td className='font-bold'>{`${leaders.points} points`}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            <Footer />
        </div>
    )
}

export default WhiskerLeaderboard
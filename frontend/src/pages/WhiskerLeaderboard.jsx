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
            try {
                const response = await axios.get(`${url}/whisker/leaderboard`)
                setWhiskerleader(response.data)
                console.log('WhiskerMeter Leaderboard data: ', response.data)
            } catch(err) {
                console.error('Failed to fetch leaderboard data: ', err);
            }
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
                <div className='flex flex-col items-center justify-start gap-2 h-full xl:p-10 lg:p-10 md:p-5'> 
                    <div className='flex flex-col items-center xl:w-[1000px] lg:w-[1000px] md:w-[800px] w-full h-full xl:h-fit lg:h-fit md:h-fit p-5 bg-[#FFFCF6] rounded-[10px] gap-4'>
                        <div className='flex items-center justify-between w-full'>
                            <div className='size-15'>
                                <img src="/assets/icons/medal.png" alt="" />
                            </div>

                            <label className='text-3xl text-center text-[#889132] font-bold'>
                                WHISKMETER LEADERBOARD
                            </label>

                            <div className='size-15'>
                                <img src="/assets/icons/medal.png" alt="" />
                            </div>
                        </div>

                        <div className='flex flex-col gap-2 w-full min-h-full items-start py-3'>
                            <table className='flex flex-col w-full'>
                                <thead>
                                    <tr className='grid grid-cols-[15%_30%_30%_25%] w-full place-items-start p-2'>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Badge</th>
                                        <th>Points</th>
                                    </tr>
                                </thead>
                                <tbody className='xl:max-h-[400px] lg:max-h-[400px] md:max-h-[400px] overflow-y-scroll scrollbar-thin flex flex-col gap-1'>
                                    {whiskerLeaders.map((leaders, index) => (
                                        <tr className='grid grid-cols-[15%_30%_30%_25%] w-full place-items-center justify-items-start p-2 rounded-[5px] bg-[#F9F7DC] border-1 border-dashed border-[#8f8f8f]'>
                                            <td className='font-bold'>{index + 1}</td>
                                            <td>{`${leaders.firstname} ${leaders.lastname}`}</td>
                                            <td>{leaders.badge}</td>
                                            <td className='font-bold bg-[#94b946] py-1 px-3 rounded-[10px]'>{`${leaders.points} points`}</td>
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
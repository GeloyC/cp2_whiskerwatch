import React, { useState, useEffect } from 'react'
import CatBot from '../components/CatBot'
import NavigationBar from '../components/NavigationBar'
import Footer from '../components/Footer'

const WhiskerLeaderboard = () => {

    const [whiskerLeaders, setWhiskerleader] = useState([]);


    return (
        <div className='flex flex-col h-screen'>
            <CatBot
                message={
                    "Welcome to the WhiskerWatch Leaderboard! See who's leading the way in making a difference for our furry friends!"
                }
            />

                <div className='flex flex-col items-center gap-2 w-full h-full'> 
                    <NavigationBar />

                    <label htmlFor=""></label>

                </div>
            <Footer />
        </div>
    )
}

export default WhiskerLeaderboard
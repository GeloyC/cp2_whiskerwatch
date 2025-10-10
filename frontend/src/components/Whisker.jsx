import React, { useState, useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Whisker = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;

  const [whiskerVisible, setWhiskerVisible] = useState(true);
  const { user, whiskerUpdateTrigger } = useSession();
  const [points, setPoints] = useState(0);
  const MAX_POINTS = 500;

  useEffect(() => {
    const fetchWhiskerPoints = async () => {
      if (!user?.user_id) return;
      try {
        const response = await axios.get(`${url}/whisker/whiskermeter/${user.user_id}`);
        setPoints(response.data.points);
        
        console.log(points)
      } catch (err) {
        console.error('Failed to fetch whisker points:', err);
      }
    };

    fetchWhiskerPoints();
  }, [user, whiskerUpdateTrigger]);


  const handleWhiskerVisibility = () => {
    setWhiskerVisible((prev) => !prev);
  };

  const progressHeightPercent = Math.min((points / MAX_POINTS) * 100, 100);

  return (
    <div
      onClick={handleWhiskerVisibility}
      className={`flex fixed left-5 bottom-5 z-999 flex-col ${whiskerVisible ? 'items-start' : 'items-center'}  bg-[#F9F7DC] p-3 border-dashed border-2 border-[#DC8801] rounded-[30px] transition-all duration-300
        ${whiskerVisible ? 'w-[70px]' : `${points === 0 ? 'w-[300px]' : 'w-[250px]'} `} `}
    >
      
        {/* Content of WhiskerMeter */}
        <div className={`flex w-full rounded-br-[25px]  gap-4 ${whiskerVisible ? 'h-[0px]' : 'flex h-auto p-3'} transition-all duration-200`}> 
          { points == 0 && user ? (
            <div className={`flex flex-col relative gap-2 h-60 overflow-hidden text-md leading-tight ${whiskerVisible ? 'h-0 hidden' : 'min-h-[300px] flex'} `}>
              <span className='font-bold whitespace-nowrap'>How the WhiskerMeter works</span>

              <div className='flex flex-col h-full gap-3 justify-start'>
                <div className='flex flex-col text-sm gap-1'>
                  <div className='flex flex-row gap-2 items-start'>
                    <span className='size-5 text-center rounded-full bg-[#DC8801] text-[#FFF] font-bold'>1</span>
                    <span className='font-bold whitespace-nowrap'>Engage with the community</span>
                  </div>

                  <span className='pl-7 leading-tight'>
                    You can do this through donating, becoming a feeder, submitting a feeding report and adopting a cat.
                  </span>
                </div>

                <div className='flex flex-col text-sm gap-1'>
                  <div className='flex flex-row gap-2 items-start'>
                    <span className='size-5 text-center rounded-full bg-[#DC8801] text-[#FFF] font-bold'>2</span>
                    <span className='font-bold whitespace-nowrap'>Earn WhiskerPoints</span>
                  </div>

                  <span className='pl-7 leading-tight'>
                    Each verified activity adds to your total WhiskerPoints.
                  </span>
                </div>

                <div className='flex flex-col text-sm gap-1'>
                  <div className='flex flex-row gap-2 items-start'>
                    <span className='size-5 text-center rounded-full bg-[#DC8801] text-[#FFF] font-bold'>3</span>
                    <span className='font-bold whitespace-nowrap'>Earn WhiskerPoints</span>
                  </div>

                  <span className='pl-7 leading-tight'>
                    As your points grow, you'll unlock new WhiskerMeter tiers that is visible on your <Link to='/profile' className='underline font-bold text-[#DC8801]'>Profile</Link>
                  </span>
                </div>
              </div>
            </div>
          ) : points === 0 && !user  ? (
            <div className={`flex flex-col relative gap-2 h-60 overflow-hidden text-md leading-tight ${whiskerVisible ? 'h-0 hidden' : !user ? 'min-h-[400px]' : 'min-h-[300px] flex'} `}>
              <span className='font-bold whitespace-nowrap'>How the WhiskerMeter works</span>

              <div className='flex flex-col h-full gap-3 justify-start'>
                <div className='flex flex-col text-sm gap-1'>
                  <div className='flex flex-row gap-2 items-start'>
                    <span className='size-5 text-center rounded-full bg-[#DC8801] text-[#FFF] font-bold'>1</span>
                    <span className='font-bold whitespace-nowrap'>Create your profile</span>
                  </div>

                  <span className='pl-7 leading-tight'>
                    <Link to='/signup' className='font-bold text-[#DC8801] underline'>Sign up</Link> or <Link to='/login' className='font-bold text-[#DC8801] underline'>Log in</Link>
                    <span> to WhiskerWatch to activate your WhiskerMeter</span>
                  </span>
                </div>
                <div className='flex flex-col text-sm gap-1'>
                  <div className='flex flex-row gap-2 items-start'>
                    <span className='size-5 text-center rounded-full bg-[#DC8801] text-[#FFF] font-bold'>2</span>
                    <span className='font-bold whitespace-nowrap'>Engage with the community</span>
                  </div>

                  <span className='pl-7 leading-tight'>
                    You can do this through donating, becoming a feeder, submitting a feeding report and adopting a cat.
                  </span>
                </div>

                <div className='flex flex-col text-sm gap-1'>
                  <div className='flex flex-row gap-2 items-start'>
                    <span className='size-5 text-center rounded-full bg-[#DC8801] text-[#FFF] font-bold'>3</span>
                    <span className='font-bold whitespace-nowrap'>Earn WhiskerPoints</span>
                  </div>

                  <span className='pl-7 leading-tight'>
                    Each verified activity adds to your total WhiskerPoints.
                  </span>
                </div>

                <div className='flex flex-col text-sm gap-1'>
                  <div className='flex flex-row gap-2 items-start'>
                    <span className='size-5 text-center rounded-full bg-[#DC8801] text-[#FFF] font-bold'>4</span>
                    <span className='font-bold whitespace-nowrap'>Earn WhiskerPoints</span>
                  </div>

                  <span className='pl-7 leading-tight'>
                    As your points grow, you'll unlock new WhiskerMeter tiers that is visible on your profile
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={`flex relative min-w-3 h-60 bg-[#FFF] border-4 border-[#FFF] rounded-full overflow-hidden ${whiskerVisible ? 'h-0 hidden' : 'min-h-auto flex'} shadow-lg`}>
                <div className='flex flex-col items-center justify-evenly h-full'>
                  <div className='w-[15px] object-fit'>
                    <img src="/assets/icons/divider_line.png" alt="" className='w-full object-cover'/>
                  </div>
                  <div className='w-[15px] object-fit'>
                    <img src="/assets/icons/divider_line.png" alt="" className='w-full object-cover'/>
                  </div>
                  <div className='w-[15px] object-fit'>
                    <img src="/assets/icons/divider_line.png" alt="" className='w-full object-cover'/>
                  </div>
                  <div className='w-[15px] object-fit'>
                    <img src="/assets/icons/divider_line.png" alt="" className='w-full object-cover'/>
                  </div>
                </div>

                <div
                  className={`absolute bottom-0 w-full bg-[#B5C04A] rounded-full ${whiskerVisible ? 'hidden' : 'flex'}`}
                  style={{ height: `${progressHeightPercent}%` }}
                ></div>
              </div>
              
              {/* Badge labal */}
              {!whiskerVisible && (
                <div className={"grid grid-rows-5 justiy-items-start w-full text-[#2F2F2F] text-[14px] font-bold overflow-hidden whitespace-nowrap"}>
                  <label className={`flex items-center gap-5 `}>
                      <div className="w-[15px] h-[15px] object-contain">
                          <img src="/assets/icons/whisker_arrow.png" alt="Arrow icon" className="w-full h-full object-cover rotate-180" />
                      </div>
                      The Catnip Captain
                  </label>
                  <label className={`flex items-center gap-5 `}>
                      <div className="w-[15px] h-[15px] object-contain">
                          <img src="/assets/icons/whisker_arrow.png" alt="Arrow icon" className="w-full h-full object-cover rotate-180" />
                      </div>
                      Meowtain Mover
                  </label>
                  <label className={`flex items-center gap-5`}>
                      <div className="w-[15px] h-[15px] object-contain">
                          <img src="/assets/icons/whisker_arrow.png" alt="Arrow icon" className="w-full h-full object-cover rotate-180" />
                      </div>
                      Furmidable Friend
                  </label>
                  <label className={`flex items-center gap-5`}>
                      <div className="w-[15px] h-[15px] object-contain">
                          <img src="/assets/icons/whisker_arrow.png" alt="Arrow icon" className="w-full h-full object-cover rotate-180" />
                      </div>
                      Snuggle Scout
                  </label>
                  <label className={`flex items-center gap-5`}>
                      <div className="w-[15px] h-[15px] object-contain">
                          <img src="/assets/icons/whisker_arrow.png" alt="Arrow icon" className="w-full h-full object-cover rotate-180" />
                      </div>
                      Toe Bean Trainee
                  </label>
                </div>
              )}
            </>
          )}
          {/* Progress Bar */}
        </div>
    

      <div className={`flex items-center justify-between bg-[#DC8801] p-2 h-auto rounded-[50px] transition-all duration-200 overflow-hidden
        ${whiskerVisible ? 'w-fit h-auto rounded-[50px]' : 'w-full rounded-[50px]'}`}>
        <div className='flex flex-col'>
          <label  className={`font-bold text-[14px] text-[#FFF] overflow-hidden whitespace-nowrap ${whiskerVisible ? 'opacity-0 hidden' : 'opacity-100'}`}>
            The WhiskerMeter
          </label>
          <span className={whiskerVisible ? 'text-[#FFF] text-[13px]' : 'hidden'}>
            You have {points} points. 
          </span>
        </div>
        <div className="size-6 object-contain">
          <img src="/assets/paw2.png" alt="Paw icon" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Whisker;




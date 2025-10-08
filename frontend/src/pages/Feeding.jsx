import React, { use } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom';

import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import SideNavigation from '../components/SideNavigation';
import HeadVolunteerSideBar from "../components/HeadVolunteerSideBar";
import CatBot from '../components/CatBot';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

import { useSession } from '../context/SessionContext'
import Whisker from '../components/Whisker';


const Feeding = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const { user } = useSession();
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  const [interestReason, setInterestReason] = useState('');
  const [experienceDetails, setExperienceDetails] = useState('');
  const [feedingDay, setFeedingDay] = useState('');
  const [concernReason, setConcernReason] = useState('');
  const [error, setError] = useState('');

  const [feedingExperience, setfeedingExperience] = useState('');
  const [feedingSchedule, setFeedingSchedule] = useState('')

  const [submitMessage, setSubmitMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExpSelected = (value) => setfeedingExperience(value);
  const handleSchedSelected = (value) => setFeedingSchedule(value);

  const [feedingDate, setFeedingDate] = useState('');
  const [isFeedingDatePassed, setIsFeedingDatePassed] = useState(false);
  const [hasSubmittedReport, setHasSubmittedReport] = useState(false);


  

  const printRef = React.useRef(null);

  // TODO: Create a BEFORE/DURING STATE OF THIS PAGE
  // BEFORE: Display Feeding form
  // DURING: Display 1. Feeding Map, 2. Feeding Schedule. 
  // DURING: Allow user to write a report of their feeding experience

  // Admin Side: Display - User Report

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${url}/user/profile`, {
          withCredentials: true,
        });

        setUserData(response.data); // Store user data
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError(err.response?.data?.error || 'Failed to fetch user data');
      }
    };
    fetchUser();
  }, []);
  

  const generateFeedingForm = async  () => {
    if (
      !interestReason.trim() ||
      !feedingExperience ||
      (feedingExperience === 'Yes' && !experienceDetails.trim()) ||
      !feedingDay ||
      !feedingSchedule ||
      (feedingSchedule === 'No' && !concernReason.trim())
    ) {
      setError('*Please complete all questions before submitting the form.');
      return;
    }

    if (!userData || !userData.user_id) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    const element = printRef.current
    if (!element) { return };

    const canvas = await html2canvas(element, { scale: 2 });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    const pdfBlob = pdf.output('blob');
    // pdf.save('feeding-form.pdf');

    const formData = new FormData();
    const filename = `feeding-form-${userData.firstname}-${userData.lastname}.pdf`;

    formData.append('file', pdfBlob, filename);
    formData.append('user_id', userData.user_id);

    try {
      await axios.post(`${url}/user/feeding/form`, formData, {
        headers: {'Content-Type': 'multipart/form-data' },
      });

      setSubmitMessage('You successfully submitted your application!\nPlease wait for approval. Thank you!');
    } catch (err) {
        if (err.response && err.response.status === 409) {
          const errorMsg = err.response.data?.error;

          if (errorMsg.includes('pending application')) {
            setError('You already have a pending application. Please wait for it to be processed.');
          } else if (errorMsg.includes('approved volunteer')) {
            setError('You already have an approved volunteer application. Please wait until it expires before applying again.');
          } else {
            setError(errorMsg || 'Conflict occurred. Please try again later.');
          }
        } else {
          setError('Your submission failed. Please try again.');
        }
      // console.error('Submission failed:', err);
    } finally {
      setLoading(false);
    }
  }

  const fetchFeedingDate = async () => {
    if (!user?.user_id) return;

    try {
      const response = await axios.get(`${url}/admin/feeding_date/${user.user_id}`);
      const dateString = response.data.feeding_date; // Format: 'YYYY-MM-DD'
      const { has_report } = response.data;

      setFeedingDate(dateString);
      setHasSubmittedReport(has_report);

      // Append 8:00 PM time manually
      const feedingDateTime = new Date(`${dateString}T20:00:00`);
      const now = new Date();

      if (feedingDateTime < now) {
        setIsFeedingDatePassed(true);
      } else {
        setIsFeedingDatePassed(false);
      }

    } catch (err) {
      console.error('Failed to fetch feeding date.');
    }
  };

  useEffect(() => {
    const fetchVolunteerData = async () => {
      if (!user?.user_id) return;

      try {
        const response = await axios.get(`${url}/admin/feeding_date/${user.user_id}`);
        const feedingData = response.data;

        const reportResponse = await axios.get(`${url}/user/has_report/${user.user_id}`);
        const { hasReport } = reportResponse.data;

        setFeedingDate(feedingData.feeding_date);
        setHasSubmittedReport(hasReport); // this controls your "thank you" message

      } catch (err) {
        console.error('Failed to fetch volunteer or report data.');
      }
    };

    fetchVolunteerData();
  }, [user]);




  useEffect(() => {
    fetchFeedingDate();
  }, [user]);

  useEffect(() => {
    if (location.state?.reportSubmitted) {
      setHasSubmittedReport(true)
    }
  }, [location.state]);



  
  return (
    <div className='flex flex-col min-h-screen'>
      <CatBot message={!feedingDate ? `You can change a cat's day — and maybe their life. As a feeding volunteer, you'll help provide comfort, care, and love to cats waiting for their forever homes. Join us and make your kindness count!` : `Welcome back ${user?.firstname}!`}/>
      <NavigationBar />

      <Whisker />

      <div className='flex flex-col h-full w-full'>
        <div className='flex flex-col justify-center'> 
          <div className='flex flex-col min-h-screen gap-3'>
            <div className={`relative flex flex-col items-center w-auto rounded-[25px] ${!feedingDate ? 'gap-3' : 'gap-0 xl:gap-3 lg:gap-3'} xl:py-10 lg:py-10`}>

              {!feedingDate ? (
                <div className='hidden xl:flex lg:flex xl:flex-row lg:flex-row lg:w-[875px] gap-2 w-fit'> {/* HEADER STATE BEFORE FEEDERS FORM */}
                    <div className='flex flex-row justify-between items-center p-3 bg-[#FFF] rounded-[15px]'>
                        <label className='font-bold text-[#DC8801]'>Feeders Form</label>
                        <div className='flex items-center justify-center w-[30px] h-auto'> 
                            <img src="/assets/icons/clipboard-white.png" alt="white clipboard" className='w-full h-auto '/>
                        </div>
                    </div>
    
                    <div className='flex flex-row justify-between items-center p-3 border-dashed border-2 border-[#DC8801] rounded-[15px]'>
                        <label className='text-[#DC8801]'>Please answer the following questions to submit a request and become a part of the feeders team!</label>
                    </div>
                </div>

              ) : (
                <div className='flex flex-col gap-3 w-full xl:w-[875px] lg:w-[875px]'> {/* HEADER STATE DURING FEEDERS FORM */}
                    <div className='flex flex-row justify-between items-center p-3 bg-[#FFF] xl:rounded-[10px] lg:rounded-[10px] border-b-2 border-dashed border-b-[#bababa] xl:border-none lg:border-none'>
                        <label className='font-bold text-[#DC8801]'>Feeding Info</label>
                        <div className='flex items-center justify-center w-[30px] h-auto'> 
                            <img src="/assets/icons/clipboard-white.png" alt="white clipboard" className='w-full h-auto '/>
                        </div>
                    </div>
                </div>
              )}

              {!feedingDate && (
                <div className='xl:hidden lg:hidden flex flex-col flex-col bg-[#FFF] w-screen h-screen items-center justify-center'>
                  <label className='text-2xl text-[#2F2F2F] text-center'>Unable to access the feeding form</label>
                  <label className='text-[#8f8f8f] text-center'>You can access the form on larger screen size such as desktop/laptop screens</label>
                </div>
              )}

  
              {/* -------------------- CONTENT --------------------- */}

              {/* FEEDING FORM STATE DURING/BEFORE APPLICATION */}
              {!feedingDate ? (
                !submitMessage ? (
                  <form ref={printRef} className='xl:flex xl:flex-col lg:flex lg:flex-col justify-center gap-8 p-5 bg-[#FFF] rounded-[15px] xl:w-[875px] lg:w-[875px] md:hidden sm:hidden h-fit'>
                    <div className='flex flex-col gap-2'>
                      <label>1. Why are you interested in becoming a feeder for the Siera Park Residences Cat Community?</label>
                      <textarea placeholder='Answer here' rows={5} value={interestReason} onChange={(e) => setInterestReason(e.target.value)}
                      className='p-2 border-1 border-[#252525] rounded-[8px] resize-none'></textarea>
                    </div>
      
                    <div className='flex flex-col gap-2'>
                      <label>2. Do you have any prior experience with feeding or caring for stray cats or community animals?</label>
                      <div className='flex flex-row gap-2'>
                        <label htmlFor="feedingYes" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                          <input type="radio" name="feedingExp" id="feedingYes" value="Yes"
                          checked={feedingExperience === 'Yes'}
                          onChange={() => handleExpSelected('Yes')}/>
                          Yes
                        </label>
                        <label htmlFor="feedingNo" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                          <input type="radio" name="feedingExp" id="feedingNo" value="No"
                          checked={feedingExperience === 'No'} onChange={() => handleExpSelected('No')}
                          />
                          No
                        </label>
                      </div>
                      {feedingExperience === 'Yes' && (
                        <div className={feedingExperience === 'No' ? 'hidden' : 'flex flex-col'}>
                          <label htmlFor="feedingDescribe">if <strong>Yes</strong>, please describe your experience to us.</label>
                    
                        <textarea name="" id="feedingDescribe" placeholder='Answer here' rows={5}
                        value={experienceDetails} onChange={(e) => setExperienceDetails(e.target.value)}
                        className={'p-2 border-1 border-[#252525] rounded-[8px] resize-none'}></textarea>
                        </div>
                      )}
                      
                    </div>
      
                    <div className='flex flex-col gap-2'> 
                      <label htmlFor="">3. Which day of the week can you commit to feeding the cats?</label>
                      <div className='flex flex-row gap-2'>
      
                        <select name="feedingDay" id="feedingDay" value={feedingDay} onChange={(e) => setFeedingDay(e.target.value)}
                        className='flex items-center justify-center border-1 border-[#A3A3A3] rounded-[10px]'>
                          <option hidden>Select a day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
      
                        <label className='text-[14px] text-[#626262] italic leading-tight'>(There's no guarantee that day you choose will be your feeding day due to other active feeders. Coordinate with the Head volunteers for this matter.)</label>
                      </div>
                    </div>
      
                    <div className='flex flex-col gap-4'>
                      <label>4. Feeding typically begins at 8:00 pm and may continue late into the evening. Are you comfortable with this schedule? </label>
                      <div className='flex flex-row gap-2'>
                          <label htmlFor="eveningYes" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                            <input type="radio" name="feedingNight" id="eveningYes" value="Yes"
                            checked={feedingSchedule === 'Yes'} onChange={() => handleSchedSelected('Yes')}/>
                            Yes
                          </label>
                          <label htmlFor="eveningNo" className='flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]'>
                            <input type="radio" name="feedingNight" id="eveningNo" value="No"
                            checked={feedingSchedule === 'No'} onChange={() => handleSchedSelected('No')}/>
                            No
                          </label>
                      </div>
                      <div className={feedingSchedule === 'No' ? 'flex flex-col' : 'hidden'}>
                        <label htmlFor="nightFeedConcern">if <strong>No</strong>, please explain if you have any concerns.</label>
                        <textarea  id="nightFeedConcern" placeholder='Answer here' rows={5} 
                        value={concernReason} onChange={(e) => setConcernReason(e.target.value)}
                        className='p-2 border-1 border-[#252525] rounded-[8px] resize-none'></textarea>
                      </div>
                    </div>
                      {error && (
                        <label className='font-[14px] italic text-[#DC8801]'>{error}</label>
                      )}
                  </form>
                ) : (
                  <div className='flex items-center justify-center p-5 bg-[#FFF] rounded-[15px] w-full xl:w-[875px] lg:w-[875px] h-full'>
                    {error ? (
                      <label className='font-[14px] italic text-[#DC8801]'>{error}</label>
                    ) : (
                      <label className='text-[#DC8801] text-center '>{submitMessage}</label>
                    )}
                  </div>
                )

              ) : (
                <div className='flex flex-col justify-center gap-3 rounded-[15px] w-full xl:w-[875px] lg:w-[875px] bg-[#FFF] h-full'>
  
                  {/* CONTENT SECTION FOR FEEDER INFO */}
                  <div className='flex flex-col items-center justify-start gap-2 w-full xl:h-auto lg:h-auto h-screen bg-[#FFF] px-5 py-10 rounded-[15px]'>
                    <label className='text-[20px] text-[#2F2F2F] pb-2 font-bold text-center'>
                      {!isFeedingDatePassed & !hasSubmittedReport ? `Hi ${`${user?.firstname} ${user?.lastname}`}, here's what you need to know ahead of your feeding schedule.` : `Hey ${user?.firstname} ${user.lastname}, glad to have you. We're looking forward to our next feeding schedule with you!`}
                    </label>
  
                    <div className='w-full h-auto overflow-hidden object-fit rounded-[10px] pb-5'>
                      {/* INSERT CAT IMAGE HERE FOR VISUAL */}
                      <img src="/assets/image/WhiskerWatch-FeedingMap 1.png" alt="feeding_map" className='w-full h-full object-cover'/>
                    </div>
                    
                    
                    {!isFeedingDatePassed ? (
                      <div className='flex flex-col gap-2 w-full items-start'>
                        <p>Congratulations, your feeding application is approved! </p>
                        <p className='px-4 py-2 border-2 border-dashed border-[#94b946] bg-[#dce1a9] text-[#889132] rounded-[10px]'> Your given feeding schedule is at {feedingDate}.</p>
                      </div>
                    ) : (
                      <div className='flex flex-col gap-4'>
                        {hasSubmittedReport ? (
                          <div className='flex flex-col justify-center w-fit gap-4 rounded-[10px]'>
                            <p>
                              Thank you so much for Submitting a report for your recent feeding schedule ({feedingDate}). We appreciate your feedback.
                            </p>
                            <label className='bg-[#E3E697] p-2 pl-4 pr-4 rounded-[10px] text-[#6b7228] border-dashed border-2 border-[#99A339]'>
                                We're looking forward for another feeding session with you, just wait for your next feeding schedule to be updated. Thank you!
                            </label>
                          </div>
                        ) : (
                          <div className='flex flex-col justify-center w-fit gap-4 rounded-[10px]'>
                            <p>
                              Thank you so much for being part of WhiskerWatch feeding volunteers. Your support means a lot to us, and we know that our furry friend will appreciate the love. 
                            </p>
                            <label className='bg-[#E3E697] p-2 pl-4 pr-4 rounded-[10px] text-[#6b7228] border-dashed border-2 border-[#99A339]'>
                                Please wait for your next feeding schedule.
                            </label>
                          </div>
                        )}

                        {!hasSubmittedReport ? (
                          <Link
                            to={`/feeding/feedingreport/${user?.user_id}`}
                            className={'w-fit self-end bg-[#DC8801] text-[#FFF] font-bold p-2 rounded-[10px] cursor-pointer hover:scale-102 active:scale-98 transition-all duration-100'}
                          >
                            Write a Feeding Report
                          </Link>
                        ) : (
                          <div className='flex flex-col w-full justify-end'>
                            <button disabled
                              className={'w-fit self-end bg-[#2F2F2F] opacity-50 cursor-not-allowed text-[#FFF] font-bold p-2 rounded-[10px]'}
                            >
                              Write a Feeding Report
                            </button>
                            <p className='text-[#8f8f8f] text-[12px] w-fit self-end'>
                              You've already submitted a report for your recent feeding.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              )}
              {(interestReason || feedingExperience || feedingDay || feedingSchedule) && !submitMessage && (
                <div className='flex gap-2 justify-end items-center'>  
                  <button 
                    type='button' 
                    onClick={generateFeedingForm}
                    disabled={loading}
                    className={`self-end cursor-pointer w-auto text-center font-bold p-2 pl-5 pr-5 rounded-[15px]
                      ${loading ? 'bg-gray-400' : 'bg-[#B5C04A] hover:bg-[#CFDA34] active:bg-[#B5C04A]'} 
                      text-white`}>
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              )}
            </div>

            <Outlet />
              


          </div>
        </div>

        {/* <SideNavigation /> */}

      </div>
      <Footer />
    </div>

  )
}

export default Feeding
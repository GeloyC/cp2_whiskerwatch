
import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import SideNavigation from '../components/SideNavigation';
import HeadVolunteerSideBar from '../components/HeadVolunteerSideBar';
import Footer from '../components/Footer';
import CatBot from '../components/CatBot'
import Whisker from '../components/Whisker';

import { useSession } from '../context/SessionContext';
import axios from 'axios';



const Donate = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;

  const { user, fetchNotifications , triggerWhiskerUpdate} = useSession();

  const [donateItem, setDonateItem] = useState({
    money: false,
    food: false,
    item: false,
    other: false
  });

  const [screenshotImage, setScreenshotImage] = useState();
  const [screenshotName, setScreenshotName] = useState(); 
  const [moneyAmount, setMoneyAmount] = useState('');

  const [foodType, setFoodType] = useState('');
  const [foodQuantity, setFoodQuantity] = useState(1);
  const [foodDescription, setFoodDescription] = useState('');

  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1)

  const [othersDescription, setOthersDescription] = useState('');
  const [otherQuantity, setOtherQuantity] = useState(1)

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('')
  const [screenshotFile, setScreenshotFile] = useState(null);


  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { id } = e.target;
    setDonateItem(prev => ({
      ...prev,
      [id.replace('donate_', '')]: e.target.checked
    }));
  };

  const handleUploadScreenshot = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit in bytes
          alert('File size exceeds 10MB limit. Please upload an image of 10MB or smaller.');
          return;
      }
      const reader = new FileReader();
      reader.onload = () => {
          setScreenshotImage(reader.result);
      };
      setScreenshotFile(file);
      setScreenshotName(file.name);
      reader.readAsDataURL(file);
    }
  }

  const addFoodQuantity = () => { setFoodQuantity((prev) => parseInt(prev) + 1); }
  const subtractFoodQuantity = () => { setFoodQuantity((prev) => Math.max(1, parseInt(prev) - 1)); }

  const addItemQuantity = () => { setItemQuantity((prev) => parseInt(prev) + 1); }
  const subtractItemQuantity = () => { setItemQuantity((prev) => Math.max(1, parseInt(prev) - 1)); }

  const addOtherQuantity = () => { setOtherQuantity((prev) => parseInt(prev) + 1); }
  const subtractOtherQuantity = () => { setOtherQuantity((prev) => Math.max(1, parseInt(prev) - 1)); }
  
  
  const validateForm = () => {
    if (!donateItem.money && !donateItem.food && !donateItem.item && !donateItem.other) {
      setError('Please select at least one donation type.');
      return false;
    }

    if (donateItem.money) {
      if (!moneyAmount || isNaN(moneyAmount) || parseFloat(moneyAmount) <= 0) {
        setError('Please enter a valid amount of money to donate.');
        return false;
      }
      if (!screenshotFile) {
        setError('Please upload a screenshot of the money transaction.');
        return false;
      }
    }

    if (donateItem.food) {
      if (!foodType) {
        setError('Please select a type of food (Wet or Dry).');
        return false;
      }
      if (!foodDescription.trim()) {
        setError('Please provide a description for the food donation.');
        return false;
      }
    }

    if (donateItem.item) {
      if (!itemDescription.trim()) {
        setError('Please provide a description for the item donation.');
        return false;
      }
    }

    if (donateItem.other) {
      if (!othersDescription.trim()) {
        setError('Please provide a description for the other donation.');
        return false;
      }
    }

    setError('');
    return true;
  };


  const handleSubmit = async () => {
    const donationItems = [];

    const isValid = validateForm();
    if (!isValid) return;

    if (donateItem.money) {
      donationItems.push({
        donation_type: 'Money',
        amount: moneyAmount,
        proofImage: screenshotName,
      });
    }

    if (donateItem.food) {
      donationItems.push({
        donation_type: 'Food',
        food_type: foodType,
        quantity: foodQuantity,
        description: foodDescription,
      });
    }

    if(donateItem.item) {
      donationItems.push({
        donation_type: 'Item',
        quantity: itemQuantity,
        description: itemDescription,
      })
    }

    if(donateItem.other) {
      donationItems.push({
        donation_type: 'Other',
        quantity: otherQuantity,
        description: othersDescription,
      })
    }

    const donationPayLoad = {
      donator_id: user.user_id, 
      proofImage: screenshotName,
      items: donationItems,
    };

    console.log("Final donation payload:", donationPayLoad);

    try {
      const formData = new FormData();

      formData.append('donator_id', user.user_id);
      if (screenshotImage) {
        formData.append('proof_image', screenshotFile);
      }
      formData.append('items', JSON.stringify(donationItems));

      const response = await axios.post(`${url}/donate/donation_data`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setSuccessMessage("Thank you for donating! Your support keeps our cats safe, healthy, and loved while they wait for their forever families. We couldn't do this without you!")
      await fetchNotifications(user.user_id)
      triggerWhiskerUpdate();

    } catch(err) {
      console.error('Donation submission failed:', err);
      setError('Donation submission failed. Something went wrong during donation.');
    }
  };



  


  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <CatBot message={"Help us make a difference one paw at a time. Your support keeps our rescue running and our cats safe, healthy, and loved. Every donation, big or small, means the world to them (and to us)!"}/>
      <NavigationBar />
      <Whisker />
      <div className='flex flex-col min-h-screen pb-10 xl:pt-10 lg:pt-10 md:pt-5 sm:pt-0'>
        {/* MAIN CONTENT */}
        <div className='flex flex-col items-start justify-start min-h-screen w-screen xl:w-[900px] lg:w-[900px] md:w-[700px] sm:w-screen'>

          {/* TITLE */}
          <div className='flex flex-col w-full'>
            <div className='flex flex-col '> 
                <div className='bg-[#2F2F2F] w-full flex justify-center p-3 xl:rounded-t-[10px] lg:rounded-t-[10px] md:rounded-t-[10px] sm:rounded-t-[0px]'>
                  <label className='text-[#FFF] text-[18px] font-bold'>DONATION FORM</label>
                </div>
            </div>

            {!successMessage ? (
              <form className='flex flex-col w-auto rounded-[10px] xl:gap-2 lg:gap-2 md:gap-2'>
                <div className='flex flex-col items-center w-full bg-[#DC8801] bg-[url(/assets/background-paws.png)] bg-cover bg-fit bg-repeat  p-5 gap-4'>
                  <label className='text-[#FFF] text-[20px] font-bold leading-tight'> Hey {`${user?.firstname} ${user?.lastname}`}, thinking of Donating?</label>

                  <div className='flex flex-col xl:flex-row lg:flex-row gap-3 w-full rounded-[10px]'>
                    <label htmlFor="donate_money" className='cursor-pointer flex gap-5 p-2 rounded-[10px] bg-[#FFF] w-full'>
                      <input type="checkbox" id='donate_money' 
                        checked={donateItem.money} 
                        onChange={handleCheckboxChange}
                      />
                      Money
                    </label>
                    <label htmlFor="donate_food" className='cursor-pointer flex gap-5 p-2 rounded-[10px] bg-[#FFF] w-full'>
                      <input type="checkbox" id='donate_food' 
                        checked={donateItem.food}
                        onChange={handleCheckboxChange}
                      />
                      Food
                    </label>
                    <label htmlFor="donate_item" className='cursor-pointer flex gap-5 p-2 rounded-[10px] bg-[#FFF] w-full'>
                      <input type="checkbox" id='donate_item' 
                        checked={donateItem.item}
                        onChange={handleCheckboxChange}
                      />
                      Item
                    </label>
                    <label htmlFor="donate_other" className='cursor-pointer flex gap-5 p-2 rounded-[10px] bg-[#FFF] w-full'>
                      <input type="checkbox" id='donate_other' 
                        checked={donateItem.other}
                        onChange={handleCheckboxChange}
                      />
                      Others
                    </label>
                  </div>
                </div>

                {donateItem.money || donateItem.food || donateItem.item || donateItem.other ? (
                  <div className= 'flex flex-col rounded-[10px] w-full'>
                    {donateItem.money && (
                      <div className='flex flex-col w-full gap-1 p-5 bg-[#FFF]'> {/* MONEY WINDOW */}
                        <label className='flex justify-center items-center text-[#2F2F2F] text-[24px] font-bold w-full'>MONEY</label>

                        <div className='xl:grid xl:grid-cols-2 lg:grid lg:grid-cols-2 md:grid md:grid-cols-2 w-full flex flex-col gap-2'>
                          <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2'>
                              <label htmlFor="">Amount of money to donate</label>
                              <input type="number" placeholder='Add amount' value={moneyAmount} onChange={(e) => setMoneyAmount(e.target.value)} required
                              className='p-2 rounded-[10px] border-1 border-[#A3A3A3]'/>
                            </div>
                            <div className='flex flex-col gap-2'>
                              <label className='text-[#595959] text-[14px]'>Upload image of transaction (screenshot of transaction)</label>
                              <div className='flex flex-col items-center w-full p-2 gap-2 border-dashed border-2 border-[#DC8801] rounded-[12px]'>
                                <label htmlFor="screenshot_image" className='cursor-pointer bg-[#DC8801] p-2 rounded-[10px] text-[#FFF] text-center active:bg-[#fea921] w-full'>
                                  Upload Image
                                  <input type="file" id='screenshot_image' accept='image/png, image/jpeg' hidden required
                                  onChange={handleUploadScreenshot}/>
                                </label>
                                <label htmlFor="">{screenshotName}</label>
                              </div>
                            </div>
                          </div>
                          <div className='flex flex-col items-center w-full pb-2'>
                            <label htmlFor="">Scan the QR code to complete the transaction</label>
                            <div className='w-[300px] h-[300px] object-fit rounded-[10px] overflow-hidden'>
                              <img src="/assets/UserProfile/test_qr_code.jpg" alt="qr_code" className='w-full h-full object-cover'/>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {donateItem.food && (
                      <div className='flex flex-col w-full gap-1 p-5 bg-[#FFF] border-t-2 border-dashed border-t-[#bababa]'> {/* FOOD WINDOW */}
                        <label className='flex justify-center items-center text-[#2F2F2F] text-[24px] font-bold w-full'>FOOD</label>
                        <div className='xl:grid xl:grid-cols-2 lg:grid lg:grid-cols-2 md:grid md:grid-cols-2 w-full flex flex-col gap-2'>
                          <div className='flex flex-col gap-4 w-full'>  
                            <div className='flex flex-col w-full gap-2'>
                              <label className='text-[#595959] leading-tight'>Type of food you want to donate</label>
                              <div className='flex gap-2'>
                                <label htmlFor="food_wet" className='flex gap-2 p-2 border-1 border-[#A3A3A3] rounded-[10px] w-full'>
                                  <input type="radio" name="donation_food" id="food_wet" 
                                  checked={foodType === 'Wet'} onChange={() => setFoodType('Wet') }/>
                                  Wet
                                </label>
                                <label htmlFor="food_dry" className='flex gap-2 p-2 border-1 border-[#A3A3A3] rounded-[10px] w-full'>
                                  <input type="radio" name="donation_food" id="food_dry" 
                                  checked={foodType === 'Dry'} onChange={() => setFoodType('Dry') }/>
                                  Dry
                                </label>
                              </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                              <label>Quantity</label>
                              <div className='grid grid-cols-3 rounded-[10px] border-1 border-[#DC8801] w-full overflow-hidden'>
                                <button type='button' onClick={subtractFoodQuantity} className='cursor-pointer flex items-center justify-center w-full p-2 hover:bg-[#fec260] w-full object-cover'>
                                  <div className='w-[20px] h-[20px]'>
                                    <img src="/assets/icons/subtract.png" alt="" className='w-full h-full object-contain'/>
                                  </div>
                                </button>
                                <input type="number" className='text-center w-auto' value={foodQuantity} onChange={(e) => setFoodQuantity(Number(e.target.value))}/>
                                <button type='button' onClick={addFoodQuantity} className='cursor-pointer flex items-center justify-center p-2 hover:bg-[#fec260] w-full'>
                                  <div className='w-[20px] h-[20px]'>
                                    <img src="/assets/icons/plus.png" alt="" className='w-full h-full object-contain'/>
                                  </div>
                                </button>
                              </div>
                            </div>

                          </div>
                          <div className='flex flex-col w-full'>
                            <div>
                              <label className='text-[#2F2F2F] font-bold'>Description</label>
                              <textarea 
                                placeholder='Add a description' 
                                rows={5} value={foodDescription} onChange={(e) => setFoodDescription(e.target.value)}
                                className='resize-none p-2 border-1 border-[#A3A3A3] rounded-[10px] w-full'
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {donateItem.item && (
                      <div className='flex flex-col w-full gap-1 p-5 bg-[#FFF] border-t-2 border-dashed border-t-[#bababa]'> {/* ITEM WINDOW */}
                        <label className='flex justify-center items-center text-[#2F2F2F] text-[24px] font-bold w-full'>ITEM</label>
                        <div className='xl:grid xl:grid-cols-2 lg:grid lg:grid-cols-2 md:grid md:grid-cols-2 w-full flex flex-col gap-2'>
                          <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2 w-full'>
                              <label>Quantity</label>
                              <div className='grid grid-cols-3 rounded-[10px] border-1 border-[#DC8801] w-full overflow-hidden'>
                                <button type='button' onClick={subtractItemQuantity} className='cursor-pointer flex items-center justify-center w-full p-2 hover:bg-[#fec260] w-full object-cover'>
                                  <div className='w-[20px] h-[20px]'>
                                    <img src="/assets/icons/subtract.png" alt="" className='w-full h-full object-contain'/>
                                  </div>
                                </button>
                                <input type="number" className='text-center w-auto' value={itemQuantity} onChange={(e) => setItemQuantity(Number(e.target.value))}/>
                                <button type='button' onClick={addItemQuantity} className='cursor-pointer flex items-center justify-center p-2 hover:bg-[#fec260] w-full'>
                                  <div className='w-[20px] h-[20px]'>
                                    <img src="/assets/icons/plus.png" alt="" className='w-full h-full object-contain'/>
                                  </div>
                                </button>
                              </div>
                            </div>

                          </div>

                          <div>
                            <label htmlFor="">Description</label>
                            <textarea 
                              name="" 
                              id="" 
                              placeholder='Add a description' 
                              rows={5} value={itemDescription} onChange={(e) => setItemDescription(e.target.value)}
                              className='resize-none p-2 border-1 border-[#A3A3A3] rounded-[10px] w-full'
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    {donateItem.other && (
                      <div className='flex flex-col w-full gap-1 p-5 bg-[#FFF] border-t-2 border-dashed border-t-[#bababa]'> {/* OTHER WINDOW */}
                        <label className='flex justify-center items-center text-[#2F2F2F] text-[24px] font-bold w-full'>OTHERS</label>
                        <div className='xl:grid xl:grid-cols-2 lg:grid lg:grid-cols-2 md:grid md:grid-cols-2 w-full flex flex-col gap-2'>
                          <div className='flex flex-col gap-2'>
                            <label>Quantity</label>
                            <div className='grid grid-cols-3 rounded-[10px] border-1 border-[#DC8801] w-full overflow-hidden'>
                              <button type='button' onClick={subtractOtherQuantity} className='cursor-pointer flex items-center justify-center w-full p-2 hover:bg-[#fec260] w-full object-cover'>
                                <div className='w-[20px] h-[20px]'>
                                  <img src="/assets/icons/subtract.png" alt="" className='w-full h-full object-contain'/>
                                </div>
                              </button>
                              <input type="number" className='text-center w-auto' value={otherQuantity} onChange={(e) => setOtherQuantity(Number(e.target.value))}/>
                              <button type='button' onClick={addOtherQuantity} className='cursor-pointer flex items-center justify-center p-2 hover:bg-[#fec260] w-full'>
                                <div className='w-[20px] h-[20px]'>
                                  <img src="/assets/icons/plus.png" alt="" className='w-full h-full object-contain'/>
                                </div>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="">Description</label>
                            <textarea 
                              name="" 
                              id="" 
                              placeholder='Add a description' 
                              rows={5} value={othersDescription} onChange={(e) => setOthersDescription(e.target.value)}
                              className='resize-none p-2 border-1 border-[#A3A3A3] rounded-[10px] w-full'
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='flex items-center justify-center p-10 border-dashed border-2 border-[#DC8801] xl:rounded-[10px] lg:rounded-[10px] md:rounded-[5px] text-[#DC8801] text-center'>
                    Please select a type of donation you want to donate.
                  </div>
                )}

                  {error && (
                    <label className='text-[#DC8801] italic text-center p-2 rounded-[10px] w-full bg-[#ffefd5]'>{error}</label>
                  )}
                
                <button type='button' onClick={handleSubmit} className={donateItem.money || donateItem.food || donateItem.item || donateItem.other ? 'cursor-pointer self-center min-w-[100px] w-full xl:w-auto lg:w-auto md:w-auto h-auto bg-[#B5C04A] text-[#FFF] xl:rounded-[10px] py-5 xl:py-2 lg:py-2 md:py-2 active:bg-[#CFDA34]' : 'hidden'}>
                  Submit
                </button>
              </form>
            ) : (
              <div className='flex flex-col items-center justify-center w-full bg-[#FFF] rounded-[10px]'>
                <label className='text-[#B5C04A] italic text-center'>{successMessage}</label>
              </div>
            )}


          </div>
        </div>

        {/* <SideNavigation/> */}
      </div>
      <Footer />
    </div>
  )
}

export default Donate
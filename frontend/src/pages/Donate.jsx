
import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import SideNavigation from '../components/SideNavigation';
import HeadVolunteerSideBar from '../components/HeadVolunteerSideBar';
import Footer from '../components/Footer';
import CatBot from '../components/CatBot'
import Whisker from '../components/Whisker';
import { Link } from 'react-router-dom';


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
  const [foodUnit, setFoodUnit] = useState('');
  const [foodDescription, setFoodDescription] = useState('');

  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1)

  const [othersDescription, setOthersDescription] = useState('');
  const [otherQuantity, setOtherQuantity] = useState(1)

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('')
  const [screenshotFile, setScreenshotFile] = useState(null);

  const [isAnonymous, setIsAnonymous] = useState(false);


  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { id } = e.target;
    setDonateItem(prev => ({
      ...prev,
      [id.replace('donate_', '')]: e.target.checked
    }));
  };

  const handleFoodtypeCheckbox = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setFoodType([...foodType, value]);
    } else {
      setFoodType(foodType.filter((item) => item !== value));
    }
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

  const handleNumericChange = (setter) => (e) => {
    const value = e.target.value;

    // Allow only positive integers or empty
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setter(value);
    }
  };
  
  
  const validateForm = () => {
    if (!donateItem.money && !donateItem.food && !donateItem.item && !donateItem.other) {
      setError('Please select at least one donation type.');
      return false;
    }

    if (!user && !isAnonymous) {
      setError('You must be logged in to donate, or select "Anonymous Donation" to proceed.');
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
      if (!foodUnit) {
        setError('Please select a unit of measurement (kg or g) for the food quantity.');
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
        quantity: `${foodQuantity} ${foodUnit}`,
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

    const finalDonatorId = (user?.user_id && !isAnonymous) ? user.user_id : null;

    const donationPayLoad = {
      donator_id: finalDonatorId, 
      proofImage: screenshotName,
      items: donationItems,
    };

    console.log('Donation: ',donationPayLoad)


    try {
      const formData = new FormData();

      formData.append('donator_id', finalDonatorId);
      if (screenshotImage) {
        formData.append('proof_image', screenshotFile);
      }
      formData.append('items', JSON.stringify(donationItems));

      const response = await axios.post(`${url}/donate/donation_application`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setSuccessMessage(`
        Thank you for donating! Your support keeps our cats safe, healthy, and loved while they wait for their forever families. We couldn't do this without you!
      `)

      if (user?.user_id && !isAnonymous) {
        await fetchNotifications(user.user_id)
      }
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
            <div className='flex flex-col bg-[#FFF] p-5 rounded-t-[10px]'> 
                <div className='bg-[#FFF] w-full flex flex-col justify-center items-center xl:flex-row lg:flex-row md:flex-row xl:justify-between lg:justify-between md:justify-between p-3 xl:rounded-t-[10px] lg:rounded-t-[10px] md:rounded-t-[10px] sm:rounded-t-[0px]'>
                  <label className='text-[#889132] text-[24px] font-bold'>DONATION FORM</label>
                  <label htmlFor="anonymous_donation" className='flex items-center gap-2'>
                    <input type="checkbox" id="anonymous_donation" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)}/>
                    Anonymous Donation
                  </label>
                </div>

                {!successMessage ? (
                  <div className='flex flex-col items-center px-3 py-3 gap-2 w-full'>
                    <span className='flex flex-col items-center justify-center leading-tight w-full text-[#2F2F2F]'>
                      <span className='text-center font-bold'>Get started by selecting a type of donation you want to donate</span>
                      <span className='text-[#8f8f8f] italic text-sm'>(You can choose multiple).</span>
                    </span>
  
                    <span className='leading-tight text-sm text-center px-4 py-2'>
                      Your donation, no matter the size, helps provide the love and care our cats truly deserve. Your support allows us to continue improving the lives of cats in need and giving them a brighter future. Together, we can create a kinder, more compassionate world for every cat. We're deeply grateful for your generosity, thank you!
                    </span>
  
                    <div className='flex flex-col xl:flex-row lg:flex-row gap-3 w-full rounded-[10px] pt-2'>
                      <label htmlFor="donate_money" className='cursor-pointer flex gap-5 p-2 rounded-[10px] bg-[#FFF] w-full border-2 border-[#2F2F2F]'>
                        <input type="checkbox" id='donate_money' 
                          checked={donateItem.money} 
                          onChange={handleCheckboxChange}
                        />
                        Money
                      </label>
                      <label htmlFor="donate_food" className='cursor-pointer flex gap-5 p-2 rounded-[10px] bg-[#FFF] w-full border-2 border-[#2F2F2F]'>
                        <input type="checkbox" id='donate_food' 
                          checked={donateItem.food}
                          onChange={handleCheckboxChange}
                        />
                        Food
                      </label>
                      <label htmlFor="donate_item" className='cursor-pointer flex gap-5 p-2 rounded-[10px] bg-[#FFF] w-full border-2 border-[#2F2F2F]'>
                        <input type="checkbox" id='donate_item' 
                          checked={donateItem.item}
                          onChange={handleCheckboxChange}
                        />
                        Item
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center w-full bg-[#FFF] p-3 gap-3 rounded-[10px]'>
                    <label className='flex items-center justify-center text-[#2F2F2F] italic text-center whitespace-pre-line'>{successMessage}</label>
                  </div>
                )}
            </div>

            {!successMessage && (
              <form className='flex flex-col w-auto rounded-[10px]'>
                <div className= 'flex flex-col rounded-[10px] w-full'>
                  {donateItem.money && (
                    <div className='flex flex-col w-full gap-1 p-5 bg-[#FFF] border-t-2 border-dashed border-t-[#bababa]'> {/* MONEY WINDOW */}
                      <label className='flex justify-center items-center text-[#2F2F2F] text-[24px] font-bold w-full'>MONEY</label>

                      <div className='xl:grid xl:grid-cols-2 lg:grid lg:grid-cols-2 md:grid md:grid-cols-2 w-full flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                          <div className='flex flex-col gap-2'>
                            <label htmlFor="">Amount of money to donate</label>
                            <input type="number" placeholder='Add amount' value={moneyAmount} onChange={(e) => setMoneyAmount(e.target.value)} required
                            className='p-2 rounded-[10px] border-1 border-[#A3A3A3]'/>
                          </div>
                          <div className='flex flex-col gap-2'>
                            <label className='text-[#595959] text-[14px] pt-2'>Please upload an image of transaction's receipt (Receipt Screenshot)</label>
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
                          <label htmlFor="">Scan the QR code to proceed with the transaction</label>
                          <div className='w-[300px] h-[300px] object-fit rounded-[10px] overflow-hidden'>
                            <img src="/assets/QR_Code.jpg" alt="qr_code" className='w-full h-full object-cover'/>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {donateItem.food && (
                    <div className='flex flex-col w-full gap-1 p-5 bg-[#FFF] border-t-2 border-dashed border-t-[#bababa]'> {/* FOOD WINDOW */}
                      <label className='flex justify-center items-center text-[#2F2F2F] text-[24px] font-bold w-full'>FOOD DONATION</label>
                      <div className='w-full flex flex-col gap-2'>
                        <div className='flex flex-col gap-4 w-full'>  
                          <div className='flex flex-col w-full gap-2'>
                            <div className='flex flex-col items-start'>
                              <label className='text-[#595959] text-[14px] leading-tight'>Select a food type (you can select both)</label>
                              <div className='flex gap-2 w-full'>
                                <label htmlFor="food_wet" className='flex gap-2 p-2 border-1 border-[#A3A3A3] rounded-[5px] w-full'>
                                  <input type="checkbox" name="donation_food" id="food_wet" 
                                  value={'Wet'} 
                                  onChange={handleFoodtypeCheckbox}/>
                                  Wet
                                </label>
                                <label htmlFor="food_dry" className='flex gap-2 p-2 border-1 border-[#A3A3A3] rounded-[5px] w-full'>
                                  <input type="checkbox" name="donation_food" id="food_dry" 
                                  value={'Dry'} onChange={handleFoodtypeCheckbox}/>
                                  Dry
                                </label>
                              </div>
                            </div>
                            <div className='flex flex-col w-full'>
                              <label className='text-[#595959] text-[14px] leading-tight'>Quantity (please specify how much food you're donating)</label>
                              <div className='flex gap-2 items-center w-full'> 
                                <input 
                                  type="text" 
                                  placeholder='Quantity' 
                                  value={foodQuantity} 
                                  onChange={handleNumericChange(setFoodQuantity)} 
                                  className='p-2 border-1 border-[#A3A3A3] rounded-[5px] w-full'
                                  required // Ensure quantity is filled
                                />
                                <select 
                                  value={foodUnit} // Connect to state
                                  onChange={(e) => setFoodUnit(e.target.value)} // Update state on change
                                  className='p-2 border-1 border-[#A3A3A3] rounded-[5px]'
                                  required // Ensure a unit is selected
                                >
                                  <option value="" hidden>Select a unit (kg/g)</option>
                                  <option value="kilograms">kilograms (kg)</option>
                                  <option value="grams">grams (g)</option>
                                </select>
                              </div>
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
                    <div className='flex flex-col w-full gap-4 p-5 bg-[#FFF] border-t-2 border-dashed border-t-[#bababa]'> {/* ITEM WINDOW */}
                      <label className='flex justify-between items-center w-full'>
                        <span className='text-[#2F2F2F] text-[24px] font-bold'>ITEM DONATION</span>
                        <span>You can donate cleaning supplies, food bowls, etc.</span>
                      </label>
                      <div className='flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                          <div className='flex flex-col w-full text-[14px]'>
                            <label>Quantity (please specify how many items you're donating )</label>
                            <input type="text" placeholder='Quantity' value={itemQuantity} onChange={handleNumericChange(setItemQuantity)} className='p-2 border-1 border-[#A3A3A3] rounded-[5px] w-full'/>
                          </div>
                          
                          <div className='flex flex-col w-full'>
                            <label className='text-[14px]'>Description (Please provide a specific description of your item donation)</label>
                            <textarea 
                              placeholder='Add a description' 
                              rows={5} value={itemDescription} onChange={(e) => setItemDescription(e.target.value)}
                              className='resize-none p-2 border-1 border-[#A3A3A3] rounded-[10px] w-full'
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              

                {error && (
                  <label className='text-[#DC8801] italic text-center p-2 rounded-[10px] w-full bg-[#ffefd5]'>{error}</label>
                )}
                
                <button type='button' onClick={handleSubmit} className={donateItem.money || donateItem.food || donateItem.item || donateItem.other ? 'cursor-pointer w-full xl:w-auto lg:w-auto md:w-auto h-auto bg-[#B5C04A] text-[#FFF] py-5 xl:py-3 lg:py-3 md:py-2 active:bg-[#CFDA34]' : 'hidden'}>
                  Submit donation
                </button>
              </form>
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

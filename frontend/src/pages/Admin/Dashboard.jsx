import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import AdminSideBar from '../../components/AdminSideBar'
import axios from 'axios'

import { useSession } from '../../context/SessionContext'
import HeadVolunteerSideBar from '../../components/HeadVolunteerSideBar'

const Dashboard = () => {
  const { user, logout, loading: sessionLoading } = useSession();

  const [cats, setCats] = useState(0);
  const [newCats, setNewCats] = useState(0);
  const [adoptedCats, setAdoptedCats] = useState(0);
  const [newAdoptedCats, setNewAdoptedCats] = useState(0);

  const [users, setUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [adopters, setAdopters] = useState(0);
  const [adoptedsMonth, setAdoptersMonth] = useState(0);

  const [totalMoney, setTotalMoney] = useState(0);
  const [monthlyMoney, setMonthlyMoney] = useState(0);

  const formattedTotalMoney = Number(totalMoney).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const formattedmongthlyMoney = Number(totalMoney).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });




  const fetchCats = async () => {
    try {
      const catnumber = await axios.get('http://localhost:5000/cat/list');

      setCats(catnumber.data.length)
    } catch (err) {
      console.error('Error fetching cats: ', err);
    }
  } 

  const fetchNewCats = async () => {
    try {
      const newCats = await axios.get('http://localhost:5000/cat/adopted');
      setNewCats(newCats.data.length)
    } catch(err) {
      console.error('Error fetching new cats: ', err);
    }
  }

  const fetchAdoptedCats = async () => {
    try {
      const adopted_cat = await axios.get('http://localhost:5000/cat/adopted');
      setAdoptedCats(adopted_cat.data.length)
    } catch (err) {

    }
  }

  const fetchNewAdoptedCats = async () => {
  try {
    const res = await axios.get('http://localhost:5000/cat/adopted_cats/month');
    setNewAdoptedCats(res.data.length); // Assuming you track this in state
  } catch (err) {
    console.error('Error fetching adopted cats:', err);
  }
};


  const fetchUsers = async () => {
    try {
      const usernumber = await axios.get('http://localhost:5000/admin/manage/users');

      setUsers(usernumber.data.length) 
    } catch (err) {
      console.error('Error fetching cats: ', err);
    }
  } 


  const fetchNewUsers = async () => {
    try {
      const newUsers = await axios.get(`http://localhost:5000/user/all_users`);
      setNewUsers(newUsers.data.length)
    } catch (err) {
      console.error('Error fetching new users: ', err);
    }
  }



  const fetchAdopters = async () => {
    try {
      const userAdopters = await axios.get('http://localhost:5000/admin/adopters')
      setAdopters(userAdopters.data.length)
    } catch (err) {
      console.error('Error fetching adopters: ', err);
    }
  }

  const fetchNewAdopters = async () => {
    try {
      const userAdopters = await axios.get('http://localhost:5000/admin/adopters')
      setAdoptersMonth(userAdopters.data.length)
    } catch (err) {
      console.error('Error fetching adopters: ', err);
    }
  }


  const fetchDonationSummary = async () => {
    try {
      const res = await axios.get('http://localhost:5000/donate/money_donations_summary');


      setTotalMoney(res.data.total_money_donated);
      setMonthlyMoney(res.data.total_money_donated_this_month);
    } catch (err) {
      console.error('Error fetching donation summary:', err);
    }
  };



    


  useEffect(() => {
    fetchCats();
    fetchAdoptedCats();
    fetchNewAdoptedCats();
    fetchNewCats();

    fetchUsers();
    fetchNewUsers();
    fetchAdopters();
    fetchNewAdopters();

    fetchDonationSummary();
  }, []);

  return (

    <div className='relative flex flex-col h-screen w-auto overflow-x-hidden'>
        
        <div className='flex flex-row overflow-x-hidden w-full'>
          
          <AdminSideBar className='max-w-[400px]'/>

          <div className='flex flex-col items-center xl:p-10 lg:p-10 min-h-screen gap-5 w-full overflow-y-scroll'>
            <div className='xl:hidden lg:hidden flex flex-col justify-center items-center h-screen w-full gap-3 rounded-[15px]'>
                <label className='text-2xl text-[#2F2F2F] text-center'>Unable to access this page</label>
                <label className='text-[#8f8f8f] text-center'>You can access the page on larger screen size such as desktop/laptop screens</label>
            </div>

            {/* ALL CONTENTS HERE */}
            <div className='hidden xl:flex lg:flex flex-col gap-5 w-full'>
              <div className='flex flex-col gap-2 border-dashed rounded-[25px]'>
                <label htmlFor="" className='font-bold text-2xl text-[#FFF] bg-[#977655] p-3 rounded-[10px]'>OVERVIEW</label>
                <div className='grid grid-cols-2 w-full h-auto gap-2'>
                  <div className='flex flex-row items-center justify-between p-3 gap-2 bg-[#FFF] rounded-[10px] border-2 border-[#977655]'> 
                    <div className='flex flex-col'>
                      <label htmlFor="">Total Users</label>
                      <label className='font-bold text-[30px]'>{users}</label>
                    </div>
                    <div className='w-[50px] h-[50px] object-fit'>
                      <img src="/assets/icons/admin-icons/total--user.png" alt="" className='w-full h-full object-cover'/>
                    </div>
                  </div>

                  <div className='flex flex-row items-center justify-between p-3 gap-2 bg-[#FFF] rounded-[10px] border-2 border-[#977655]'> 
                    <div className='flex flex-col'>
                      <label className='text-[#595959]'>Total Cats</label>
                      <label className='font-bold text-[30px]'>{cats}</label>
                    </div>
                    <div className='w-[50px] h-[50px] object-fit'>
                      <img src="/assets/icons/admin-icons/total-cats.png" alt="" className='w-full h-full object-cover'/>
                    </div>
                  </div>

                  <div className='flex flex-row items-center justify-between p-3 gap-2 w-full bg-[#FFF] rounded-[10px] border-2 border-[#977655]'>
                    <div className='flex flex-col'>
                      <label htmlFor="">Adopters</label>
                      <label className='font-bold text-[30px]'>{adopters}</label>
                    </div>
                    <div className='w-[50px] h-[50px] object-fit'>
                      <img src="/assets/icons/admin-icons/total--user.png" alt="" className='w-full h-full object-cover'/>
                    </div>
                  </div>

                  <div className='flex flex-row items-center justify-between p-3 gap-2 w-full bg-[#FFF] rounded-[10px] border-2 border-[#977655]'>
                    <div className='flex flex-col'>
                      <label htmlFor="">Adopted Cats</label>
                      <label className='font-bold text-[30px]'>{adoptedCats}</label>
                    </div>
                    <div className='w-[50px] h-[50px] object-fit'>
                      <img src="/assets/icons/admin-icons/total-cats.png" alt="" className='w-full h-full object-cover'/>
                    </div>
                  </div>

                  <div className='flex flex-row items-center justify-between col-span-2 p-3 gap-2 bg-[#FFF] rounded-[10px] border-2 border-[#977655]'> 
                    <div className='flex flex-col'>
                      <label htmlFor="">Total Financial Donations</label>
                      <label className='font-bold text-[30px]'>Php {formattedTotalMoney}</label>
                    </div>
                    <div className='w-[50px] h-[50px] object-fit'>
                      <img src="/assets/icons/admin-icons/total-donation.png" alt="" className='w-full h-full object-cover'/>
                    </div>
                  </div>
                </div>

              </div>

              <div className='hidden xl:flex lg:flex flex-col gap-5 rounded-[25px] w-full'>
                  <label className='font-bold text-2xl text-[#FFF] bg-[#DC8801] p-3 rounded-[10px]'>MONTHLY SUMMARY</label>
                  <div className='flex flex-col w-full gap-3 rounded-[15px]'>
                    <div className='grid grid-cols-2 w-full gap-2'>
                      <div className='flex flex-row items-center justify-between p-3 gap-2 w-full bg-[#FFF] rounded-[10px] border-2 border-[#DC8801]'> 
                        <div className='flex flex-col'>
                          <label htmlFor="">New Users</label>
                          <label className='font-bold text-[30px]'>{newUsers}</label>
                        </div>
                        <div className='w-[50px] h-[50px] object-fit'>
                          <img src="/assets/icons/admin-icons/total--user.png" alt="" className='w-full h-full object-cover'/>
                        </div>
                      </div>

                      <div className='flex flex-row items-center justify-between p-3 gap-2 w-full bg-[#FFF] rounded-[10px] border-2 border-[#DC8801]'>
                        <div className='flex flex-col'>
                          <label htmlFor="">New Cats</label>
                          <label className='font-bold text-[30px]'>{newCats}</label>
                        </div>
                        <div className='w-[50px] h-[50px] object-fit'>
                          <img src="/assets/icons/admin-icons/total-cats.png" alt="" className='w-full h-full object-cover'/>
                        </div>
                      </div>

                        <div className='flex flex-row items-center justify-between p-3 gap-2 w-full bg-[#FFF] rounded-[10px] border-2 border-[#DC8801]'>
                          <div className='flex flex-col'>
                            <label htmlFor="">Adopters this month</label>
                            <label className='font-bold text-[30px]'>{adoptedsMonth}</label>
                          </div>
                          <div className='w-[50px] h-[50px] object-fit'>
                            <img src="/assets/icons/admin-icons/total--user.png" alt="" className='w-full h-full object-cover'/>
                          </div>
                        </div>

                        <div className='flex flex-row items-center justify-between p-3 gap-2 w-full bg-[#FFF] rounded-[10px] border-2 border-[#DC8801]'>
                          <div className='flex flex-col'>
                            <label htmlFor="">Adopted Cats this month</label>
                            <label className='font-bold text-[30px]'>{newAdoptedCats}</label>
                          </div>
                          <div className='w-[50px] h-[50px] object-fit'>
                            <img src="/assets/icons/admin-icons/total-cats.png" alt="" className='w-full h-full object-cover'/>
                          </div>
                        </div>

                        <div className='flex flex-row items-center justify-between col-span-2 p-3 gap-2 bg-[#FFF] rounded-[10px] border-2 border-[#DC8801]'> 
                          <div className='flex flex-col'>
                            <label htmlFor="">Total Financial Donations</label>
                            <label className='font-bold text-[30px]'>Php {formattedmongthlyMoney}</label>
                          </div>
                          <div className='w-[50px] h-[50px] object-fit'>
                            <img src="/assets/icons/admin-icons/total-donation.png" alt="" className='w-full h-full object-cover'/>
                          </div>
                        </div>
                    </div>
                  </div>
              </div>


            </div>
          
          </div>
        </div>
    </div>
  )
}

export default Dashboard
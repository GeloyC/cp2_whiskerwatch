import React from 'react';
import { Routes, Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import RootLayout from './layout/RootLayout';

import { SessionProvider } from './context/SessionContext';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import CatCareGuides from './pages/CatCareGuides';
import ContactUs from './pages/ContactUs';
import Login from './pages/LoginAndSignUp/Login';
import AdminLogin from './pages/LoginAndSignUp/AdminLogin';
import SignUp from './pages/LoginAndSignUp/SignUp';

import CatCommunityNews from './pages/Home/CatCommunityNews';

import Donate from './pages/Donate';
import Money from './pages/DonateComponents/Money';
import Food from './pages/DonateComponents/Food';
import Items from './pages/DonateComponents/Items';
import Others from './pages/DonateComponents/Others';

import CatAdoption from './pages/CatAdoption';
import CatProfile from './pages/CatAdoption/CatProfile';
import AdopteeForm from './pages/CatAdoption/AdopteeForm';
import Feeding from './pages/Feeding';
import CommunityGuide from './pages/CommunityGuide';

import Dashboard from './pages/Admin/Dashboard';
import Profile from './pages/Profile/Profile';
import AdminCatProfile from './pages/Admin/AdminCatProfile';
import AdoptersAndVisitors from './pages/Admin/AdoptersAndVisitors';
// import Volunteers from './pages/Admin/Volunteers';
import Manage from './pages/Admin/Manage';

import AdoptersList from './pages/Admin/Adopters/AdoptersList';
import AdopterApplication from './pages/Admin/Adopters/AdopterApplication';
import AdopterView from './pages/Admin/Adopters/AdopterView';
import AdopterApplicationView from './pages/Admin/Adopters/AdopterApplicationView';

import FeedingVolunteers from './pages/Admin/Feeding/FeedingVolunteers';
import FeedingApplications from './pages/Admin/Feeding/FeedingApplications';
import FeedingApplicationView from './pages/Admin/Feeding/FeedingApplicationView';
import Donation from './pages/Admin/Feeding/Donation';
import Report from './pages/Admin/Feeding/Report';

import AdminList from './pages/Admin/Manage/AdminList';
import AllUsers from './pages/Admin/Manage/AllUsers';
import UserProfile from './pages/Admin/Manage/UserProfile';
import UpdateRole from './pages/Admin/Manage/UpdateRole';
import AssignNewAdmin from './pages/Admin/Manage/AssignNewAdmin';

import CatProfileProperty from './pages/Admin/CatProfileProperty/CatProfileProperty';
import CatProfileCreate from './pages/Admin/CatProfileProperty/CatProfileCreate';
import FeedingReport from './pages/Feeding/FeedingReport';
import TermsCondition from './layout/TermsCondition';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />

        {/* Public Routes */}
        <Route path="home" element={<Home />} />
        <Route path="aboutus" element={<AboutUs />} />
        <Route path="catcareguides" element={<CatCareGuides />} />
        <Route path="contactus" element={<ContactUs />} />
        <Route path="catcommunitynews" element={<CatCommunityNews />} />
        <Route path="donate" element={<Donate />}>
          <Route path='money' element={<Money />} />
          <Route path='food' element={<Food />} />
          <Route path='items' element={<Items />} />
          <Route path='others' element={<Others />} />
        </Route>

        <Route path="catadoption" element={<CatAdoption />} />
        <Route path="catprofile/:cat_id" element={<CatProfile />} />
        <Route path="adopteeform/:cat_id" element={<AdopteeForm />} />
        <Route path="feeding" element={<Feeding />}>
          <Route path='feedingreport/:user_id' element={<FeedingReport />}/>
        </Route>


        <Route path="communityguide" element={<CommunityGuide />} />

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="adminlogin" element={<AdminLogin />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="termscondition" element={<TermsCondition/>} />


        {/* Admin Routes */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admincatprofile" element={<AdminCatProfile />} />
        <Route path="catprofileproperty/:cat_id" element={<CatProfileProperty />} />
        <Route path="catprofilecreate" element={<CatProfileCreate />} />
        <Route path="adoptersandvisitors" element={<AdoptersAndVisitors />} />
        
        <Route path="adopterslist" element={<AdoptersList />} />
        <Route path="adopterslist/adopterview" element={<AdopterView />} />
        
        <Route path="adopterapplication" element={<AdopterApplication />} />
        <Route path="adopterapplication/adopterapplicationview/:application_id" element={<AdopterApplicationView />} />

        {/* <Route path="volunteers" element={<Volunteers />} /> */}
        <Route path="feedingvolunteers" element={<FeedingVolunteers />} />
        <Route path="feedingapplications" element={<FeedingApplications />} />
        <Route path="feedingapplications/feedingapplicationview/:application_id" element={<FeedingApplicationView />} />
        <Route path="donationadmin" element={<Donation />} />
        <Route path='report' element={<Report/>}/>

        <Route path="manage" element={<Manage />} />
        <Route path="adminlist" element={<AdminList />} >
          <Route path="update/:user_id" element={<UpdateRole />} />
          <Route path="assign" element={<AssignNewAdmin />} />
        </Route>
        <Route path="allusers" element={<AllUsers />} />
        <Route path="userprofile/:user_id" element={<UserProfile />} />

        {/* Head Volunteer */}
        {/* <Route path="hvdashboard" element={<HeadVolunteerDashboard />}/>
        <Route path="headvolunteerpage" element={<HeadVolunteerMainPage /> }/>
        <Route path="adoptionapplication" element={<AdoptionApplication/>}/>
        <Route path="headvolunteerprofile" element={<HeadVolunteerProfile/>}/> */}
        {/* <Route path="applicationfeeding" element={<FeederApplication />}>
          <Route path='applicationview/:application_id' element={<ApplicationFeederView />}/>
        </Route> */}
      </Route>
    )
  );

  return (
    <SessionProvider>
        <RouterProvider router={router} />
    </SessionProvider>
  );
};

export default App;

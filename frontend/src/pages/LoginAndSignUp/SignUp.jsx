import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    const url = `https://whiskerwatch-0j6g.onrender.com`;
    const [step, setStep] = useState('signup'); // 'signup' or 'verify'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [contactnumber, setContactNumber] = useState('');
    const [birthday, setBirthday] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [termShow, setTermShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(true);   

    const handleChange = (setter) => (e) => setter(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
        setPasswordMatchError(true);
        setError('Passwords need to match to proceed!');
        setLoading(false);
        return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address');
        setLoading(false);
        return;
        }

        try {
        await axios.post(`${url}/user/check_email`, { email });
        setEmailError('');
        } catch (err) {
        if (err.response?.status === 409) {
            setEmailError(err.response.data.message);
            setLoading(false);
            return;
        }
        }

        try {
        await axios.post(`${url}/user/check_username`, { username });
        setUsernameError('');
        } catch (err) {
        if (err.response?.status === 409) {
            setUsernameError(err.response.data.message);
            setLoading(false);
            return;
        }
        }

        try {
            const res = await axios.post(`${url}/user/signup`, {
                firstname,
                lastname,
                contactnumber,
                birthday,
                email,
                username,
                address,
                password
            });

            console.log('Signup response:', res.data);
            toast.success('OTP sent to your email!');
            setStep('verify');
        } catch (err) {
            console.error('Signup error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'An error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    // const handleVerifyOtp = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError('');

    //     // Build the full user data object
    //     const userData = {
    //         firstname,
    //         lastname,
    //         contactnumber,
    //         birthday,
    //         email,
    //         username,
    //         address,
    //         password,
    //     };

    //     try {
    //         const res = await axios.post(`${url}/user/verify-otp`, { email, otp, userData });
    //         toast.success(res.data.message);
    //         navigate('/login');
    //     } catch (err) {
    //         console.error('OTP verification error:', err.response?.data || err.message);
    //         setError(err.response?.data?.error || 'Failed to verify OTP');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${url}/user/verify-otp`, { email, otp });
            toast.success(res.data.message);
            navigate('/login');
        } catch (err) {
            console.error('OTP verification error:', err.response?.data || err.message);
            setError(err.response?.data?.error || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSignUp = () => {
        setFirstname('');
        setLastname('');
        setContactNumber('');
        setBirthday('');
        setEmail('');
        setUsername('');
        setAddress('');
        setPassword('');
        setConfirmPassword('');
        setStep('signup');
    };

    const handleShowTerms = () => {
        setTermShow((prev) => !prev);
    };

    const handleResendOtp = async () => {
        if (!canResend) return;

        try {
            setCanResend(false);
            setResendTimer(60);

            const res = await axios.post(`${url}/user/resend-otp`, { email });
            toast.success(res.data.message);

            // Countdown
            const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                clearInterval(interval);
                setCanResend(true);
                return 0;
                }
                return prev - 1;
            });
            }, 1000);
        } catch (err) {
            console.error("Resend OTP error:", err.response?.data || err.message);
            toast.error(err.response?.data?.error || "Failed to resend OTP");
            setCanResend(true);
        }
    };

    return (
        <div className={`relative flex items-center justify-center ${termShow ? 'inset-0 bg-black/50 bg-opacity-75' : 'bg-opacity-100'} xl:grid lg:grid md:flex xl:grid-cols-[60%_40%] lg:grid-cols-[60%_40%] xl:place-items-center md:items-center md:justify-center h-screen w-full overflow-x-hidden`}>
        {termShow && (
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[700px] rounded-[10px] flex flex-col bg-[#FFF] overflow-y-scroll scrollbar-thin'>
            <button onClick={handleShowTerms} className='absolute left-3 top-3 size-8 bg-[#C2CB6A] rounded-[10px] flex gap-2 item-center hover:scale-104 active:scale-95 transition-all duration-100'>
                <img src="/assets/icons/delete_orange.png" alt="" className='rotate-90'/>
            </button>
            <div className='flex flex-col gap-10 items-center justify-start h-full p-10'>
                <div className='max-w-[250px] min-w-[150px] h-auto object-cover'>
                <img src="/assets/whiskerwatchlogo-vertical.png" alt="" className='w-full h-full object-cover'/>
                </div>
                <span className='text-3xl text-[#2F2F2F] font-bold'>WhiskerWatch Terms and Conditions</span>
                <div className='xl:w-[700px] lg:w-[700px] md:w-[700px] flex flex-col gap-10'>
                <span className='text-center text-[#2F2F2F]'>
                    Welcome to WhiskerWatch, a web-based platform for managing stray cat welfare activities within DMCI Siena Park Residences. By accessing or using this platform, you agree to the following Terms and Conditions. Please read them carefully before continuing.
                </span>
                <div className='flex flex-col gap-1 text-center'>
                    <span className='font-bold'>Acceptance of Terms</span>
                    <span>
                    By creating an account or using WhiskerWatch, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions.
                    </span>
                </div>
                <div className='flex flex-col gap-1 text-center'>
                    <span className='font-bold'>Purpose of the Platform</span>
                    <span>
                    WhiskerWatch is designed to manage cat adoptions, donations, and feeding schedules, promote community participation through gamified features, and provide monthly analytics and welfare reports. The platform is intended for residents and authorized volunteers of the Siena Park Residences community.
                    </span>
                </div>
                <div className='flex flex-col gap-1 text-center'>
                    <span className='font-bold'>User Responsibilities</span>
                    <span>
                    Users agree to provide accurate and truthful information during registration and use. They must use the platform solely for legitimate cat welfare activities, respect others’ privacy, and avoid abusive or inappropriate content. Misuse of the system is strictly prohibited.
                    </span>
                </div>
                <div className='flex flex-col gap-1 text-center'>
                    <span className='font-bold'>Data Privacy and Security</span>
                    <span>
                    WhiskerWatch collects basic user data such as name, email, and contact information for identification and system functionality. All data is securely stored and used only for cat welfare management purposes. The platform complies with applicable data privacy regulations.
                    </span>
                </div>
                <div className='flex flex-col gap-1 text-center'>
                    <span className='font-bold'>Adoption, Donation, and Feeding Activities</span>
                    <span>
                    All adoption, donation, and feeding applications are subject to review and approval by the head volunteer or admin. Donations made through the platform are considered final and non-refundable. WhiskerWatch is not responsible for disputes or arrangements made outside the system.
                    </span>
                </div>
                <div className='flex flex-col gap-1 text-center'>
                    <span className='font-bold'>Gamification and Rewards</span>
                    <span>
                    Users may earn digital badges or progress recognition through participation in welfare activities. These rewards are for engagement purposes only and do not have any monetary value.
                    </span>
                </div>
                <div className='flex flex-col gap-1 text-center'>
                    <span className='font-bold'>Account Suspension or Termination</span>
                    <span>
                    Administrators reserve the right to suspend or delete accounts that violate community rules, falsify information, or misuse the system. Decisions made by the administrators are final.
                    </span>
                </div>
                <div className='flex flex-col gap-1 text-center'>
                    <span className='font-bold'>Limitation of Liability</span>
                    <span>
                    WhiskerWatch, its developers, and associated volunteers are not liable for any damages or losses resulting from misuse of the system, technical errors, or service interruptions.
                    </span>
                </div>
                <div className='flex flex-col gap-1 text-center'>
                    <span className='font-bold'>Modifications to Terms</span>
                    <span>
                    The WhiskerWatch administration may update or modify these Terms and Conditions at any time. Users will be notified of any updates, and continued use of the platform will constitute acceptance of the new terms.
                    </span>
                </div>
                </div>
            </div>
            </div>
        )}

        <div className="hidden xl:block lg:block md:hidden box-border w-full h-full object-cover overflow-hidden">
            <img src="/assets/stray-cat.jpg" alt="stray-cat" className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col gap-8 items-center justify-start w-full h-full px-10 py-10 xl:h-auto lg:h-auto md:h-auto">
            <Link to="/home" className="w-[250px] max-w-auto">
            <img src="/assets/whiskerwatchlogo-vertical.png" alt="" />
            </Link>

            {step === 'signup' ? (
            <form onSubmit={handleSubmit} className="flex flex-col xl:grid lg:grid md:grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-5 min-h-full">
                <input
                type="text"
                placeholder="First Name"
                value={firstname}
                onChange={handleChange(setFirstname)}
                required
                className="border-b-2 border-b-[#A8784F] p-2"
                />
                <input
                type="text"
                placeholder="Last Name"
                value={lastname}
                onChange={handleChange(setLastname)}
                required
                className="border-b-2 border-b-[#A8784F] p-2"
                />
                <input
                type="tel"
                placeholder="Contact Number"
                maxLength={11}
                value={contactnumber}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 11) setContactNumber(value);
                }}
                required
                className="border-b-2 border-b-[#A8784F] p-2"
                />
                <div className="flex gap-2 items-center border-b-2 border-b-[#A8784F]">
                    <label className="text-[#737373] whitespace-nowrap p-2">Date of Birth</label>
                    <input
                        type="date"
                        placeholder="Date of Birth"
                        value={birthday}
                        onChange={handleChange(setBirthday)}
                        required
                        className="p-2 w-full"
                    />
                </div>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                    }}
                    required
                    className={!emailError ? 'border-b-2 border-b-[#A8784F] p-2 text-[#2F2F2F]' : 'border-b-2 border-b-[#A8784F] p-2 text-[#DC8801] bg-[#F9F7DC]'}
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        if (usernameError) setUsernameError('');
                    }}
                    required
                    className={!usernameError ? 'border-b-2 border-b-[#A8784F] p-2' : 'border-b-2 border-b-[#A8784F] p-2 text-[#DC8801] bg-[#F9F7DC]'}
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={handleChange(setAddress)}
                    required
                    className="border-b-2 border-b-[#A8784F] p-2 col-span-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange(setPassword)}
                    required
                    className={password === confirmPassword ? 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#B5C04A]' : 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#000000]'}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleChange(setConfirmPassword)}
                    required
                    className={password === confirmPassword ? 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#B5C04A]' : 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#d23f07]'}
                />

                <div className="flex flex-col items-center gap-3 col-span-2">
                <div className="flex flex-col">
                    <span className='text-center text-[12px]'> 
                    By Continuing, you agree to our{' '}
                    <Link onClick={handleShowTerms} className="text-[#DC8801] underline hover:text-[#B67101] active:text-[#DC8801]">
                        Terms and Conditions
                    </Link>
                    </span>
                    <label className="text-[#DC8801] text-[14px] text-center">{error || emailError || usernameError}</label>
                    <button
                    type="submit"
                    disabled={loading}
                    className="p-2 px-4 bg-[#B5C04A] min-w-[125px] text-[#FFF] rounded-[50px] hover:bg-[#889132] active:scale-97 cursor-pointer"
                    >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </div>
                <span className="text-center">
                    Already a member of WhiskerWatch?{' '}
                    <Link to="/login" className="font-normal md:font-bold hover:underline text-[#B5C04A]">
                    Log in
                    </Link>{' '}
                    instead!
                </span>
                </div>
            </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5 items-center">
                    <p className="text-[#2F2F2F] text-center">
                        Enter the OTP sent to <b>{email}</b>
                    </p>

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={handleChange(setOtp)}
                        required
                        className="border-b-2 border-b-[#A8784F] p-2 w-full text-center max-w-[200px]"
                    />
                    <div className='flex flex-col gap-2 items-center'>
                        <label className="text-[#DC8801] text-[14px]">{error}</label>

                        <button type="submit" disabled={loading}
                            className="p-2 px-4 bg-[#B5C04A] min-w-[125px] text-[#FFF] rounded-[50px] hover:bg-[#889132] active:scale-97 cursor-pointer"
                        > {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <button type="button" onClick={handleResendOtp} disabled={!canResend}
                            className={`text-[#DC8801] underline ${
                            canResend ? 'hover:text-[#B67101]' : 'opacity-50 cursor-not-allowed'
                            }`}
                        >
                            {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
                        </button>

                        <button type="button"
                            onClick={handleCancelSignUp}
                            className="text-[#DC8801] underline hover:text-[#B67101]"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
        <ToastContainer />
        </div>
    );
};

export default SignUp;
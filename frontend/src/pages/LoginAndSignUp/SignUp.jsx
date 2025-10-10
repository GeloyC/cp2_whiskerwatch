import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const SignUp = () => {
    const url = `https://whiskerwatch-0j6g.onrender.com`;
    const [captchaToken, setCaptchaToken] = useState(null);
    const SITE_KEY = '6Lf1hOQrAAAAAGyLTMqscsPcUdIyX6H2wYnsbwQb';

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [contactnumber, setContactNumber] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (setter) => (e) => setter(e.target.value);
    const handleCaptcha = (token) => {
        console.log('CAPTCHA Token:', token);
        setCaptchaToken(token);
    };

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
        // Check email availability
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
        // Check username availability
        await axios.post(`${url}/user/check_username`, { username });
        setUsernameError('');
        } catch (err) {
        if (err.response?.status === 409) {
            setUsernameError(err.response.data.message);
            setLoading(false);
            return;
        }
        }

        if (!captchaToken) {
        setError('Please complete the CAPTCHA.');
        setLoading(false);
        return;
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
            password,
            'g-recaptcha-response': captchaToken,
        });

        console.log('Signup response:', res.data);
        if (res.status === 200 || res.status === 201) {
            console.log('Signup successful:', res.data);
            navigate('/login');
        }
        } catch (err) {
        console.error('Signup error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'An error occurred during signup');
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
        setCaptchaToken(null);
    };

    return (
        <div className="flex items-center justify-center xl:grid lg:grid md:flex xl:grid-cols-[60%_40%] lg:grid-cols-[60%_40%] xl:place-items-center md:items-center md:justify-center h-screen overflow-x-hidden">
        <div className="hidden xl:block lg:block md:hidden box-border w-full h-full object-cover overflow-hidden">
            <img src="/assets/stray-cat.jpg" alt="stray-cat" className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col gap-8 items-center justify-start w-full h-full px-10 py-10 xl:h-auto lg:h-auto md:h-auto">
            <Link to="/home" className="w-[250px] max-w-auto">
            <img src="/assets/whiskerwatchlogo-vertical.png" alt="" />
            </Link>

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
            <div className="flex gap-2 items-center">
                <label className="text-[#737373] whitespace-nowrap">Date of Birth</label>
                <input
                type="date"
                placeholder="Date of Birth"
                value={birthday}
                onChange={handleChange(setBirthday)}
                required
                className="border-b-2 border-b-[#A8784F] p-2 w-full"
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
                <ReCAPTCHA sitekey={'6Lf1hOQrAAAAAGyLTMqscsPcUdIyX6H2wYnsbwQb'} onChange={handleCaptcha} />
                <div className="flex flex-col">
                    <span>
                        By Continuing, you agree to our{' '}
                        <Link to="/termscondition" className="text-[#DC8801] underline hover:text-[#B67101] active:text-[#DC8801]">
                        Terms and Conditions
                        </Link>
                    </span>
                    <label className="text-[#DC8801] text-[14px]">{error || emailError || usernameError}</label>
                    <button
                        type="submit"
                        disabled={loading || !captchaToken}
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
        </div>
        </div>
    );
};

export default SignUp;
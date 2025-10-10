import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import ReCAPTCHA from 'react-google-recaptcha';
import { useSession } from "../../context/SessionContext";

const Login = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;
  const SITE_KEY = '6Lf1hOQrAAAAAGyLTMqscsPcUdIyX6H2wYnsbwQb';

  const navigate = useNavigate();
  const { setUser, refreshSession, login } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Only for reset confirmation
  const [loading, setLoading] = useState(false);
  const [resetPassForm, setResetPassForm] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null); // Added captchaToken state

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${url}/user/login`,
        { email, password },
        { withCredentials: true }
      );

      // const token = response.data.token; // Ensure the backend sends the token
      // Cookies.set("token", token, {
      //   expires: 7, // 7 days
      //   path: "/",
      //   secure: process.env.NODE_ENV === "production", // Use true for HTTPS
      //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      // });
      // console.log("Token set:", Cookies.get("token"));

      const user = response.data.user;
      if (!user) {
        throw new Error('User data not received');
      }

      console.log("Login attempt for email:", response.data);

      setUser(user); // from context
      login(user);
      await refreshSession();
      if (user?.role === "regular" || user?.role === "head_volunteer") {
        navigate("/home");
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
        const errorMessage = err.response?.data?.error || "Incorrect Email or Password";
        setError(errorMessage);
        console.error("Login error:", errorMessage);
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!captchaToken) {
      setError('Please complete the CAPTCHA.');
      setLoading(false);
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${url}/user/reset_password`, {
        email,
        password,
        'g-recaptcha-response': captchaToken,
      });
      console.log('Reset response:', response.data);
      if (response.status === 200) {
        alert('Password reset successfully!');
        setResetPassForm(false); // Return to login form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setCaptchaToken(null); // Reset CAPTCHA
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center xl:grid lg:grid md:flex xl:grid-cols-[60%_40%] lg:grid-cols-[60%_40%] xl:place-items-center md:items-center md:justify-center h-screen overflow-hidden">
      <div className="hidden xl:block xl:items-center lg:block lg:items-center md:hidden box-border w-full h-full object-cover overflow-hidden">
        <img src="/assets/stray-cat.jpg" alt="stray-cat" className="w-full h-full object-cover"/>
      </div>
      <div className="flex flex-col items-center justify-center gap-10 w-full h-full xl:p-10% lg:p-8% md:p-3% transition-all duration-100">
        {!resetPassForm ? (
          <Link to='/home' className='w-[250px] max-w-auto'>
            <img src="/assets/whiskerwatchlogo-vertical.png" alt="" />
          </Link>
        ) : (
          <div className="xl:w-[200px] lg:w-[200px] md:w-[200px] w-auto h-auto flex object-cover">
            <img src="/assets/whiskerwatchlogo-vertical.png" alt="logo" className="w-full h-full object-cover"/>
          </div>
        )}

        {!resetPassForm && (
          <form onSubmit={handleLogin} className="flex flex-col items-center gap-10">
            <input
              type="email"
              id="userEmail"
              placeholder="Email"
              value={email}
              onChange={(event) => { setEmail(event.target.value); if (error) setError('') }}
              required
              className="border-b-2 border-b-[#A8784F] p-2"
            />
            <div className="flex flex-col w-full gap-1 justify-start">
              <input
                type="password"
                id="userPassword"
                value={password}
                onChange={(event) => { setPassword(event.target.value); if (error) setError('') }}
                placeholder="Password"
                className="border-b-2 border-b-[#A8784F] p-2"
              />
              <button
                type="button"
                onClick={() => {
                  if (!email || !emailRegex.test(email)) {
                    setError('Invalid email address!');
                    setResetPassForm(false);
                  } else {
                    setResetPassForm(true);
                  }
                }}
                className="cursor-pointer text-[14px] hover:underline hover:text-[#DC8801]"
              >
                Forgot Password
              </button>
            </div>

            <div className="flex flex-col items-center gap-3">
              {error && (
                <div className="mb-4 p-3 text-[14px] text-[#DC8801] bg-[#FDF5D8] rounded-lg">{error}</div>
              )}
              <div className="flex flex-row gap-1 justify-stretch">
                <button
                  type="submit"
                  className="bg-[#B5C04A] text-[#FFF] p-[10px] w-30 rounded-[50px] cursor-pointer hover:bg-[#889132] active:scale-97"
                >
                  Log in
                </button>
                <Link
                  to="/signup"
                  className="bg-amber-600 text-[#FFF] p-[10px] w-30 text-center rounded-[50px] hover:bg-[#b67101] active:scale-97"
                >
                  Sign Up
                </Link>
              </div>
              <Link to="/adminlogin" className="pt-4 active:text-[#977655] hover:underline">
                Log in as Admin
              </Link>
            </div>
          </form>
        )}

        {resetPassForm && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-10 items-center justify-center">
            <div className="flex flex-col gap-2 items-center">
              <label className="text-[24px] font-bold">RESET PASSWORD</label>
              <label className="text-[#2F2F2F] text-[12px]">Enter a new password for <strong>{email}</strong></label>
            </div>

            <div className="flex flex-col gap-5 justify-center items-center">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={
                  password === confirmPassword
                    ? 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#B5C04A]'
                    : 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#000000]'
                }
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={
                  password === confirmPassword
                    ? 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#B5C04A]'
                    : 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#d23f07]'
                }
              />
              <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptcha} /> {/* Added CAPTCHA */}
            </div>

            <div className="flex flex-col gap-2 items-center">
              {error && (
                <div className="mb-4 p-3 text-[14px] text-[#DC8801] bg-[#FDF5D8] rounded-lg">{error}</div>
              )}
              <div className="flex items-center gap-1">
                <button
                  type="submit"
                  className="bg-[#DC8801] text-[#FFF] p-2 w-fit px-4 rounded-[50px] active:bg-[#B67101] cursor-pointer"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResetPassForm(false);
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setCaptchaToken(null); // Reset CAPTCHA
                  }}
                  className="bg-[#FFF] text-[#DC8801] p-2 w-fit px-4 rounded-[50px] active:bg-[#DC8801] active:text-[#FFF] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
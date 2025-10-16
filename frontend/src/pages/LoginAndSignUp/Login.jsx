// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Cookies from "js-cookie";
// import ReCAPTCHA from "react-google-recaptcha";
// import { useSession } from "../../context/SessionContext";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const url = `https://whiskerwatch-0j6g.onrender.com`;
//   const SITE_KEY = "6Lf1hOQrAAAAAGyLTMqscsPcUdIyX6H2wYnsbwQb";

//   const navigate = useNavigate();
//   const { setUser, login, refreshSession } = useSession();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [captchaToken, setCaptchaToken] = useState(null);

//   const [forgotPassForm, setForgotPassForm] = useState(false);
//   const [emailForgot, setEmailForgot] = useState('')

//   const [resetPassForm, setResetPassForm] = useState(false);

//   // axios.defaults.withCredentials = true;

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   // Handle ReCAPTCHA
//   const handleCaptcha = (token) => setCaptchaToken(token);


//   // ------------------- USER LOGIN -------------------
//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setError("");
//     setLoading(true);

//     if (!emailRegex.test(email)) {
//       setError("Please enter a valid email address");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${url}/user/login`,
//         { email, password },
//         { withCredentials: true }
//       );

      
//       const token = response.data.token;

//       if (token) {
//         Cookies.set("token", token, {
//           expires: 7,
//           path: "/",
//           secure: process.env.NODE_ENV === "production",
//           sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//         });
//         console.log("Token set:", Cookies.get("token"));
//       }

//       const user = response.data.user;
//       if (!user) throw new Error("User data not received");

//       // Update Session Context
//       setUser(user);
//       login(user);
//       await refreshSession();

//       if (user.role === "regular" || user.role === "head_volunteer" || user.role === "admin") {
//         navigate("/home");
//       } else {
//         setError("Unauthorized role");
//       }
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         "Login Failed: Incorrect Email or Password";
//       setError(errorMessage);
//       console.error("Login error:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = async (event) => {
//     event.preventDefault();
//     setError("");
//     setLoading(true);

//     // if (!emailRegex.test(email)) {
//     //   setError("Please enter a valid email address");
//     //   setLoading(false);
//     //   return;
//     // }

//     try {
//       const response = await axios.post(`${url}/user/forgot-password`, { email: emailForgot });

//       if (response.status == 200) {
//         toast.success('An OTP has been sent to your email. Please check your inbox');
//         setEmail(emailForgot);

//         setEmailForgot(false);
//         setResetPassForm(true)
//       }

//     } catch (error) {
//       console.error("Forgot password error:", error);

//       const message =
//         error.response?.data?.message ||
//         "Failed to send OTP. Please try again later.";
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   }
  



//   // ------------------- PASSWORD RESET -------------------
//   const handleResetPassword = async (event) => {
//     event.preventDefault();
//     setError("");
//     setLoading(true);

//     // Basic validations
//     if (!captchaToken) {
//       setError("Please complete the CAPTCHA.");
//       setLoading(false);
//       return;
//     }

//     if (!password || !confirmPassword) {
//       setError("Please fill in both password fields.");
//       setLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       setLoading(false);
//       return;
//     }

//     // Prompt for OTP (if you want inline input later, replace this with a state variable)
//     const otp = prompt("Enter the 6-digit OTP sent to your email:");

//     if (!otp) {
//       setError("OTP is required to reset your password.");
//       setLoading(false);
//       return;
//     }

//     try {
//       // ✅ Send password reset request
//       const response = await axios.post(`${url}/user/reset-password`, {
//         email,
//         otp,
//         password,
//         "g-recaptcha-response": captchaToken,
//       });

//       if (response.status === 200) {
//         toast.success("Your password has been reset successfully!");
        
//         // Reset all fields & go back to login
//         setPassword("");
//         setConfirmPassword("");
//         setCaptchaToken(null);
//         setResetPassForm(false);
//         setForgotPassForm(false);
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error("Reset password error:", error);
//       const message =
//         error.response?.data?.message || "Password reset failed. Please try again.";
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------- RENDER -------------------
//   return (
//     <div className="flex items-center justify-center xl:grid lg:grid md:flex xl:grid-cols-[60%_40%] lg:grid-cols-[60%_40%] xl:place-items-center md:items-center md:justify-center h-screen overflow-hidden">
//       {/* Left image section */}
//       <div className="hidden xl:block lg:block md:hidden box-border w-full h-full object-cover overflow-hidden">
//         <img
//           src="/assets/stray-cat.jpg"
//           alt="stray-cat"
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Right form section */}
//       <div className="flex flex-col items-center gap-10 w-full min-w-[200px] h-auto p-10">
//         <div className="max-w-[250px]">
//           <img src="/assets/whiskerwatchlogo-vertical.png" alt="logo" />
//         </div>

//         {/* LOGIN FORM */}
//         {!resetPassForm && !forgotPassForm && (
//           <form onSubmit={handleLogin} className={"flex flex-col items-center gap-8"}>
//             <label className="text-[#2F2F2F] text-[24px] font-bold">User Login</label>

//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 if (error) setError("");
//               }}
//               className="border-b-2 border-b-[#977655] p-2"
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 if (error) setError("");
//               }}
//               className="border-b-2 border-b-[#977655] p-2"
//               required
//             />

//             <div className="flex flex-col items-center gap-2 w-full">
//               <button
//                 type="submit"
//                 className="bg-[#B5C04A] text-white p-2 w-[120px] rounded-[25px] cursor-pointer hover:bg-[#889132] w-full"
//                 disabled={loading}
//               >
//                 {loading ? "Logging in..." : "Log In"}
//               </button>
//               <Link
//                 to="/signup"
//                 className="border-2 border-[#B5C04A] text-[#889132] p-2 w-[120px] text-center rounded-[25px] hover:bg-[#B5C04A] hover:text-white w-full"
//               >
//                 Sign Up
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setForgotPassForm(true);
//                   setError("");
//                 }}

//                 className={ "cursor-pointer text-[14px] hover:underline hover:text-[#DC8801]"}
//               >
//                 Forgot Password?
//               </button>
//               {/* <Link
//                 to="/adminlogin"
//                 className="pt-4 text-[14px] hover:underline hover:text-[#977655]"
//               >
//                 Log in as Admin
//               </Link> */}
//             </div>

//             {error && (
//               <div className="mb-4 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]">
//                 {error}
//               </div>
//             )}
//           </form>
//         )}

//         {forgotPassForm && (
//           <form onSubmit={handleForgotPassword} className="flex flex-col items-center justify-center gap-5">
//             <div className="flex ">
//               <label className="font-bold text-[#2F2F2F] text-2xl">Forgot your Password?</label>
//             </div>

//             <span className="text-center text-sm w-[300px]">
//               Enter your email address and we will send you a verification code to confirm your email.
//             </span>

//             <div className="flex flex-col gap-4">
//               <input type="text" placeholder="Email" value={emailForgot} onChange={(e) => setEmailForgot(e.target.value)} className="border-b-2 border-b-[#DC8801] w-full p-2"/>
//               <button onClick={handleForgotPassword}  type="button" className="cursor-pointer bg-[#B5C04A] py-2 rounded-full text-[#FFF] hover:scale-104 active:scale-95 transition-all duration-100">{loading ? "Sending OTP..." : "Continue"}</button>
//               <button type="button" className="text-sm underline cursor-pointer active:text-[#DC8801]" onClick={() => {
//                   setForgotPassForm(false);
//                   setEmailForgot("");
//                   setError("");
//                 }} >Back to Login</button>
//             </div>

//             {error && (
//               <div className="mt-2 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]">
//                 {error}
//               </div>
//             )}
//           </form>
//         )}

//         {/* RESET PASSWORD FORM */}
//         {/* ADD function on onSubmit to reset the password */}
//         {resetPassForm && (
//           // <form onSubmit={handleResetPassword} className="flex flex-col items-center gap-8">
//           //   <label className="text-[#2F2F2F] text-[24px] font-bold">Reset Password</label>
//           //   <p className="text-sm text-gray-600">
//           //     Enter a new password for <strong>{email}</strong>
//           //   </p>

//           //   <input
//           //     type="password"
//           //     placeholder="New Password"
//           //     value={password}
//           //     onChange={(e) => setPassword(e.target.value)}
//           //     className="border-b-2 border-b-[#977655] p-2"
//           //     required
//           //   />
//           //   <input
//           //     type="password"
//           //     placeholder="Confirm Password"
//           //     value={confirmPassword}
//           //     onChange={(e) => setConfirmPassword(e.target.value)}
//           //     className="border-b-2 border-b-[#977655] p-2"
//           //     required
//           //   />
//           //   <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptcha} />

//           //   <div className="flex gap-3">
//           //     <button
//           //       type="submit"
//           //       className="bg-[#DC8801] text-white p-2 px-4 rounded-[25px]"
//           //       disabled={loading}
//           //     >
//           //       {loading ? "Resetting..." : "Reset Password"}
//           //     </button>
//           //     <button
//           //       type="button"
//           //       onClick={() => {
//           //         setResetPassForm(false);
//           //         setError("");
//           //         setPassword("");
//           //         setConfirmPassword("");
//           //         setCaptchaToken(null);
//           //       }}
//           //       className="border-2 border-[#DC8801] text-[#DC8801] p-2 px-4 rounded-[25px] hover:bg-[#DC8801] hover:text-white"
//           //     >
//           //       Cancel
//           //     </button>
//           //   </div>

//           //   {error && (
//           //     <div className="mb-4 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]">
//           //       {error}
//           //     </div>
//           //   )}
//           // </form>

//           <form onSubmit={handleResetPassword} className="flex flex-col items-center gap-8">
//             <label className="text-[#2F2F2F] text-[24px] font-bold">Reset Password</label>
//             <p className="text-sm text-gray-600">
//               Enter a new password for <strong>{email}</strong>
//             </p>

//             <input
//               type="password"
//               placeholder="New Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="border-b-2 border-b-[#977655] p-2"
//               required
//             />
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="border-b-2 border-b-[#977655] p-2"
//               required
//             />
//             <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptcha} />

//             <div className="flex gap-3">
//               <button
//                 type="submit"
//                 className="bg-[#DC8801] text-white p-2 px-4 rounded-[25px]"
//                 disabled={loading}
//               >
//                 {loading ? "Resetting..." : "Reset Password"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setResetPassForm(false);
//                   setError("");
//                   setPassword("");
//                   setConfirmPassword("");
//                   setCaptchaToken(null);
//                 }}
//                 className="border-2 border-[#DC8801] text-[#DC8801] p-2 px-4 rounded-[25px] hover:bg-[#DC8801] hover:text-white"
//               >
//                 Cancel
//               </button>
//             </div>

//             {error && (
//               <div className="mb-4 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]">
//                 {error}
//               </div>
//             )}
//           </form>
//         )}
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Login;



// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useSession } from "../../context/SessionContext";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Login = () => {
//   const url = `https://whiskerwatch-0j6g.onrender.com`;

//   const navigate = useNavigate();
//   const { setUser, login, refreshSession } = useSession();

//   const [email, setEmail] = useState("");
//   const [emailForgot, setEmailForgot] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [forgotPassForm, setForgotPassForm] = useState(false);
//   const [resetPassForm, setResetPassForm] = useState(false);
//   const [otpStep, setOtpStep] = useState(false);
//   const [otp, setOtp] = useState("");

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   // ------------------- USER LOGIN -------------------
//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setError("");
//     setLoading(true);

//     if (!emailRegex.test(email)) {
//       setError("Please enter a valid email address");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${url}/user/login`,
//         { email, password },
//         { withCredentials: true }
//       );

//       const token = response.data.token;
//       if (token) {
//         Cookies.set("token", token, {
//           expires: 7,
//           path: "/",
//           secure: process.env.NODE_ENV === "production",
//           sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//         });
//       }

//       const user = response.data.user;
//       if (!user) throw new Error("User data not received");

//       localStorage.setItem("user", JSON.stringify(user));
//       setUser(user);
//       login(user);
//       await refreshSession();

//       if (["regular", "head_volunteer", "admin"].includes(user.role)) {
//         navigate("/home");
//       } else {
//         setError("Unauthorized role");
//       }
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         "Login Failed: Incorrect Email or Password";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------- FORGOT PASSWORD -------------------
//   const handleForgotPassword = async () => {
//     setError("");
//     setLoading(true);
//     try {
//       const response = await axios.post(`${url}/user/verify-reset-otp`, {  // <-- Change to /verify-reset-otp
//         email: emailForgot,
//         otp,
//       });
//       if (response.status === 200) {
//         toast.success("OTP verified successfully!");
//         setForgotPassForm(false);
//         setResetPassForm(true);
//       }
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       setError(
//         error.response?.data?.message ||
//           "Invalid OTP. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------- RESET PASSWORD -------------------
//   // const handleResetPassword = async (event) => {
//   //   event.preventDefault();
//   //   setError("");
//   //   setLoading(true);

//   //   if (!otp) {
//   //     setError("Please enter the OTP sent to your email.");
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   if (!password || !confirmPassword) {
//   //     setError("Please fill in both password fields.");
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   if (password !== confirmPassword) {
//   //     setError("Passwords do not match.");
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   try {
//   //     const response = await axios.post(`${url}/user/reset-password`, {
//   //       email,
//   //       otp,
//   //       password,
//   //     });

//   //     if (response.status === 200) {
//   //       toast.success("Your password has been reset successfully!");
//   //       setOtp("");
//   //       setPassword("");
//   //       setConfirmPassword("");
//   //       setResetPassForm(false);
//   //       setForgotPassForm(false);
//   //       navigate("/login");
//   //     }
//   //   } catch (error) {
//   //     console.error("Reset password error:", error);
//   //     const message =
//   //       error.response?.data?.message ||
//   //       "Password reset failed. Please try again.";
//   //     setError(message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleResetPassword = async (event) => {
//     event.preventDefault();
//     setError("");
//     setLoading(true);

//     if (!otp) {
//       setError("Please enter the OTP sent to your email.");
//       setLoading(false);
//       return;
//     }

//     if (!password || !confirmPassword) {
//       setError("Please fill in both password fields.");
//       setLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(`${url}/user/reset-password`, {
//         email: emailForgot, // Use emailForgot from forgot password step
//         otp: otp.trim(), // Trim to remove accidental spaces
//         password,
//       });

//       if (response.status === 200) {
//         toast.success("Your password has been reset successfully!");
//         setOtp("");
//         setPassword("");
//         setConfirmPassword("");
//         setResetPassForm(false);
//         setForgotPassForm(false);
//         setEmailForgot("");
//         setOtpStep(false);
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error("Reset password error:", error);
//       const message =
//         error.response?.data?.error || // Match backend error field
//         error.response?.data?.message ||
//         "Password reset failed. Please try again.";
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------- RENDER -------------------
//   return (
//     <div className="flex items-center justify-center xl:grid lg:grid md:flex xl:grid-cols-[60%_40%] lg:grid-cols-[60%_40%] xl:place-items-center md:items-center md:justify-center h-screen overflow-hidden">
//       {/* Left image section */}
//       <div className="hidden xl:block lg:block md:hidden box-border w-full h-full object-cover overflow-hidden">
//         <img
//           src="/assets/stray-cat.jpg"
//           alt="stray-cat"
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Right form section */}
//       <div className="flex flex-col items-center gap-10 w-full min-w-[200px] h-auto p-10">
//         <div className="max-w-[250px]">
//           <img src="/assets/whiskerwatchlogo-vertical.png" alt="logo" />
//         </div>

//         {/* LOGIN FORM */}
//         {!resetPassForm && !forgotPassForm && (
//           <form onSubmit={handleLogin} className="flex flex-col items-center gap-8">
//             <label className="text-[#2F2F2F] text-[24px] font-bold">User Login</label>

//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 if (error) setError("");
//               }}
//               className="border-b-2 border-b-[#977655] p-2"
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 if (error) setError("");
//               }}
//               className="border-b-2 border-b-[#977655] p-2"
//               required
//             />

//             <div className="flex flex-col items-center gap-2 w-full">
//               <button
//                 type="submit"
//                 className="bg-[#B5C04A] text-white p-2 w-full rounded-[25px] cursor-pointer hover:bg-[#889132]"
//                 disabled={loading}
//               >
//                 {loading ? "Logging in..." : "Log In"}
//               </button>
//               <Link
//                 to="/signup"
//                 className="border-2 border-[#B5C04A] text-[#889132] p-2 text-center rounded-[25px] hover:bg-[#B5C04A] hover:text-white w-full"
//               >
//                 Sign Up
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setForgotPassForm(true);
//                   setError("");
//                 }}
//                 className="cursor-pointer text-[14px] hover:underline hover:text-[#DC8801]"
//               >
//                 Forgot Password?
//               </button>
//             </div>

//             {error && (
//               <div className="mb-4 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]">
//                 {error}
//               </div>
//             )}
//           </form>
//         )}

//         {/* FORGOT PASSWORD FORM */}
//         {/* {forgotPassForm && (
//           <form onSubmit={handleForgotPassword} className="flex flex-col items-center justify-center gap-5">
//             <label className="font-bold text-[#2F2F2F] text-2xl">Forgot your Password?</label>
//             <span className="text-center text-sm w-[300px]">
//               Enter your email address and we’ll send you a verification code to confirm your email.
//             </span>

//             <div className="flex flex-col gap-4">
//               <input type="text"
//                 placeholder="Email" value={emailForgot}
//                 onChange={(e) => setEmailForgot(e.target.value)}
//                 className="border-b-2 border-b-[#DC8801] text-center w-full p-2"
//               />

//               <div className="flex flex-col gap-2 items-center">
//                 <p className="text-sm text-gray-600 text-center">
//                   Enter the OTP sent to <strong>{email}</strong> and your new password.
//                 </p>

//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   maxLength={6}
//                   className="border-b-2 border-b-[#DC8801] p-2 text-center w-full"
//                   required
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <button type="submit"
//                   className="cursor-pointer bg-[#B5C04A] py-2 rounded-full text-[#FFF] hover:scale-105 active:scale-95 transition-all duration-100"
//                 >
//                   {loading ? "Sending OTP..." : "Send OTP"}
//                 </button>
//                 <button type="submit"
//                   className="cursor-pointer bg-[#B5C04A] py-2 rounded-full text-[#FFF] hover:scale-105 active:scale-95 transition-all duration-100"
//                 >
//                   {loading ? "Sending..." : "Continue"}
//                 </button>
//               </div>

//               <button type="button"
//                 onClick={() => {
//                   setForgotPassForm(false);
//                   setEmailForgot("");
//                   setError("");
//                 }}
//                 className="text-sm underline cursor-pointer active:text-[#DC8801]"
//               >
//                 Back to Login
//               </button>
//             </div>

//             {error && (
//               <div className="mt-2 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]">
//                 {error}
//               </div>
//             )}
//           </form>
//         )} */}

//         {forgotPassForm && (
//           <form onSubmit={(e) => e.preventDefault()} className="flex flex-col items-center justify-center gap-5">
//             <label className="font-bold text-[#2F2F2F] text-2xl">Forgot your Password?</label>
//             <span className="text-center text-sm w-[300px]">
//               Enter your email address and we’ll send you a verification code to confirm your email.
//             </span>

//             <div className="flex flex-col gap-4 w-full items-center">
//               {/* Email Input */}
//               <input
//                 type="text"
//                 placeholder="Email"
//                 value={emailForgot}
//                 onChange={(e) => setEmailForgot(e.target.value)}
//                 className="border-b-2 border-b-[#DC8801] text-center w-full p-2"
//                 required
//                 disabled={loading}
//               />

//               {/* OTP Input (only show after Send OTP is pressed) */}
//               {otpStep && (
//                 <div className="flex flex-col gap-2 items-center w-full">
//                   <p className="text-sm text-gray-600 text-center">
//                     Enter the OTP sent to <strong>{emailForgot}</strong>
//                   </p>
//                   <input
//                     type="text"
//                     placeholder="Enter 6-digit OTP"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     maxLength={6}
//                     className="border-b-2 border-b-[#DC8801] p-2 text-center w-full"
//                     required
//                   />
//                 </div>
//               )}

//               {/* Buttons */}
//               <div className="flex flex-col gap-2 w-full">
//                 {!otpStep ? (
//                   <button
//                     type="button"
//                     onClick={async () => {
//                       setError("");
//                       setLoading(true);
//                       try {
//                         const response = await axios.post(`${url}/user/forgot-password`, {
//                           email: emailForgot,
//                         });
//                         if (response.status === 200) {
//                           toast.success("OTP sent! Please check your email.");
//                           setOtpStep(true);
//                         }
//                       } catch (error) {
//                         console.error("Send OTP error:", error);
//                         setError(
//                           error.response?.data?.message || "Failed to send OTP. Please try again."
//                         );
//                       } finally {
//                         setLoading(false);
//                       }
//                     }}
//                     className="cursor-pointer bg-[#B5C04A] py-2 rounded-full text-[#FFF] hover:scale-105 active:scale-95 transition-all duration-100"
//                     disabled={loading}
//                   >
//                     {loading ? "Sending OTP..." : "Send OTP"}
//                   </button>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={handleForgotPassword}
//                     className="cursor-pointer bg-[#B5C04A] py-2 rounded-full text-[#FFF] hover:scale-105 active:scale-95 transition-all duration-100"
//                     disabled={loading}
//                   >
//                     {loading ? "Verifying..." : "Continue"}
//                   </button>
//                 )}
//               </div>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setForgotPassForm(false);
//                   setEmailForgot("");
//                   setOtp("");
//                   setOtpStep(false);
//                   setError("");
//                 }}
//                 className="text-sm underline cursor-pointer active:text-[#DC8801]"
//               >
//                 Back to Login
//               </button>
//             </div>

//             {error && (
//               <div className="mt-2 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]">
//                 {error}
//               </div>
//             )}
//           </form>
//         )}

//         {/* RESET PASSWORD FORM */}
//         {resetPassForm && (
//           <form onSubmit={handleResetPassword} className="flex flex-col items-center gap-8">
//             <label className="text-[#2F2F2F] text-[24px] font-bold">Reset Password</label>
//             <input
//               type="password"
//               placeholder="New Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="border-b-2 border-b-[#977655] p-2"
//               required
//             />
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="border-b-2 border-b-[#977655] p-2"
//               required
//             />

//             <div className="flex gap-3">
//               <button
//                 type="submit"
//                 className="bg-[#DC8801] text-white p-2 px-4 rounded-[25px]"
//                 disabled={loading}
//               >
//                 {loading ? "Resetting..." : "Reset Password"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setResetPassForm(false);
//                   setError("");
//                   setPassword("");
//                   setConfirmPassword("");
//                   setOtp("");
//                 }}
//                 className="border-2 border-[#DC8801] text-[#DC8801] p-2 px-4 rounded-[25px] hover:bg-[#DC8801] hover:text-white"
//               >
//                 Cancel
//               </button>
//             </div>

//             {error && (
//               <div className="mb-4 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]">
//                 {error}
//               </div>
//             )}
//           </form>
//         )}
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Login;




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSession } from "../../context/SessionContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const url = `https://whiskerwatch-0j6g.onrender.com`;

  const navigate = useNavigate();
  const { user, setUser, login, refreshSession } = useSession();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailForgot, setEmailForgot] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotPassForm, setForgotPassForm] = useState(false);
  const [resetPassForm, setResetPassForm] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");

  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ------------------- USER LOGIN -------------------
  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    // if (!emailRegex.test(email)) {
    //   setError("Please enter a valid email address");
    //   setLoading(false);
    //   return;
    // }

    try {
      const response = await axios.post(
        `${url}/user/login`,
        { username, password },
        { withCredentials: true }
      );

      
      const { token, user } = response.data;

      if (!user) throw new Error("User data not received");

      // Store token in localStorage (works regardless of cookie blocking)
      if (token) {
        localStorage.setItem('jwt_token', token);
      } else {
        console.warn("No token received in login response");
      }

      login(user);
      await refreshSession();

      if (user.role === "regular" || user.role === "head_volunteer" || user.role === "admin") {
        navigate("/home");
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login Failed: Incorrect Email or Password";
      setError(errorMessage);
      console.error("Login error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };


  // Stores the JWT token to localStorage
  // const handleLogin = async (event) => {
  //   event.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   if (!emailRegex.test(email)) {
  //     setError("Please enter a valid email address");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${url}/user/login`,
  //       { email, password },
  //       { withCredentials: true }
  //     );
  //     console.log("Login response:", response.data);

  //     const user = response.data.user;
  //     const token = response.data.token; // Assuming the backend sends the token
  //     if (!user || !token) throw new Error("User data or token not received");

  //     try {
  //       localStorage.setItem("user", JSON.stringify(user));
  //       localStorage.setItem("token", token); // Store the JWT token
  //       console.log("LocalStorage set - User:", JSON.parse(localStorage.getItem("user")), "Token:", localStorage.getItem("token"));
  //     } catch (e) {
  //       console.error("Failed to save to localStorage:", e);
  //     }

  //     setUser(user);
  //     await new Promise((resolve) => setTimeout(resolve, 200));
  //     await refreshSession();
  //     console.log("Post-refreshSession user state:", user, "LocalStorage Token:", localStorage.getItem("token"));

  //     if (["regular", "head_volunteer", "admin"].includes(user.role)) {
  //       navigate("/home");
  //     } else {
  //       setError("Unauthorized role");
  //     }
  //   } catch (err) {
  //     const errorMessage =
  //       err.response?.data?.error ||
  //       err.response?.data?.message ||
  //       "Login Failed: Incorrect Email or Password";
  //     setError(errorMessage);
  //     console.error("Login error:", err.response ? err.response.data : err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // const handleLogin = async (event) => {
  //   event.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   try {
  //     const res = await axios.post(`${url}/user/login`, { email, password });
  //     const { user, token } = res.data;

  //     localStorage.setItem("token", token);
  //     localStorage.setItem("user", JSON.stringify(user));

  //     login(user, token);
  //     navigate("/home");
  //   } catch (err) {
  //     setError("Login failed: " + (err.response?.data?.message || "Unknown error"));
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // ------------------- FORGOT PASSWORD -------------------
  const handleForgotPassword = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${url}/user/verify-reset-otp`, {
        email: emailForgot,
        otp,
      });
      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        setForgotPassForm(false);
        setResetPassForm(true);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- RESET PASSWORD -------------------
  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      setLoading(false);
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${url}/user/reset-password`, {
        email: emailForgot,
        otp: otp.trim(),
        password,
      });

      if (response.status === 200) {
        toast.success("Your password has been reset successfully!");
        setOtp("");
        setPassword("");
        setConfirmPassword("");
        setResetPassForm(false);
        setForgotPassForm(false);
        setEmailForgot("");
        setOtpStep(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      const message =
        error.response?.data?.error || error.response?.data?.message || "Password reset failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------- RENDER -------------------
  return (
    <div className="flex items-center justify-center xl:grid lg:grid md:flex xl:grid-cols-[60%_40%] lg:grid-cols-[60%_40%] xl:place-items-center md:items-center md:justify-center h-screen overflow-hidden">
      <div className="hidden xl:block lg:block md:hidden box-border w-full h-full object-cover overflow-hidden">
        <img src="/assets/stray-cat.jpg" alt="stray-cat" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col items-center gap-10 w-full min-w-[200px] h-auto p-10">
        <div className="max-w-[250px]">
          <img src="/assets/whiskerwatchlogo-vertical.png" alt="logo" />
        </div>
        {!resetPassForm && !forgotPassForm && (
          <form onSubmit={handleLogin} className="flex flex-col items-center gap-8">
            <label className="text-[#2F2F2F] text-[24px] font-bold">User Login</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError("");
              }}
              className="border-b-2 border-b-[#977655] p-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              className="border-b-2 border-b-[#977655] p-2"
              required
            />
            <div className="flex flex-col items-center gap-2 w-full">
              <button
                type="submit"
                className="bg-[#B5C04A] text-white p-2 w-full rounded-[25px] cursor-pointer hover:bg-[#889132]"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
              <Link
                to="/signup"
                className="border-2 border-[#B5C04A] text-[#889132] p-2 text-center rounded-[25px] hover:bg-[#B5C04A] hover:text-white w-full"
              >
                Sign Up
              </Link>
              <button
                type="button"
                onClick={() => {
                  setForgotPassForm(true);
                  setError("");
                }}
                className="cursor-pointer text-[14px] hover:underline hover:text-[#DC8801]"
              >
                Forgot Password?
              </button>
            </div>
            {error && (
              <div className="mb-4 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]">
                {error}
              </div>
            )}
          </form>
        )}
        {forgotPassForm && (
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col items-center justify-center gap-5">
            <label className="font-bold text-[#2F2F2F] text-2xl">Forgot your Password?</label>
            <span className="text-center text-sm w-[300px]">
              Enter your email address and we’ll send you a verification code to confirm your email.
            </span>
            <div className="flex flex-col gap-4 w-full items-center">
              <input
                type="text"
                placeholder="Email"
                value={emailForgot}
                onChange={(e) => setEmailForgot(e.target.value)}
                className="border-b-2 border-b-[#DC8801] text-center w-full p-2"
                required
                disabled={loading}
              />
              {otpStep && (
                <div className="flex flex-col gap-2 items-center w-full">
                  <p className="text-sm text-gray-600 text-center">
                    Enter the OTP sent to <strong>{emailForgot}</strong>
                  </p>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="border-b-2 border-b-[#DC8801] p-2 text-center w-full"
                    required
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 w-full">
                {!otpStep ? (
                  <button
                    type="button"
                    onClick={async () => {
                      setError("");
                      setLoading(true);
                      try {
                        const response = await axios.post(`${url}/user/forgot-password`, {
                          email: emailForgot,
                        });
                        if (response.status === 200) {
                          toast.success("OTP sent! Please check your email.");
                          setOtpStep(true);
                        }
                      } catch (error) {
                        console.error("Send OTP error:", error);
                        setError(error.response?.data?.message || "Failed to send OTP. Please try again.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="cursor-pointer bg-[#B5C04A] py-2 rounded-full text-[#FFF] hover:scale-105 active:scale-95 transition-all duration-100"
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="cursor-pointer bg-[#B5C04A] py-2 rounded-full text-[#FFF] hover:scale-105 active:scale-95 transition-all duration-100"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Continue"}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setForgotPassForm(false);
                  setEmailForgot("");
                  setOtp("");
                  setOtpStep(false);
                  setError("");
                }}
                className="text-sm underline cursor-pointer active:text-[#DC8801]"
              >
                Back to Login
              </button>
            </div>
            {error && (
              <div className="mt-2 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]">
                {error}
              </div>
            )}
          </form>
        )}
        {resetPassForm && (
          <form onSubmit={handleResetPassword} className="flex flex-col items-center gap-8">
            <label className="text-[#2F2F2F] text-[24px] font-bold">Reset Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b-2 border-b-[#977655] p-2"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-b-2 border-b-[#977655] p-2"
              required
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#DC8801] text-white p-2 px-4 rounded-[25px]"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                type="type"
                onClick={() => {
                  setResetPassForm(false);
                  setError("");
                  setPassword("");
                  setConfirmPassword("");
                  setOtp("");
                }}
                className="border-2 border-[#DC8801] text-[#DC8801] p-2 px-4 rounded-[25px] hover:bg-[#DC8801] hover:text-white"
              >
                Cancel
              </button>
            </div>
            {error && (
              <div className="mb-4 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]">
                {error}
              </div>
            )}
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
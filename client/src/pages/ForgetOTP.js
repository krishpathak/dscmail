import React, { useEffect, useState } from 'react'
import StarBackground from '../components/StarBackground'
import { useNavigate } from 'react-router-dom';
import Alerts from '../components/alerts.js';
const ForgetOTP = ({forgetOtp}) => {
  useEffect(()=>{
    if(!forgetOtp){
      navigate('/foremail')
    }
  })
  const [otp,setOtp]=useState();
  const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
  const onHandleChange = (e) => {
    setOtp(e.target.value)
  }
  const showCustomAlert = (message,color) => {
    setAlertMessage(message);
    setShowAlert(true);
};
const handleCloseAlert = () => {
    setShowAlert(false);
};
  const navigate=useNavigate();
  const onHandleSubmit = (e) => {
    e.preventDefault();
    if(forgetOtp.otp==otp){
      navigate('/password');
    }else{
      showCustomAlert("Invalid OTP");
    }
  }
  return (
    <>
    {showAlert && <Alerts message={alertMessage} onClose={handleCloseAlert} />}
    <div className="flex justify-center ">
      <StarBackground />
      <div className="container bg-slate-100 h-auto w-96 p-4 rounded-lg shadow-lg bg-opacity-5 backdrop-blur-lg text-white mt-48 border-2 mb-12">
        <h1 className="text-3xl font-bold text-center mb-10 mt-5 text-blue-300">Enter OTP</h1>
        <label >Enter OTP:</label>
        <input type="text" className="border-2 border-slate-400 p-2 w-full mt-2 text-black rounded focus:bg-slate-200 mb-3 text-center" id='otp' name='otp' placeholder='Enter the OTP' onChange={onHandleChange}/>
        <button className="block w-full p-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 mt-6 " onClick={onHandleSubmit}>Enter</button>
        
      </div>
    </div>
    </>
  )
}

export default ForgetOTP
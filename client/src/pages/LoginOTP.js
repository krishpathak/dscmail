import React, { useEffect, useState } from 'react'
import StarBackground from '../components/StarBackground';
import { Link, useNavigate } from 'react-router-dom';
import Alerts from '../components/alerts.js';

const LoginOTP = ({ registerOtp }) => {
    const navigate=useNavigate();
    useEffect(()=>{
        if(!registerOtp){
          navigate('/register')
        }
      })
    const [otp, setOtp] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const onhandlechange = (e) => {
        setOtp(e.target.value)
    }
    const showCustomAlert = (message, color) => {
        setAlertMessage(message);
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    const onhandleSubmit = async (e) => {
        e.preventDefault();
        if(!otp){
            showCustomAlert('Please enter OTP');
        }
        if (registerOtp.otp == otp) {
            const url = "http://localhost:8000/auth/signup";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: registerOtp.credentials.username,
                    email: registerOtp.credentials.email,
                    password: registerOtp.credentials.password,
                })
            })
            const json = await response.json();
            console.log(json);

            if(json.message=='success'){
                navigate('/');
            }
        }
        else {
            showCustomAlert('Invalid OTP');
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
                    <input type="text" className="border-2 border-slate-400 p-2 w-full mt-2 text-black rounded focus:bg-slate-200 mb-3 text-center" id='otp' name='otp' placeholder='Enter the OTP' onChange={onhandlechange} />
                    <button className="block w-full p-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 mt-6 " onClick={onhandleSubmit}>Enter</button>

                </div>
            </div>
        </>
    )
}

export default LoginOTP
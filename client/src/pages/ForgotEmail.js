import React,{useEffect, useState} from 'react'
import StarBackground from '../components/StarBackground'
import { useNavigate } from 'react-router-dom'
import Alerts from '../components/alerts.js'
const ForgotEmail = ({setForgettOtp}) => {
  const navigate =useNavigate();
  const token = document.cookie.includes('quiz_app_token');
  useEffect(()=>{
    if(token){
      navigate('/')
  }
  },[])
 
  const [email, setEmail] =useState('')
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const showCustomAlert = (message,color) => {
    setAlertMessage(message);
    setShowAlert(true);
};
const handleCloseAlert = () => {
    setShowAlert(false);
};
  const onHandleChange = (e) => {
    setEmail(e.target.value)
  }
  const onhandleSubmit=async(e)=>{
    e.preventDefault()
    const url="http://localhost:8000/auth/getotp";
    const response=await fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const json = await response.json();
    if(json.message){
      showCustomAlert(json.message);
    }
    if(json.okay==123)
    {
      // setEmail1(email)
      setForgettOtp({otp:json.otp,email:email})
      navigate('/otp2')
    }
  }
  return (
    <>
    {showAlert && <Alerts message={alertMessage} onClose={handleCloseAlert} />}
    <div className="flex justify-center ">
      <StarBackground />
      <div className="container bg-slate-100 h-auto w-96 p-4 rounded-lg shadow-lg bg-opacity-5 backdrop-blur-lg text-white mt-48 border-2 mb-12">
        <h1 className="text-3xl font-bold text-center mb-10 mt-5 text-blue-200 " >Enter Email</h1>
        <label >Enter Registered Email:</label>
        <input type="text" className="border-2 border-slate-400 p-2 text-black w-full mt-2 rounded focus:bg-slate-200 mb-3 text-center" id='email' name='email' placeholder='Enter registered Email'onChange={onHandleChange}/>
        <button className="block w-full p-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 mt-6 " onClick={onhandleSubmit}>Get OTP</button>
        
      </div>
    </div>
    </>
  )
}

export default ForgotEmail
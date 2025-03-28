import React, { useEffect, useState } from 'react'
import StarBackground from '../components/StarBackground';
import { Link, useNavigate } from 'react-router-dom';
import Alerts from '../components/alerts.js';


const Register = ({registerOtp,setregisterOtp}) => {
    const navigate =useNavigate();
    const token = document.cookie.includes('quiz_app_token');
    useEffect(()=>{
        if(token){
          navigate('/')
      }
      },[])
    const [credentials,setCredentials] =useState({email:'',password:'',username:'',cpassword:''});
    const [isCheacked,setIsCheacked] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const handleOnChange = (e) => {
        setCredentials({...credentials,[e.target.name]:e.target.value});
    }
    
    const handleCheck= (e) => {
        setIsCheacked(e.target.checked);
    }
    const showCustomAlert = (message,color) => {
        setAlertMessage(message);
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    const handleSubmit =async (e) => {
        e.preventDefault();
        if(isCheacked) {
        if(credentials.password === credentials.cpassword ){
            const sendRequest=async()=>{
                const url="http://localhost:8000/auth/cheak";
                const response=await fetch(url,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },credentials:'include',
                    body:JSON.stringify(credentials)
                })
                const json = await response.json();
                if(json.okay===123){
                    await setregisterOtp({credentials:credentials,otp:json.otp});
                    navigate('/otp1');
                }else{
                    if(json.message){
                        showCustomAlert(json.message)
                    }else{
                    showCustomAlert(json.message[0].msg)}
                }
            }
            await sendRequest();
        }else{
            showCustomAlert('Confirm password and password does not match');
        }}
        else{
            showCustomAlert('Please agree terms and conditions');
        }
    }
   
  return (
    <>
    {showAlert && <Alerts message={alertMessage} onClose={handleCloseAlert} />}
    <div className="flex justify-center ">
        
      <StarBackground />
      <div className="container bg-slate-100 h-auto w-96 p-4 rounded-lg shadow-lg bg-opacity-5 backdrop-blur-lg text-white mt-10 border-2 mb-12">
        <h1 className="text-3xl font-bold text-center mb-10 mt-5 text-blue-300">Register</h1>
        <label >Email:</label>
        <input type="text" className="border-2 border-slate-400 p-2 w-full mt-2 rounded focus:bg-slate-200 mb-8 text-black" id='email' name='email' placeholder='Enter the email' onChange={handleOnChange}/>
        <label >Username:</label>
        <input type="text" className="border-2 border-slate-400 p-2 w-full mt-2 rounded focus:bg-slate-200 mb-8 text-black" id='username' name='username' placeholder='Enter the username'onChange={handleOnChange}/>
        <label >Password:</label>
        <input type="password" className="border-2 border-slate-400 p-2 w-full mt-2 rounded focus:bg-slate-200 mb-8 text-black" id='password' name='password' placeholder='Enter the password'onChange={handleOnChange}/>
        <label >Confirm Password:</label>
        <input type="password" className="border-2 border-slate-400 p-2 w-full mt-2 rounded focus:bg-slate-200 mb-4 text-black" id='cpassword' name='cpassword' placeholder='Confirm the password'onChange={handleOnChange}/>
        <input type='checkbox' className="border ml-1 mr-2" onChange={handleCheck}/>
        <label >I ageee <a href='/tandc' className='hover:text-blue-400'>terms and conditions</a></label>
        <button className="block w-full p-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 mt-6 " onClick={handleSubmit}>Register</button>
        <Link to={'http://localhost:8000/auth/google'}><div><button className="block w-full p-3 mt-4 rounded-lg text-white bg-red-500 hover:bg-red-600">Sign up with Google</button></div></Link>
        <p className="text-center text-sm text-gray-400 mt-4">Already have an account? <a href='/login' className='hover:text-blue-400'>Login</a></p>
      </div>
    </div>
    </>
  )
}

export default Register
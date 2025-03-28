import React,{useEffect, useState} from 'react'
import StarBackground from '../components/StarBackground.js';
import { Link, useNavigate } from 'react-router-dom';
import Alerts from '../components/alerts.js';

const Login = () => {
    const navigate =useNavigate();
    const token = document.cookie.includes('quiz_app_token');
    useEffect(()=>{
        if(token){
          navigate('/')
      }
      },[])
    const[credentials,setCredentials] = useState() 
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const handleOnChange = (e) => {
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
    const showCustomAlert = (message,color) => {
        setAlertMessage(message);
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    const handleOnClick = (e) => {
        e.preventDefault()
        const createToken=async()=>{
            const url="http://localhost:8000/auth/login";
            const response=await fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials:'include',
                body: JSON.stringify(credentials)
            });
            const json= await response.json();
            console.log(json);
            if(json.message=='success'){
                navigate('/')
            }
            if(json.message){
                showCustomAlert(json.message)
            }
        }
        createToken()
    }
  return (
    <>
    {showAlert && <Alerts message={alertMessage} onClose={handleCloseAlert} />}
    <div className="flex justify-center ">
      <StarBackground />
      <div className="container bg-slate-100 h-auto w-96 p-4 rounded-lg shadow-lg bg-opacity-5 backdrop-blur-lg text-white mt-20 border-2 mb-12">
        <h1 className="text-3xl font-bold text-center mb-10 mt-5 text-blue-300">Login</h1>
        <label >Username:</label>
        <input type="text" className="border-2 border-slate-400 p-2 w-full mt-2 rounded text-black focus:bg-slate-200 mb-8" id='username' name='username' placeholder='Enter the username' onChange={handleOnChange}/>
        <label >Password:</label>
        <input type="password" className="border-2 border-slate-400 p-2 w-full mt-2 rounded text-black focus:bg-slate-200 mb-3" id='password' name='password' placeholder='Enter the password' onChange={handleOnChange}/>
        <p className="text-sm text-gray-400 mt-2">Forgot Password? <a href='/foremail' className='hover:text-blue-400'>Reset</a></p>
        <button className="block w-full p-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 mt-6 " onClick={handleOnClick}>Login</button>
        <Link to={'http://localhost:8000/auth/google'}><div><button className="block w-full p-3 mt-4 rounded-lg text-white bg-red-500 hover:bg-red-600">Sign in with Google</button></div></Link>
        <p className="text-center text-sm text-gray-400 mt-4">Dont have an account? <a href='/register' className='hover:text-blue-400'>Register</a></p>
      </div>
    </div>
    </>
  )
}

export default Login
import React, { useEffect, useState } from 'react'
import StarBackground from '../components/StarBackground'
import { useNavigate } from 'react-router-dom';
import Alerts from '../components/alerts.js';

const Password = ({forgetOtp}) => {
  const navigate=useNavigate();
  useEffect(()=>{
    if(!forgetOtp){
      navigate('/foremail')
    }
  })
  
  
  const[credentials,setCredentials]=useState({passwords:'',cpassword:''});
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const handleChange=(e)=>{
    setCredentials({...credentials,[e.target.name]:e.target.value})
  }
  const showCustomAlert = (message,color) => {
    setAlertMessage(message);
    setShowAlert(true);
};
const handleCloseAlert = () => {
    setShowAlert(false);
};
  const handleClick=async(e)=>{
    
    e.preventDefault();
    if(!credentials.password ||!credentials.cpassword){
      showCustomAlert('Please fill your credentials');
      return;
    }else{
    if(credentials.password==credentials.cpassword){
    const url="http://localhost:8000/auth/changepass";
    const response=await fetch(url,{
      method:"PUT",
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify({email:forgetOtp.email,password:credentials.password})
    })
    const json=await response.json();
    if(json.message){
      showCustomAlert(json.message);
    }
    if(json.data=='Password changed succesfully'){
      navigate('/login')
    }
    }else{
      showCustomAlert('Password and confirm password doesnt matches')
  }
}
}
  return (
    <>
    {showAlert && <Alerts message={alertMessage} onClose={handleCloseAlert} />}
    <div className="flex justify-center ">
      <StarBackground />
      <div className="container bg-slate-100 h-auto w-96 p-4 rounded-lg shadow-lg bg-opacity-5 backdrop-blur-lg text-white mt-48 border-2 mb-12">
        <h1 className="text-3xl font-bold text-center mb-10 mt-5 text-blue-300">Change Password</h1>
        <label >Enter the password</label>
        <input type="password" className="border-2 border-slate-400 p-2 text-black w-full mt-2 rounded focus:bg-slate-200 mb-8" id='password' name='password' placeholder='Enter the password' onChange={handleChange}/>
        <label >Confirm password</label>
        <input type="password" className="border-2 border-slate-400 p-2 text-black w-full mt-2 rounded focus:bg-slate-200 mb-3" id='cpassword' name='cpassword' placeholder='Confirm the password' onChange={handleChange}/>
        <button className="block w-full p-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 mt-6 " onClick={handleClick}>Change password</button>
      </div>
    </div>
    </>
  )
}

export default Password
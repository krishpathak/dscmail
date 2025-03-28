import React,{useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register'; 
import Login from './pages/login';
import LoginOTP from './pages/LoginOTP';
import ForgotEmail from './pages/ForgotEmail';
import Password from './pages/Password';
import ForgetOTP from './pages/ForgetOTP';
import Home from './pages/Home';
import Compose from './pages/ComposeEmail';
import ReceivedMails from './pages/Reciever';
function App() {
  const[registerOtp,setregisterOtp] =useState(null);
  const[forgetOtp,setForgettOtp] =useState(null);
  const[marks,setMarks]=useState();
  const[question,setQuestion1]=useState();
  const[answer,setAnswer1]=useState();
  const[qLength,setLength]=useState()
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register registerOtp={registerOtp} setregisterOtp={setregisterOtp}/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/otp1' element={<LoginOTP registerOtp={registerOtp}/>} />
        <Route path='/foremail' element={<ForgotEmail setForgettOtp={setForgettOtp} />} />
        <Route path='/password' element={<Password forgetOtp={forgetOtp}/>} />
        <Route path='/otp2' element={<ForgetOTP forgetOtp={forgetOtp} />} />
        <Route path='/compose' element={<Compose />} />
        <Route path='/' element={<Home/>} />
        <Route path='/received' element={<ReceivedMails />} />
      </Routes>
    </Router>
  );
}

export default App;

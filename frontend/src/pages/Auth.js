import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar';
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './styles/Auth.css';

const Auth = () => {
  // State to track which tab is currently active
  const [activeForm, setActiveForm] = useState('SignUp');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/varify')
      .then(result => {
        if(result.data === "Success") {
          navigate('/home');
        }
      })
      .catch(error => 
        console.log(error)
      )
  }, []);

  axios.defaults.withCredentials = true;

  return (
    <div className="container">
      <Sidebar />
      <div className="form-main">
        <div className="form-header">
          <button
            // Add "active" class if the Sign Up tab is selected
            className={`button-form left ${activeForm === 'SignUp' ? 'active' : ''}`}
            onClick={() => {setActiveForm('SignUp')}}
          >Sign Up</button>

          <button 
            // Add "active" class if the Sign In tab is selected
            className={`button-form right ${activeForm === 'SignIn' ? 'active' : ''}`}
            onClick={() => {setActiveForm('SignIn')}}
          >Sign In</button>
        </div>
         {/* Form shown changes depending on which tab is active */}
        {activeForm === 'SignUp' ? <SignUpForm /> : <SignInForm />}
      </div>
    </div>
  );
};

export default Auth;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import "./styles/Profile.css";

const Profile = () => {
  const [ username, setUsername ] = useState();
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3001/profile')
    .then(result => {
      if(result.data.username) {
        setUsername(result.data.username);
      } else {
        navigate('/home');
      }
    })
  }, []);

  return (
    <div className="container">
        <Sidebar loggedIn={true} />
        <div className="profile-main">
          <div className="profile-header">
            <img className="profile-picture" src="https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"/>
            <span className="username">{username}</span>
          </div>
        </div>
    </div>
  );
};

export default Profile;
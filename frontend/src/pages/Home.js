import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar';
import axios from "axios"; // Import axios for making HTTP requests
import imgScr from '../assets/homePageImg.png';
import './styles/Home.css';

const Home = () => {
  // Configure Axios to include credentials (cookies) with every request
  axios.defaults.withCredentials = true;

  const [ loggedIn, setLoggedIn ] = useState();

  useEffect(() => {
    // When the component mounts, send a GET request to backend to check if the user is authenticated
    axios.get('http://localhost:3001/varify')
      .then(result => {
        // If backend confirms authentication, log success
        if(result.data === "Success") {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      })
      .catch(error => 
        // Log any error that occurs during the request
        console.log(error)
      )
  }, []); // Empty dependency array ensures this effect runs only once when the component loads

  return (
    <div className="container">
      <Sidebar loggedIn={ loggedIn } /> {/* Render the sidebar on the left */}
      <div className="main">
        <img className="main-img" src={imgScr} alt="chess-board" />
          <div className="main-info">
              <h1 className="info-header">Play Chess Online!</h1>
              <p className="info-text">
                Welcome to our chess website — the perfect place to play, learn, and improve your game. 
                Whether you're a beginner just starting out or an experienced player looking to test your skills, you'll find everything you need here. 
                Play live matches against friends or challenge our smart computer opponent, solve engaging chess puzzles, and track your progress as you grow. 
                With a clean interface, intuitive features, and a supportive community, this is your all-in-one platform for mastering the game of kings.
              </p>
            <a className="button-default" href="/play">Play</a>
          </div>
      </div>
    </div>
  );
};

export default Home;
import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar';
import axios from "axios";
import "./styles/Play.css";

const Play = () => {
  const [ loggedIn, setLoggedIn ] = useState();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3001/varify')
      .then(result => {
        if(result.data === "Success") {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      })
      .catch(error => 
        console.log(error)
      )
  }, []);

  return (
    <div className="container">
        <Sidebar loggedIn={loggedIn} />
        <div className="play-main">
          <div className="play-option">
            <h2>Play against computer</h2>
            <a href="/game/computer" className="button-default">Play</a>
          </div>
        </div>
    </div>
  );
};

export default Play;
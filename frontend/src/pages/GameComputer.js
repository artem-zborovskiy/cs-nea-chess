import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar';
import axios from "axios";
import ChessBoard from "../chessBoard/ChessBoard";
import "./styles/GameComputer.css";

const GameComputer = () => {
  const [ username, setUsername ] = useState();
  const [ loggedIn, setLoggedIn ] = useState();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3001/varify')
      .then(result => {
        if(result.data === "Success") {
          setLoggedIn(true);
          axios.get('http://localhost:3001/profile')
            .then(result => {
              if(result.data.username) {
                setUsername(result.data.username);
              }
            })
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
        <div className="game-main"> {/* New container that will contain not only board in the future */}
          <ChessBoard/>
          {loggedIn ? 
            <div className="game-player-info">
              <img className="profile-picture-small" alt="profile-picture" src="https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"/>
              <span className="username">{username}</span>
            </div>
            : ''
          }
        </div>
    </div>
  );
};

export default GameComputer;
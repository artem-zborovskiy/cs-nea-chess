import React from "react";
import './styles/Sidebar.css';

const Sidebar = ({ loggedIn }) => {
  return (
    <div className="sidebar">
        <a className="logo" href="/home">Home</a>
        <div className="navigation">
            <a className="button-default" href="/play">Play</a>
            <a className="button-default" href="/puzzles">Puzzles</a>
        </div>
        {loggedIn ? <a className="button-default" href="/profile">Profile</a> : <a className="button-default" href="/auth">Auth</a>}
    </div>
  );
};

export default Sidebar;
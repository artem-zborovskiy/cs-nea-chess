import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './styles/Form.css';

const SignInForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [information, setInformation] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (username.trim() === "" || password.trim() === "") {
            setInformation("All fields must be filled out.");
            return;
        }
        
        if (username.includes(" ")) {
            setInformation("Username cannot contain spaces.");
            return;
        }

        if (password.trim().length < 8) {
            setInformation("Password must be at least 8 characters long.");
            return;
        }

        setInformation("");

        // Send a POST request to the backend server at 'http://localhost:3001/login' 
        // with the username and password entered by the user
        axios.post('http://localhost:3001/login', { username, password })
        .then(result => {
            // If the response from the server is "Success", navigate the user to the home page
            if (result.data === "Success") {
                navigate("/home");
            } else {
                // Otherwise, set the error message (like "Invalid password" or "User does not exist")
                setInformation(result.data);
            }
        })
        // If there is any error during the request (e.g., server down, wrong URL), log it to the console
        .catch(error => console.log(error));
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text"
              placeholder="Enter username"
              autoComplete="off"
              name="username"
              className="form-input"
              onChange={(event) => {setUsername(event.target.value)}}
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password"
              placeholder="Enter password"
              autoComplete="off"
              name="password"
              className="form-input"
              onChange={(event) => {setPassword(event.target.value)}}
            />
          </div>
          <button type="submit" className="button-default">Sign In</button>
          <p className="information">{information}</p>
        </form>
    )
}

export default SignInForm;
import React, { useState } from "react";
import axios from "axios"; // Import dependency for forming and sending requests
import { useNavigate } from "react-router-dom";
import './styles/Form.css';

const SignUpForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");

    const [information, setInformation] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent form from refreshing the page

        // Check for empty fields
        if (username.trim() === "" || password.trim() === "" || confirmPassword.trim() === "" || email.trim() === "") {
            setInformation("All fields must be filled out.");
            return;
        }
        
        // Check if username contains spaces
        if (username.includes(" ")) {
            setInformation("Username cannot contain spaces.");
            return;
        }

        // Check if password is at least 8 characters
        if (password.trim().length < 8) {
            setInformation("Password must be at least 8 characters long.");
            return;
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            setInformation("Passwords do not match.");
            return;
        }
        
        // Check if email is in a valid format (simple regular expression = regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setInformation("Please enter a valid email address.");
            return;
        }

        setInformation("");

        // Send a POST request to the backend server at 'http://localhost:3001/users'
        // and send an object containing username, password, and email
        axios.post('http://localhost:3001/register', { username, password, email })
          // If the request is successful, log the result (the server's response)
          .then(result => {
            if(result.data === "Users with these credentials already exists.") {
              setInformation(result.data);
            } else {
              navigate('/home')
            }
          })
          // If the request fails (e.g., server error, network error), catch the error and log it
          .catch(error => {
            setInformation(error);
            console.log(error)
          })
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
              // Update the username state every time the user types something in the input field
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
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              autoComplete="off"
              name="confirmPassword"
              className="form-input"
              onChange={(event) => {setConfirmPassword(event.target.value)}}
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email"
              placeholder="Confirm password"
              autoComplete="off"
              name="email"
              className="form-input"
              onChange={(event) => {setEmail(event.target.value)}}
            />
          </div>
          <button type="submit" className="button-default">Sign Up</button>
          <p className="information">{information}</p> {/* Text with an error that may have occured when entering information */}
        </form>
    )
}

export default SignUpForm;
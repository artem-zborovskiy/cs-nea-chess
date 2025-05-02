// Import the Express framework for building the server
const express = require("express");
// Import Mongoose to connect and interact with MongoDB
const mongoose = require("mongoose");
// Import CORS middleware to allow cross-origin requests (frontend <-> backend)
const cors = require("cors");
const UserModel = require("./models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON requests automatically
app.use(express.json());
// Middleware to allow requests from different origins (important when frontend and backend are separate)
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(cookieParser());

// Connect to the MongoDB database named 'chessapp' running locally
mongoose.connect("mongodb://localhost:27017/chessapp");

// Define a POST endpoint for '/login'
app.post('/login', (req, res) => {
    // Destructure username and password from the request body
    const { username, password } = req.body;

    // Try to find a user in the database with the provided username
    UserModel.findOne({ username: username })
        .then((user) => {
            if (user) {
                // If user is found, check if the password matches
                bcrypt.compare(password, user.password, (error, response) => {
                    if(response) {
                        // Create a JWT token that contains the user's id as payload,
                        // signed with a secret key ("token-secret-key"), and set it to expire in 1 day.
                        const token = jwt.sign({ _id: user._id }, "token-secret-key", {expiresIn: "1d"});
                        // Send the token to the user's browser as a cookie named "token",
                        // so it can be used to authenticate future requests automatically.
                        res.cookie("token", token);
                        res.json("Success"); // If password is correct, send success response
                    } else {
                        return res.json("Invalid password"); // If password is wrong, send error message
                    }
                })
            } else {
                res.json("This user does not exist"); // If no user is found, send error message
            }
        })
});

// POST route for user registration
app.post('/register', (req, res) => {
    // Extract the username, password, and email from the request body
    const { username, password, email } = req.body;

    // Check if the username or email already exists in the database
    UserModel.findOne({ $or: [{ username }, { email }] })
        .then((existingUser) => {
            if (existingUser) {
                // If a user with the same username or email is found, return an error message
                return res.json("Users with these credentials already exists.");
            }

            // Hash the user's password using bcrypt, with a salt rounds of 10
            bcrypt.hash(password, 10) // The '10' here indicates the number of salt rounds
                .then((hash) => { // This runs if the password is successfully hashed
                    // Create a new user in the database with the hashed password
                    UserModel.create({ username, email, password: hash })
                        .then(user => {
                            // Generate a JWT token with the user's ID and set it to expire in 1 day
                            const token = jwt.sign({ _id: user._id }, "token-secret-key", { expiresIn: "1d" });

                            // Set the token as a cookie for the user
                            res.cookie("token", token);

                            // Return the created user data as a response
                            res.json(user);
                        })
                        .catch(error => {
                            // If there is an error during the user creation, send the error as a JSON response
                            res.json(error);
                        });
                })
                .catch((error) => {
                    // If an error occurs during the hashing process (e.g., bcrypt issues), log the error message to the console
                    console.log(error.message);
                    return res.json("Error hashing password");
                });
        })
        .catch((error) => {
            // If an error occurs while checking for an existing user, log the error and send a response
            console.log(error.message);
            res.json("Error checking existing user");
        });
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json("The token was not found.");
    } else {
        jwt.verify(token, "token-secret-key", (err, decoded) => {
            if(err) {
                return res.json("Token is wrong.");
            } else {
                req.user = decoded; // Attach the decoded data (id) to request
                next();
            }
        });
    }
}

app.get("/varify", verifyUser, (req, res) => {
    return res.json("Success");
});

app.get("/profile", verifyUser, (req, res) => {
    UserModel.findById(req.user._id)  // Retrieve user data from the database using the user ID stored in JWT
        .then(user => {
            res.json({
                username: user.username,
            });
        })
        .catch(err => res.json("Error fetching user profile"));
});

// Start the server on port 3001 and log a message once running
app.listen(3001, () => {
    console.log("Server is running");
});
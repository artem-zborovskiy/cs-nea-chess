// Import mongoose to work with MongoDB
const mongoose = require("mongoose");

// Define a schema that describes the structure of a 'user' document
const UserSchema = new mongoose.Schema({
    username: String,  // Each user must have a username (stored as a String)
    email: String,     // Each user must have an email address (stored as a String)
    password: String   // Each user must have a password (stored as a String)
});

// Create a model called 'users' based on the UserSchema
// This model will be used to interact with the 'users' collection in MongoDB
const UserModel = mongoose.model("users", UserSchema);

// Export the UserModel so it can be imported and used in other files
module.exports = UserModel;
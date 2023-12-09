const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = "newtonSchool";

const decodeToken = (req, res, next) => {
  try {
    let { token } = req.body;
    console.log(token);
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    res.status(200).json({ payload: decodedToken, status: "Success" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Function for user signup
const signup = async (req, res) => {
  // Extract user data from the request body (e.g., username, email, password)
  const { username, email, password } = req.body;
  try {
    // Create a new user instance using the User model
    const user = new User({ username, email, password });
    // Save the user to the database
    await user.save();
    // Handle success and send a success response with user data
    res
      .status(201)
      .json({ message: "User created successfully", data: { user } });
    // Handle errors and send an error response
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Function for user login
const login = async (req, res, next) => {
  // Extract user credentials from the request body (e.g., email, password)
  const { email, password } = req.body;
  // Check if both email and password are provided; if not, send an error response
  if (!email || !password) {
    res.status(400).json({
      status: "error",
      message: "Invalid username or password",
    });
  }
  try {
    // Find the user in the database by their email
    const user = await User.findOne({ email });
    // If the user is not found, send an error response
    if (!user) {
      res.status(401).json({
        status: "error",
        message: "Invalid user",
      });
    }
    // Compare the provided password with the stored password using bcrypt
    // bcrypt.compareSync(password, user.password)
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    // If passwords do not match, send an error response
    if (!isPasswordMatched) {
      res.status(401).json({
        status: "error",
        message: "Invalid password",
      });
    } else {
      // If passwords match, generate a JWT token with user information
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          email: user.email,
        },
        process.env.TOKEN_SECRET,
        {
          // expiresIn: 60*60
          expiresIn: "1h",
        }
      );
      res.status(200).json({status: "success", token})
      // Send the token in the response
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = { login, signup, decodeToken };


// for decoding token
/* jwt.verify(token) */
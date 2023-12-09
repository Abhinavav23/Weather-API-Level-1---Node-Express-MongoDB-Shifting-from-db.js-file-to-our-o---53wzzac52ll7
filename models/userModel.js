const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
// Define the User Schema

const userSchema = new mongoose.Schema(
  {
    // Define the 'username' field
    // 1) The data type of this field is a string
    // 2) This field is required
    // 3) Each username must be unique
    username: {
      type: String,
      required: true,
      unique: true
    },
    // Define the 'email' field
    // email
    // 1) The data type of this field is a string
    // 2) This field is required
    // 3) Each email must be unique
    email: {
      type: String,
      required: true,
      unique: true
    },
    // Define the 'password' field
    //  password
    // 1) The data type of this field is a string
    // 2) This field is required
    // 3) Password should be at least 8 characters long
    password: {
      type: String,
      required: true,
      minLength: 8
    },
  },
  { timestamps: true, versionKey: false } // Automatically generate 'createdAt' and 'updatedAt' timestamps
);

// Pre-save hook to hash the user's password before saving it to the database
userSchema.pre('save', async function (next) {
  const user = this;
  const salt = await bcrypt.genSalt(10);
  // console.log("salt", salt);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  // console.log("user.password", user.password);
  // console.log("hashedPassword", hashedPassword);
  user.password = hashedPassword;
  next();
});

module.exports = mongoose.model('User', userSchema);

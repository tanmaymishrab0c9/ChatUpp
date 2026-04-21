const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER
exports.register=async (req, res) => {
  try {
    const { username, email, password }=req.body;

    // validation
    if (!username||!email||!password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // check existing user
    const existingUser=await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password, salt);

    // create user
    const user=await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Server error" });
  }
};



// LOGIN
exports.login=async (req, res) => {
  try {
    const {email, password }=req.body;

    // validation
    if (!email||!password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // find user
    const user=await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // compare password
    const isMatch=await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // JWT 
    const token=jwt.sign(
      { id: user._id },  
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      userId: user._id,
      username: user.username,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
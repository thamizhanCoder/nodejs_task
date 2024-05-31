const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateOtp = require('../utils/generateOtp');
const sendOtpEmail = require('../utils/sendOtpEmail');

const registerUser = async (req, res) => {
    const { email, password } = req.body;
    if ( !email || !password) {
      return res.json({ 
        status:400,
        message:"All fields are mandatory!",
        data:[]
     });
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
    
      return res.json({ 
        status:400,
        message:"User already registered!",
        data:[]
     });
    }
  
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    const user = await User.create({
      email,
      password: hashedPassword,
    });
  
    console.log(`User created ${user}`);
    if (user) {
      return res.status(201).json({ _id: user.id, email: user.email,message:"User registered successfully" });
    } else {
      return res.json({ 
        status:400,
        message:"User data is not valid",
        data:[]
     });
    }
  };



  const forgotPassword = async (req, res) => {
    console.log(".,kljlkj");
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({ 
          status:404,
          message:"User not found",
          data:[]
       });
      }
  
      // Generate OTP
      const otp = generateOtp(4);
      const otpExpires = Date.now() + 60000; // 1 minute
  
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
      console.log("code");

      const sendEmail = sendOtpEmail(email, otp);

      return res.json({ 
        status:200,
        message:"send to otp your email please check",
        data:otp
     });
  
    } catch (error) {
    console.log("catch");
      return res.json({ 
        status:500,
        message:error.toString(),
        data:[]
     });
    }
  };

  const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
      const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
      if (!user) {
        return res.json({ 
          status:400,
          message:"Invalid OTP or OTP has expired",
          data:[]
       });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
  
      return res.json({ 
        status:200,
        message:"Password has been reset",
        data:[]
     });
    } catch (error) {
      return res.json({ 
        status:500,
        message:error.toString(),
        data:[]
     });
    }
  };

module.exports = { registerUser, forgotPassword, resetPassword };
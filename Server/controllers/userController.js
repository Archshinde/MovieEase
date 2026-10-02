const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/NotificationUtil");

const signUp = async (req, res) => {
  try {
    const { email, password, name, userId } = req.body;

    if (!email || !password || !name || !userId) {
      return res.status(401).json({
        status: false,
        message: "Please enter all required fields for registration",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send({
        success: false,
        message: "The user already exists!",
      });
    }

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashPwd = bcrypt.hashSync(password, salt);

    const otp = otpGenerator();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    // Create new user but set verified to false initially
    const newUser = new User({
      name,
      userId,
      email,
      password: hashPwd,
      otp,
      otpExpiry,
      verified: false, // Unverified user initially
    });

    await newUser.save();

    // Send OTP to user's email
    sendEmail(
      [email],
      "OTP for Email Verification",
      `<h2>Verification Code: ${otp}</h2>
          <p>Please use the above code to verify your email ID for signing into Moviease. <strong>This OTP is valid for the next 5 minutes.</strong></p>
          <p>If you did not request this email, please disregard it. No further action is required. Thank you for your understanding.</p>
          <p>Thank you,<br>Team Moviease 🚀</p>`,
      null
    );

    return res.status(201).send({
      success: true,
      message: "Verification OTP has been sent to your Email",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal server error!",
    });
  }
};

const verifyEmail = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).send({
      success: false,
      message: "Please enter a valid OTP!",
    });
  }

  try {
    const user = await User.findOne({ otp });

    if (!user) {
      return res.status(403).send({
        success: false,
        message: "Incorrect OTP",
      });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(401).send({
        success: false,
        message: "OTP has expired. Please try again!",
      });
    }

    // Mark the user as verified
    user.verified = true;
    user.otp = null; // Clear OTP after successful verification
    user.otpExpiry = null;
    await user.save();

    return res.status(201).send({
      success: true,
      message: "You've successfully signed up, please login now!",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User does not exist. Please Register",
      });
    }

    if (!user.verified) {
    const otp = otpGenerator();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP to user's email
    sendEmail(
      [email],
      "OTP for Email Verification",
      `<h2>Verification Code: ${otp}</h2>
          <p>Please use the above code to verify your email ID for signing into Moviease. <strong>This OTP is valid for the next 5 minutes.</strong></p>
          <p>If you did not request this email, please disregard it. No further action is required. Thank you for your understanding.</p>
          <p>Thank you,<br>Team Moviease 🚀</p>`,
      null
    );

      return res.status(201).send({
        success: true,
        message: "Please verify your email before logging in.",
        verificationRequired: true
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({
        success: false,
        message: "Incorrect password!",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    return res.status(200).send({
      success: true,
      message: "You've successfully logged in!",
      token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error!",
    });
  }
};

const resendOtp = async (req, res) => {
    const { email } = req.body;
   
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
  
      if (user.verified) {
        return res.status(400).send({
          success: false,
          message: "User is already verified",
        });
      }
  
      // Generate new OTP
      const otp = otpGenerator();
      const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
  
      // Update user's OTP and expiry time
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
  
      // Send OTP to user's email
      sendEmail(
        [email],
        "Resend OTP for Email Verification",
        `<h2>Verification Code: ${otp}</h2>
        <p>Please use the above code to verify your email ID for signing into Moviease. <strong>This OTP is valid for the next 5 minutes.</strong></p>
        <p>If you did not request this email, please disregard it. No further action is required. Thank you for your understanding.</p>
        <p>Thank you,<br>Moviease</p>`,
        null
      );
  
      return res.status(200).send({
        success: true,
        message: "OTP resent successfully",
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  };
  

const getCurrentUser = async (req, res) => {
    const userDetails = {
      name: req.userDetails.name,
      email: req.userDetails.email,
      isAdmin: req.userDetails.isAdmin,
    };
  
    return res.status(200).send({
      success: true,
      message: "User is successfully authenticated",
      data: userDetails,
    });
};

const forgetPassword = async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(401).send({
      success: false,
      message: "Please enter Email to proceed!",
    });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not found!",
      });
    }
    //OTP Generation
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();
    sendEmail(
      [user.email],
      "OTP for verification",
      `<div> <h1> OTP: ${otp} </h1> </div>`,
      null
    );

    return res.status(200).send({
      status: "success",
      message: "OTP sent to your email",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { otp, password } = req.body;

  if (!otp || !password) {
    return res.status(401).send({
      status: "failure",
      message: "Invalid Request",
    });
  }

  try {
    const user = await User.findOne({ otp: otp });

    if (!user) {
      return res.status(403).send({
        status: "failure",
        message: "Incorrect OTP",
      });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(401).send({
        status: "failure",
        message: "OTP is expired. Please try again!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPwd = bcrypt.hashSync(password, salt);
    user.password = hashPwd;

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).send({
      status: "success",
      message: "Password reset successfull",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    return res.status(200).send({
      success: true,
      message: "User Details Fetched Successfully",
      data: allUsers,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
module.exports = {
  signUp,
  verifyEmail,
  login,
  getCurrentUser,
  getAllUsers,
  forgetPassword,
  resetPassword,
  resendOtp
};

function otpGenerator() {
  return Math.floor(Math.random() * 100000);
}

const admin = require("../config/firebaseAdmin");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const sendEmail = require("../utils/sendEmail");
const sendGreetingEmail = require("./mail");


const crypto = require("crypto");

exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  // Check for existing user
  let user = await User.findOne({ $or: [{ email }, { username }] });

  if (user) {
    // 🛡️ Fix: Guard against mismatched emails
    if (user.email !== email) {
      return res.status(409).json({
        success: false,
        message: "Username already exists. Please choose another."
      });
    }

    if (user.isVerified) {
      return res.status(409).json({ success: false, message: "User already Exist, Please Login" });
    }


    const otp = crypto.randomInt(100000, 1000000).toString();
    const verifyOtpExpairy = Date.now() + 10 * 60 * 1000;

    user.username = username;
    user.password = password;
    user.verifyOtp = otp;
    user.verifyOtpExpairy = verifyOtpExpairy;
    user.otpAttempts = 0;
    user.otpLockUntil = undefined;
    await user.save();

    // Send email 
    const mailoption = {
      to: email,
      subject: "Verify your Fediverse account 🔐",
      text: `Hello ${username},\n\nWelcome to Fediverse 👋\n\nYour One-Time Password (OTP) to verify your email is:\n\n👉 ${otp}\n\nThis OTP is valid for 10 minutes.\nPlease do not share it with anyone.\n\n— Team Fediverse`
    }

    try {
      await sendEmail(mailoption);
      console.log("OTP email resent to:", email);
      return res.status(200).json({ success: true, message: "OTP resent successfully", next: "Verify_OTP" });
    } catch (err) {
      console.error("OTP email resent failed:", err.message);
      return res.status(500).json({ success: false, message: "Failed to send OTP email. Please try again." });
    }
  }

  // New User Logic

  const otp = crypto.randomInt(100000, 1000000).toString();
  const verifyOtpExpairy = Date.now() + 10 * 60 * 1000;

  user = await User.create({
    username,
    password,
    email,
    actorUrl: `${process.env.BASE_URL}/users/${username}`,
    inbox: `${process.env.BASE_URL}/users/${username}/inbox`,
    outbox: `${process.env.BASE_URL}/users/${username}/outbox`,
    isVerified: false,
    verifyOtp: otp,
    verifyOtpExpairy: verifyOtpExpairy,
    otpAttempts: 0,
    otpLockUntil: undefined
  });
  sendGreetingEmail(email, username)
    .then(() => console.log("Welcome email sent"))
    .catch((err) => console.error("❌ Failed to send greeting email:", err));

  const mailoption = {
    to: email,
    subject: "Verify your Fediverse account 🔐",
    text: `Hello ${username},\n\nWelcome to Fediverse 👋\n\nYour One-Time Password (OTP) to verify your email is:\n\n👉 ${otp}\n\nThis OTP is valid for 10 minutes.\nPlease do not share it with anyone.\n\n— Team Fediverse`
  }

  try {

    await sendEmail(mailoption);
    console.log("OTP email sent to:", email);
  } catch (err) {
    console.error("OTP email failed:", err.message);
    // Cleanup user if email failed so they can try again
    await User.deleteOne({ _id: user._id });
    return res.status(500).json({ success: false, message: "Failed to send OTP email. Please try again." });
  }

  return res.status(201).json({ success: true, message: "Otp Send to Mail", next: "Verify_OTP" });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp !== otp || user.verifyOtpExpairy < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpairy = undefined;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully. You can now login." });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  console.log("📥 Login attempt:", username ? `${username.slice(0, 3)}***` : "unknown");

  const user = await User.findOne({ username }).select("+password +privateKey");

  if (!user || !user.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  //  Enforce Email Verification
  if (!user.isVerified) {
    return res.status(403).json({ error: "Email not verified. Please verify your email first." });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate Token
  const token = jwt.sign({
    id: user._id,
    username: user.username,
    actor: `${process.env.BASE_URL}/users/${user.username}`,
  }, process.env.JWT_SECRET, { expiresIn: "7d" });

  const userData = user.toObject();
  delete userData.password;
  delete userData.privateKey;
  delete userData.verifyOtp;
  delete userData.verifyOtpExpairy;
  delete userData.otpAttempts;
  delete userData.otpLockUntil;

  // Send Login Alert Email (Async - don't wait for it)
  const alertHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa;">
      <h3 style="color: #28a745;">New Login Detected</h3>
      <p>Hello ${user.username},</p>
      <p>We noticed a successful login to your account.</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p>If this was you, you can ignore this email.</p>
    </div>
  `;

  sendEmail({
    to: user.email,
    subject: "New Login Alert 🚨",
    html: alertHtml
  }).catch(err => console.error("Login alert email failed", err));

  return res.json({ token, user: userData });
};




exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Authorization check (for local or remote)
    if (
      post.author?.toString() !== req.user.id &&
      post.actor !== req.user.actor
    ) {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const verifyOtpExpairy = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.verifyOtp = otp;
    user.verifyOtpExpairy = verifyOtpExpairy;
    await user.save();

    const mailoption = {
      to: email,
      subject: "Reset your Password 🔐",
      text: `Hello ${user.username},\n\nYou requested to reset your password.\n\nYour One-Time Password (OTP) is:\n\n👉 ${otp}\n\nThis OTP is valid for 10 minutes.\nIf you did not request this, please ignore this email.\n\n— Team Fediverse`
    };

    await sendEmail(mailoption);

    res.json({ success: true, message: "OTP sent to your email" });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp !== otp || user.verifyOtpExpairy < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    user.verifyOtp = undefined;
    user.verifyOtpExpairy = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully. You can now login." });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//  fire base auth 

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      console.error("[GoogleAuth] No token provided in request body");
      return res.status(400).json({ message: "Token required" });
    }

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(token);
    } catch (verifyErr) {
      console.error("[GoogleAuth] Firebase token verification failed:", verifyErr);
      return res.status(401).json({ message: "Invalid Firebase token", error: verifyErr.message });
    }
    const { email, name } = decoded;

    if (!email) {
      console.error("[GoogleAuth] Email not found in decoded token", decoded);
      return res.status(400).json({ message: "Email not found in Google token" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Use email as username (before @), fallback to full email if needed
      let username = email.split("@")[0];
      // Ensure username is unique
      let existing = await User.findOne({ username });
      if (existing) {
        username = email.replace(/[^a-zA-Z0-9]/g, "_");
      }
      // Generate a random password (Google users won't use it)
      const randomPassword = Math.random().toString(36).slice(-8);
      user = await User.create({
        username,
        password: randomPassword,
        email,
        actorUrl: `${process.env.BASE_URL}/users/${username}`,
        inbox: `${process.env.BASE_URL}/users/${username}/inbox`,
        outbox: `${process.env.BASE_URL}/users/${username}/outbox`,
      });
    }

    let appToken;
    try {
      appToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
          actor: `${process.env.BASE_URL}/users/${user.username}`,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    } catch (jwtErr) {
      console.error("[GoogleAuth] JWT signing failed:", jwtErr);
      return res.status(500).json({ message: "Failed to sign JWT", error: jwtErr.message });
    }

    const userData = user.toObject();
    delete userData.password;
    delete userData.privateKey;

    // Send Login Alert Email (Async - don't wait for it)
    const alertHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa;">
        <h3 style="color: #28a745;">New Login Detected</h3>
        <p>Hello ${user.username},</p>
        <p>We noticed a successful login to your account.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p>If this was you, you can ignore this email.</p>
      </div>
    `;

    sendEmail({
      to: user.email,
      subject: "New Login Alert 🚨",
      html: alertHtml
    }).catch(err => console.error("Login alert email failed", err));

    res.status(200).json({
      message: "Google login successful",
      token: appToken,
      user: userData,
    });

  } catch (err) {
    console.error("[GoogleAuth] Unexpected error:", err);
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
};

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
const options = {  httpOnly: true,  sameSite: "lax",  secure: false};
// Login: Generate both tokens
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email !== "test@gmail.com" || password !== "1234") {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const accessToken = jwt.sign({ email },process.env.ACCESS_SECRET,{ expiresIn: "15s" }  );
  const refreshToken = jwt.sign({ email },process.env.REFRESH_SECRET,{ expiresIn: "7d" } );
  res.cookie("accessToken", accessToken, { ...options, maxAge: 5 * 1000});
  res.cookie("refreshToken", refreshToken, { ...options,maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ message: "Login successful" });
});
// Verify access token
app.get("/profile", (req, res) => {
  try {
    const user = jwt.verify(req.cookies.accessToken,process.env.ACCESS_SECRET );
    res.json({ message: "Profile accessed", user });
  } catch {
    res.status(401).json({ message: "Access token expired or invalid" });
  }
});
// Refresh tokens
app.post("/refresh", (req, res) => {
  try {
    const user = jwt.verify(req.cookies.refreshToken,process.env.REFRESH_SECRET );
    const accessToken = jwt.sign( { email: user.email }, process.env.ACCESS_SECRET, { expiresIn: "15s" });
    const refreshToken = jwt.sign( { email: user.email },process.env.REFRESH_SECRET,  { expiresIn: "7d" });
    res.cookie("accessToken", accessToken, {  ...options,  maxAge: 15 * 1000 });
    res.cookie("refreshToken", refreshToken, {  ...options,  maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ message: "Tokens refreshed successfully" });
  } catch {
    res.status(401).json({ message: "Refresh token expired. Login again." });
  }
});
// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
  res.json({ message: "Logged out" });
});
app.listen(3000, () => console.log("Server running on port 3000"));

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const fetchuser = async (req, res, next) => {
  //This function will act as a middleware
  //Getting user from jwt token and add id to request object
  const token = req.header("auth-token");
  if (!token)
    return res.status(401).json({ error: "Access denied", success: false });

  try {
    const data = jwt.verify(token, `${process.env.JWT_SECRET}`);
    let userId = data.userId;
    if (!mongoose.isValidObjectId(userId))
      return res.status(401).json({ error: "Invalid auth token" });
    let user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: "Invalid auth token" });
    req.userId = userId;
    next(); //Here next means next function in the router argument, which is our async function, will get called
  } catch (error) {
    return res.status(401).json({ error: "Please authenticate the token" });
  }
};

module.exports = fetchuser;

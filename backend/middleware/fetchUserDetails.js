const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config");

const fetchuser = (req, res, next) => {
  //This function will act as a middleware
  //Getting user from jwt token and add id to request object
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied");

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next(); //Here next means next function in the router argument, which is our async function, will get called
  } catch (error) {
    res.send(401).send({ error: "Please authenticate the token" });
  }
};

module.exports = fetchuser;

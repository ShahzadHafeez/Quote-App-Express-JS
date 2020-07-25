const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  //console.log(req.cookies.auth_token);
  const token = req.header("auth_token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verify = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.user = verify;
    next();
  } catch (err) {
    res.status(401).send("Invalid Token");
  }
};

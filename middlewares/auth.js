const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/user/login')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SCRETE);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.redirect('/user/login');
  }
}

module.exports = {
    verifyToken
}

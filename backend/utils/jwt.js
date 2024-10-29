const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.config");

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET);
}

function verifyToken(token) {
  try {
    let data = jwt.verify(token, JWT_SECRET);
    return data;
  } catch (err) {
    return false;
  }
}

module.exports = { generateToken, verifyToken };
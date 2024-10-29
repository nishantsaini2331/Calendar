const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { verifyToken } = require("../utils/jwt");

const verifyUser = async (req, res, next) => {
  try {
    
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please sign in",
      });
    }

    try {
      const user = await verifyToken(token);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Please sign in",
        });
      }
      req.user = user.id;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token verification failed",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "An error occurred",
    });
  }
};

module.exports = verifyUser;
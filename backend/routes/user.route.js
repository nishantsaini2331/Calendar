const express = require("express");

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  googleAuth,
} = require("../controllers/user.controller");

const route = express.Router();

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5zMDEwOTM3NUBnbWFpbC5jb20iLCJpZCI6IjY3MWYxODI4ZDA1OThlNzcxNWVhMTA3ZSIsImlhdCI6MTczMDA5MTE1OH0.IkdNAebP9TCgyZmA3xh1w3PDQr5-_Qzu98QndxCpn9U

route.post("/signup", createUser);
route.post("/signin", login);

route.post("/google-auth", googleAuth);

route.get("/users", getAllUsers);

route.get("/users/:id", getUserById);

route.patch("/users/:id", updateUser);

route.delete("/users/:id", deleteUser);

module.exports = route;

const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  isCompleted,
} = require("../controllers/event.contoller");
const verifyUser = require("../middleware/auth.middleware");
const route = express.Router();

route.post("/events", verifyUser, createEvent);
route.get("/events", verifyUser, getAllEvents);
route.get("/events/:id", verifyUser, getEventById);
route.patch("/events/:id", verifyUser, updateEvent);
route.delete("/events/:id", verifyUser, deleteEvent);

route.patch("/events/:id/completed", verifyUser, isCompleted);

module.exports = route;

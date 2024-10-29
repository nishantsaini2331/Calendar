const Event = require("../models/event.model");
const User = require("../models/user.model");

async function createEvent(req, res) {
  const { title, description, date, time } = req.body;

  try {
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Please enter the title",
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Please enter the description",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Please enter the date",
      });
    }

    if (!time) {
      return res.status(400).json({
        success: false,
        message: "Please enter the end time",
      });
    }

    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      user: req.user,
    });

    await User.findOneAndUpdate(
      { _id: req.user },
      { $push: { events: newEvent._id } }
    );

    return res.status(200).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "An error occurred",
    });
  }
}

async function getAllEvents(req, res) {
  try {
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "Please sign in",
      });
    }

    const events = (await Event.find({ user: req.user })) || [];

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "An error occurred",
    });
  }
}

async function getEventById(req, res) {
  const { id } = req.params;
  try {
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "Please sign in",
      });
    }
    const event = await Event.findOne({ _id: id, user: req.user });

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "An error occurred",
    });
  }
}

async function updateEvent(req, res) {
  const { id } = req.params;

  const { title, description, start, end } = req.body;

  try {
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "Please sign in",
      });
    }

    const event = await Event.findOneAndUpdate(
      { _id: id, user: req.user },
      { title, description, start, end },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      event,
      message: "Event updated successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "An error occurred",
    });
  }
}

async function deleteEvent(req, res) {
  const { id } = req.params;
  try {
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "Please sign in",
      });
    }
    await Event.findOneAndDelete({ _id: id, user: req.user });

    await User.findOneAndUpdate({ _id: req.user }, { $pull: { events: id } });
    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "An error occurred",
    });
  }
}

async function isCompleted(req, res) {
  const { id } = req.params;

  try {
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "Please sign in",
      });
    }
    const event = await Event.findOne({ _id: id, user: req.user });

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Event not found",
      });
    }
    event.isCompleted = !event.isCompleted;

    await event.save();

    if (event.isCompleted) {
      return res.status(200).json({
        success: true,
        event,
        message: "Event completed successfully",
      });
    } else {
      return res.status(200).json({
        success: true,
        event,
        message: "Event marked as incomplete",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "An error occurred",
    });
  }
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  isCompleted,
};

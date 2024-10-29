import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  resetEventToEdit,
  setEvents,
  setIsEdit,
  setIsModelOpen,
} from "../store/eventSlice";
import { fetchEvents } from "../pages/HomePage";

function Modal({ type = "add" }) {
  const { selectedDate, events, eventToEdit } = useSelector(
    (state) => state.event
  );

  const [newEvent, setNewEvent] = useState(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return {
      title: eventToEdit.title || "",
      description: eventToEdit.description || "",
      date:
        eventToEdit.date || new Date(selectedDate).toLocaleDateString("en-CA"),
      time: eventToEdit.time || `${hours}:${minutes}`,
    };
  });

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  async function handleAddEvent() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/events`,

        newEvent,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      dispatch(setEvents([...events, response.data.event]));
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }

    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "12:00",
    });
  }

  async function handleUpdateEvent() {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/events/${eventToEdit._id}`,
        newEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      fetchEvents(token, dispatch);
      dispatch(setIsEdit(false));
      dispatch(resetEventToEdit());
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">
          {type == "edit" ? "Edit Event" : "Create New Event"}
        </h2>

        <div className="mt-4">
          <label className="block text-sm font-medium ">Event Name</label>
          <input
            type="text"
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            placeholder="Event Name"
            className="w-full border rounded-md px-3 py-2 mt-2"
            value={newEvent.title}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium ">
            Event Description
          </label>
          <textarea
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            placeholder="Event Description"
            className="w-full border rounded-md px-3 py-2 mt-2"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium ">Event Date</label>
          <input
            type="date"
            className="w-full border rounded-md px-3 py-2 mt-2"
            defaultValue={
              type == "edit"
                ? new Date(eventToEdit.date).toLocaleDateString("en-CA")
                : newEvent.date
            }
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                date: e.target.value,
              })
            }
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium ">Event Time</label>
          <input
            type="time"
            className="w-full border rounded-md px-3 py-2 mt-2"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={
              type == "edit"
                ? () => {
                    dispatch(setIsEdit(false));
                    dispatch(resetEventToEdit());
                  }
                : () => dispatch(setIsModelOpen(false))
            }
            className="px-4 py-2 border rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={type == "edit" ? handleUpdateEvent : handleAddEvent}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvents,
  handleDeleteEvent,
  handleIsCompleted,
} from "../pages/HomePage";
import { setEventToEdit, setIsEdit } from "../store/eventSlice";
import Modal from "./Modal";
import { dateFormat, timeFormat } from "../utils/timeFormat";

function AllEvents() {
  const { token } = useSelector((state) => state.user);
  const [filter, setFilter] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const dispatch = useDispatch();
  const { isEdit, events } = useSelector((state) => state.event);

  useEffect(() => {
    fetchEvents(token, dispatch);
  }, [token, dispatch]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredEvents(events);
    } else if (filter === "completed") {
      setFilteredEvents(events.filter((event) => event.isCompleted));
    } else if (filter === "incomplete") {
      setFilteredEvents(events.filter((event) => !event.isCompleted));
    } else if (filter === "today") {
      setFilteredEvents(
        events.filter(
          (event) =>
            new Date(event.date).toDateString() === new Date().toDateString()
        )
      );
    }
  }, [filter, events]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-5">All Events</h1>
      <div className="flex justify-center">
        <select
          className="p-2 border border-gray-300 rounded-lg mt-4"
          name="filter"
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
          <option value="today">Today</option>
        </select>
      </div>
      <div className="flex flex-wrap justify-center">
        {filteredEvents.length === 0 ? (
          <h1 className="text-2xl font-bold text-center mt-5">
            No events to show
          </h1>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className={`shadow-lg rounded-lg p-4 m-4 w-64 ${
                event.isCompleted ? "bg-green-200" : "bg-gray-100"
              }`}
            >
              <h2 className="text-xl font-bold">{event.title}</h2>
              <p className="line-clamp-1">{event.description}</p>
              <p>{dateFormat(event.date)}</p>
              <p>{timeFormat(event.time)}</p>
              <div className="flex space-x-2 items-center justify-center bg-gray-600/15 p-3  rounded-full mt-2">
                <div class="flex items-center">
                  <input
                    checked={event.isCompleted}
                    id="checked-checkbox"
                    type="checkbox"
                    value=""
                    onChange={() =>
                      handleIsCompleted(token, event._id, dispatch)
                    }
                    class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="checked-checkbox"
                    class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  ></label>
                </div>
                <i
                  onClick={() =>
                    dispatch(setEventToEdit(event)) && dispatch(setIsEdit(true))
                  }
                  className="fi fi-bs-pencil cursor-pointer mt-1 text-xl"
                ></i>
                <i
                  onClick={() => handleDeleteEvent(token, event._id, dispatch)}
                  className="fi fi-rr-trash cursor-pointer mt-1 text-xl"
                ></i>
              </div>
            </div>
          ))
        )}
      </div>
      {isEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Modal type="edit" />
        </div>
      )}
    </div>
  );
}

export default AllEvents;
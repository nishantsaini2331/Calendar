import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setIsModelOpen, setSelectedDate2 } from "../store/eventSlice";
import EventList from "./EventList";

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const { modifiedEvent } = useSelector((state) => state.event);
  const dispatch = useDispatch();

  const [newEvent, setNewEvent] = useState(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return {
      title: "",
      description: "",
      date: "",
      time: `${hours}:${minutes}`,
    };
  });

  const { token } = useSelector((state) => state.user);

  function generateCalendarDays() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const days = [];

    const startingDay = firstDay.getDay();

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }

    return days;
  }

  function handleDateClick(date) {
    dispatch(setIsModelOpen(false));
    dispatch(setSelectedDate2(date.toISOString()));
    setSelectedDate(date);
    setNewEvent({
      ...newEvent,
      date: date.toLocaleDateString("en-CA"),
    });
  }

  function handlePrevMonth() {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
    }
  }

  function handleNextMonth() {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
    }
  }

  function handleMonthChange(event) {
    setCurrentMonth(parseInt(event.target.value));
  }

  function handleYearChange(event) {
    setCurrentYear(parseInt(event.target.value));
  }

  const days = generateCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!token) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="p-4 flex ">
      <div className="bg-white rounded-lg shadow-lg w-full ">
        <div className="w-full p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span role="img" aria-label="calendar">
              📅
            </span>
            Calendar with Events
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="px-2 py-1 border rounded-md hover:bg-gray-100"
            >
              Prev
            </button>
            <select
              value={currentMonth}
              onChange={handleMonthChange}
              className="px-2 py-1 border rounded-md"
            >
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index} value={index}>
                  {new Date(0, index).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={currentYear}
              onChange={handleYearChange}
              className="w-20 px-2 py-1 border rounded-md"
            />
            <button
              onClick={handleNextMonth}
              className="px-2 py-1 border rounded-md hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center font-semibold p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 ">
              {days.map((date, index) => (
                <div
                  key={index}
                  className={`
                    min-h-[7rem] border rounded-md
                    ${date ? "cursor-pointer hover:bg-gray-100 " : ""}
                    ${
                      date &&
                      selectedDate &&
                      date.toDateString() === selectedDate.toDateString()
                        ? "bg-blue-100"
                        : ""
                    }
                   
                   
                  `}
                  onClick={() => date && handleDateClick(date)}
                >
                  {date && (
                    <div
                      className={`w-full h-full  p-2 ${
                        date.getDate() == new Date().getDate() &&
                        date.getMonth() == new Date().getMonth() &&
                        date.getFullYear() == new Date().getFullYear()
                          ? "bg-blue-300"
                          : ""
                      }`}
                    >
                      <div className="font-medium text-lg">
                        {date.getDate()}
                      </div>

                      <EventList date={date} modifiedEvent={modifiedEvent} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;

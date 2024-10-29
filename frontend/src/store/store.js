import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import calendarSlice from "./calendarSlice";
import eventSlice from "./eventSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    calendar: calendarSlice,
    event: eventSlice,
  },
});

export default store;
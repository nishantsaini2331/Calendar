import { createSlice, isPending } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    selectedDate: new Date().toLocaleDateString("en-CA"),
    events: [],
    modifiedEvent: {},
    isModalOpen: false,
    isEdit: false,
    eventToEdit: {},
  },
  reducers: {
    setSelectedDate2(state, action) {
      state.selectedDate = action.payload;
    },

    setEvents(state, action) {
      const events = action.payload.reduce((acc, event) => {
        const date = new Date(event.date).toDateString();
        acc[date] = [...(acc[date] || []), event];
        return acc;
      }, {});

      state.events = action.payload;
      state.modifiedEvent = events;
    },

    setIsModelOpen(state, action) {
      state.isModalOpen = action.payload;
    },
    setIsEdit(state, action) {
      state.isEdit = action.payload;
    },

    setEventToEdit(state, action) {
      state.eventToEdit = action.payload;
    },
    resetEventToEdit(state) {
      state.eventToEdit = {};
    },
  },
});

export const {
  setSelectedDate2,
  setEvents,
  setModifiedEvent,
  setIsModelOpen,
  setIsEdit,
  setEventToEdit,
  resetEventToEdit,
} = eventSlice.actions;

export default eventSlice.reducer;

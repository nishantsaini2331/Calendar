import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: JSON.parse(localStorage.getItem("user")) || { token: null },
  reducers: {
    setUser: (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;
    },
    removeUser: (state) => {
        localStorage.removeItem("user");
      return { token: null };
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
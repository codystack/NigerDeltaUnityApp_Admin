import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    removeUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData, removeUserData } = userSlice.actions;

export default userSlice.reducer;

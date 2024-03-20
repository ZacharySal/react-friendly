import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  modal: {
    enabled: false,
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setModal: (state, action) => {
      state.modal = action.payload;
    },
  },
});

export const { setMode, setModal } = appSlice.actions;

export default appSlice.reducer;

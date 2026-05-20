import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/user.types";

const requestSlice = createSlice({
  name: "request",
  initialState: null as User[] | null,
  reducers: {
    addRequest: (_state, action: PayloadAction<User[]>) => {
      return action.payload;
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      if (!state) return state;
      return state.filter((r) => r._id !== action.payload);
    },
  },
});

export const { addRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;


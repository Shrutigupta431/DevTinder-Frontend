import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/user.types";

const feedSlice = createSlice({
  name: "feed",
  initialState: null as User[] | null,
  reducers: {
    addFeed: (_state, action: PayloadAction<User[]>) => {
      return action.payload;
    },
    removeFromFeed: (state, action: PayloadAction<string>) => {
      if (!state) return state;
      return state.filter((r) => r._id !== action.payload);
    },
  },
});
export const { addFeed, removeFromFeed } = feedSlice.actions;
export default feedSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/user.types";

const feedSlice = createSlice({
    name: "feed",
    initialState: null as User[] | null,
    reducers: {
        addFeed: (_state, action: PayloadAction<User[]>) => {
            return action.payload;
        },
        removeFeed: () => {
            return null;
        },
    },
});
export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
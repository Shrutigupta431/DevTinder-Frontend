import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/user.types";

const requestSlice = createSlice({
    name: "request",
    initialState: null as User[] | null,
    reducers: {
        addRequest: (_state, action: PayloadAction<User[]>) => {
            return action.payload;
        },
    },
});

export const { addRequest} = requestSlice.actions;
export default requestSlice.reducer;
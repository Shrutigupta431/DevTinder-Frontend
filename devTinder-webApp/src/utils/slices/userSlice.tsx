import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/user.types";

const userSlice = createSlice({
    name: "user",
    initialState: null as User | null,
    reducers: {
        addUser: (_, action: PayloadAction<User>) => {
            return action.payload;
        },
        removeUser: () => {
            return null;
        },
    },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
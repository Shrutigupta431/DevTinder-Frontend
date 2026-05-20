import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/user.types";

const userSlice = createSlice({
    name: "user",
    initialState: null as User | null,
    reducers: {
        addUser: (_state, action: PayloadAction<User>) => {
            return action.payload;
        },
        removeUser: () => {
            return null;
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state) {
                return { ...state, ...action.payload };
            }
            return state;
        },
    },
});

export const { addUser, removeUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
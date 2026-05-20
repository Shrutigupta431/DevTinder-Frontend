import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import feedReducer from "../slices/feedSlice";
import connectionReducer from "../slices/connectionSlice";
import requestReducer from "../slices/requestSlice";

export const appStore = configureStore({
    reducer: {
        user: userReducer,
        feed :feedReducer,
        connection: connectionReducer,
        request:requestReducer,
    },
});

export type AppStore = typeof appStore;
export type AppDispatch = typeof appStore.dispatch;
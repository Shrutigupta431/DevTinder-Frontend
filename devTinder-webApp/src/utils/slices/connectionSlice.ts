import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name:"connection",
    initialState:null,
    reducers :{
        addConnections :(_state,action)=>action.payload,
        removeConnection :() => null
    }
})
export const {addConnections,removeConnection} =connectionSlice.actions;
export default connectionSlice.reducer;
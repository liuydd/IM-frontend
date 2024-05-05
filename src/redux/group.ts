import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GroupState {
    name: string;
    groupid: number;
}

const initialState: GroupState = {
    name: "",
    groupid: 0, // 群ID
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setUserid: (state, action: PayloadAction<number>) => {
            state.groupid = action.payload;
        },
        resetAuth: (state) => {
            state.name = "";
            state.groupid = 0;
        },
    },
});

export const {setName, setUserid, resetAuth } = authSlice.actions;
export default authSlice.reducer;

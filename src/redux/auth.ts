import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string;
    name: string;
    password: string;
    userid: number;
}

const initialState: AuthState = {
    token: "",
    name: "",
    password: "",
    userid: 0, // 用户ID
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        setUserid: (state, action: PayloadAction<number>) => {
            state.userid = action.payload;
        },
        resetAuth: (state) => {
            state.token = "";
            state.name = "";
            state.password = "";
            state.userid = 0;
        },
    },
});

export const { setToken, setName, setPassword, setUserid, resetAuth } = authSlice.actions;
export default authSlice.reducer;

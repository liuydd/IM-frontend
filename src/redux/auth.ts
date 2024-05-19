import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string;
    name: string;
    password: string;
    userid: number;
    avatar: string;
}

const initialState: AuthState = {
    token: "",
    name: "",
    password: "",
    userid: 0, // 用户ID
    avatar: "faye", 
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
        setavatar: (state, action: PayloadAction<string>) => {
            state.avatar = action.payload;
        },
        resetAuth: (state) => {
            state.token = "";
            state.name = "";
            state.password = "";
            state.userid = 0;
            state.avatar = "faye";
        },
    },
});

export const { setToken, setName, setPassword, setUserid, setavatar, resetAuth } = authSlice.actions;
export default authSlice.reducer;

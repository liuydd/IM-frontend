import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string;
    name: string;
    password: string;
}

const initialState: AuthState = {
    token: "",
    name: "",
    password: "",
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
        resetAuth: (state) => {
            state.token = "";
            state.name = "";
            state.password = "";
        },
    },
});

export const { setToken, setName, setPassword, resetAuth } = authSlice.actions;
export default authSlice.reducer;

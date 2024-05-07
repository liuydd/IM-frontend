import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import boardReducer from "./board";
import groupReducer from "./group";

const store = configureStore({
    reducer: {
        auth: authReducer,
        board: boardReducer,
        group: groupReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

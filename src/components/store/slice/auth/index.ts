// slice/auth.ts

import { createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "../../../common/types/auth";

const initialState: IAuthState = {
    user: {},
    isLogged: false,
    token: null, // Добавляем поле для хранения токена
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload.user;
            state.isLogged = true;
            state.token = action.payload.token; // Сохраняем токен
        },
        register(state, action) {
            state.user = action.payload.user;
            state.isLogged = true;
            state.token = action.payload.token; // Сохраняем токен
        },
        logout(state) {
            state.user = {};
            state.isLogged = false;
            state.token = null; // Очищаем токен при выходе
        },
    },
});

export const { login, register, logout } = authSlice.actions;
export default authSlice.reducer;

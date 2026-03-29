import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import localStorageService from "../Services/LocalStorageService";
import type { AuthResponse } from "../Models/User.model";
import type { AuthState } from "../Models/AuthState.model";

function loadInitialState(): AuthState {
  const storedState = localStorageService.getItem<typeof initialState>("auth");

  if (storedState) {
    return storedState;
  }

  return {
    loggedIn: false,
    token: null,
    user: {
      email: null,
      sub: null,
      role: null,
      nbf: null,
      exp: null,
      iat: null,
      iss: null,
      aud: null,
    },
  };
}

const initialState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthResponse>) {
      const { token, user } = action.payload;
      state.loggedIn = true;
      state.token = token;
      state.user = { ...state.user, ...(user ?? {}) };

      localStorageService.setItem("auth", state);
    },
    logout() {
      localStorageService.removeItem("auth");
      return initialState;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

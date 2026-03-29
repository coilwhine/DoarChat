import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import localStorageService from "../Services/LocalStorageService";
import type { AuthResponse } from "../Models/User.model";

interface AuthState {
  loggedIn: boolean;
  token: string | null;
  user: {
    email: string | null;
    sub: string | null;
    role: string | null;
    nbf: number | null;
    exp: number | null;
    iat: number | null;
    iss: string | null;
    aud: string | null;
  };
}

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
      state.user.sub = user?.sub ?? null;
      state.user.email = user?.email ?? null;
      state.user.role = user?.role ?? null;
      state.user.nbf = user?.nbf ?? null;
      state.user.exp = user?.exp ?? null;
      state.user.iat = user?.iat ?? null;
      state.user.iss = user?.iss ?? null;
      state.user.aud = user?.aud ?? null;

      localStorageService.setItem("auth", state);
    },
    logout(state) {
      state.loggedIn = false;
      state.token = null;
      state.user.email = null;
      state.user.sub = null;
      state.user.role = null;
      state.user.nbf = null;
      state.user.exp = null;
      state.user.iat = null;
      state.user.iss = null;
      state.user.aud = null;

      localStorageService.removeItem("auth");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

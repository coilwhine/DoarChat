import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import localStorageService from "../Services/LocalStorage.Service";
import type { AuthResponse } from "../Models/Auth.model";
import type { AuthState } from "../Models/Auth.model";

const baseAuthState: AuthState = {
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

function createEmptyAuthState(): AuthState {
  return {
    ...baseAuthState,
    user: { ...baseAuthState.user },
  };
}

function loadInitialState(): AuthState {
  const storedState = localStorageService.getItem<typeof initialState>("auth");

  if (storedState) {
    return storedState;
  }

  return createEmptyAuthState();
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
      return createEmptyAuthState();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

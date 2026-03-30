import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import localStorageService from "../Services/LocalStorage.service";
import type { AuthResponse } from "../Models/Auth.model";
import type { AuthState } from "../Models/Auth.model";

const baseAuthState: AuthState = {
  loggedIn: false,
  token: null,
  user: {
    name: null,
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
    const sub = storedState.user?.sub;
    if (typeof sub === "string") {
      const parsed = Number(sub);
      storedState.user.sub = Number.isFinite(parsed) ? parsed : null;
    }
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
      state.user = {
        ...state.user,
        ...(user ?? {}),
        name: user?.name ?? null,
        sub:
          user?.sub != null && Number.isFinite(Number(user.sub))
            ? Number(user.sub)
            : null,
      };

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

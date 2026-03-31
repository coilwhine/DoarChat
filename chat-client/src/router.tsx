import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App";
import AppHome from "./components/Pages/AppHome/AppHome";
import AuthPage from "./components/Pages/AuthPage/AuthPage";
import { store } from "./store/store";

function requireAuthLoader() {
  const state = store.getState();
  const isAuthed = state.auth.loggedIn;

  if (!isAuthed) {
    return redirect("/auth");
  }

  return null;
}

function publicOnlyLoader() {
  const state = store.getState();
  const isAuthed = state.auth.loggedIn;

  if (isAuthed) {
    return redirect("/app");
  }

  return null;
}

function rootRedirectLoader() {
  const state = store.getState();
  const isAuthed = state.auth.loggedIn;

  return redirect(isAuthed ? "/app" : "/auth");
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        loader: rootRedirectLoader,
      },
      {
        path: "auth",
        element: <AuthPage />,
        loader: publicOnlyLoader,
      },
      {
        path: "app",
        loader: requireAuthLoader,
        children: [
          {
            index: true,
            element: <AppHome />,
          },
        ],
      },
      {
        path: "main",
        loader: () => redirect("/app"),
      },
      {
        path: "*",
        loader: rootRedirectLoader,
      },
    ],
  },
]);

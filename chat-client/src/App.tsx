import "./App.scss";
import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App(): ReactElement {
  return (
    <div className="App">
      <Header />
      <main className="AppMain">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;

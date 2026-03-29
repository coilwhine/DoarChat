import type { ReactElement } from "react";
import "./AppHome.scss";
import { useAppSelector } from "../../../store/hooks";

function AppHome(): ReactElement {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="AppHome Page">
      <h1>Home Page</h1>
    </div>
  );
}

export default AppHome;

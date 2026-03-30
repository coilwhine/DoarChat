import type { ReactElement } from "react";
import { useAppSelector } from "../../../store/hooks";
import "./AppHome.scss";

function AppHome(): ReactElement {
  const user = useAppSelector((state) => state.auth.user);

  return <div className="AppHome Page"></div>;
}

export default AppHome;

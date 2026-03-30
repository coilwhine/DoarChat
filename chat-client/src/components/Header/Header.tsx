import { type ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import "./Header.scss";

function Header(): ReactElement {
  const authData = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function logOutClick() {
    dispatch(logout());
    navigate("/auth", { replace: true });
  }

  return (
    <header className="AppHeader">
      <div className="inner">
        <Link className="brand" to="/main">
          Israel Post Chat
        </Link>

        {authData.loggedIn && <span>{`Welcome ${authData.user.name}`}</span>}

        {authData.loggedIn && (
          <button className="btn primary" onClick={logOutClick}>
            LogOut
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;

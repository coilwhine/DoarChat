import { useEffect, type ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/authSlice";

function Header(): ReactElement {
  const authData = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth data in header:", authData);
  }, [authData]);

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

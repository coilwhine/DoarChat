import { type ReactElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import usersService from "../../Services/Users.service";
import ConfirmDialog from "../Common/ConfirmDialog";
import "./Header.scss";

function Header(): ReactElement {
  const authData = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function logOutClick() {
    dispatch(logout());
    navigate("/auth", { replace: true });
  }

  async function deleteUserClick() {
    const userId = authData.user?.sub;
    if (!userId) return;

    try {
      await usersService.deleteById(userId);
      dispatch(logout());
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }

  return (
    <header className="AppHeader">
      <div className="inner">
        <Link className="brand" to="/app">
          Israel Post Chat
        </Link>

        {authData.loggedIn && <span>{`Welcome ${authData.user.name}`}</span>}

        {authData.loggedIn && (
          <div className="actions">
            <button
              className="btn danger"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete User
            </button>
            <button className="btn primary" onClick={logOutClick}>
              Log Out
            </button>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete account"
        text="Are you sure you want to delete your account? This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          setShowDeleteDialog(false);
          await deleteUserClick();
        }}
      />
    </header>
  );
}

export default Header;

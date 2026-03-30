import type { ReactElement } from "react";
import { useState } from "react";
import "./AppHome.scss";
import UsersDrawer from "./UsersDrawer";
import ChatPane from "./ChatPane/ChatPane";
import type { User } from "../../../Models/User.model";

function AppHome(): ReactElement {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="AppHome Page">
      <UsersDrawer
        selectedUserId={selectedUser?.id ?? null}
        onSelectUser={(user) => setSelectedUser(user)}
      />
      <ChatPane selectedUser={selectedUser} />
    </div>
  );
}

export default AppHome;

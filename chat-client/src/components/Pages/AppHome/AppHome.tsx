import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import "./AppHome.scss";
import UsersDrawer from "./UsersDrawer/UsersDrawer";
import ChatPane from "./ChatPane/ChatPane";
import type { User } from "../../../Models/User.model";
import { useAppSelector } from "../../../store/hooks";
import chatHub from "../../../Services/ChatHub.service";

function AppHome(): ReactElement {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn) {
      void chatHub.stop();
      return;
    }

    chatHub.start().catch((error) => {
      console.error("Failed to connect to chat hub:", error);
    });

    const connection = chatHub.getConnection();

    const handleMessageReceived = (payload: unknown) => {
      console.log("MessageReceived", payload);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    };

    const handleMessageRead = (payload: unknown) => {
      console.log("MessageRead", payload);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    };

    connection.on("MessageReceived", handleMessageReceived);
    connection.on("MessageRead", handleMessageRead);

    return () => {
      connection.off("MessageReceived", handleMessageReceived);
      connection.off("MessageRead", handleMessageRead);
      void chatHub.stop();
    };
  }, [isLoggedIn, queryClient]);

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

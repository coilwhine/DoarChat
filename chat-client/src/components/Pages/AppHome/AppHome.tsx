import { useQueryClient } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import type {
  MessageItem,
  MessageReadEvent,
  UserDeletedEvent,
  UserRegisteredEvent,
} from "../../../Models/SignalREvents.model";
import type { User } from "../../../Models/User.model";
import chatHub from "../../../Services/ChatHub.service";
import { useAppSelector } from "../../../store/hooks";
import "./AppHome.scss";
import ChatPane from "./ChatPane/ChatPane";
import UsersDrawer from "./UsersDrawer/UsersDrawer";

function AppHome(): ReactElement {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const selectedUserIdRef = useRef<number | null>(null);
  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);
  const queryClient = useQueryClient();

  useEffect(() => {
    selectedUserIdRef.current = selectedUser?.id ?? null;
  }, [selectedUser?.id]);

  useEffect(() => {
    if (!isLoggedIn) {
      void chatHub.stop();
      return;
    }

    chatHub.start().catch((error) => {
      console.error("Failed to connect to chat hub:", error);
    });

    const connection = chatHub.getConnection();

    const handleMessageReceived = (payload: MessageItem) => {
      console.log("handleMessageReceived", payload);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    };

    const handleMessageRead = (payload: MessageReadEvent) => {
      console.log("handleMessageRead", payload);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    };

    const handleUserRegistered = (payload: UserRegisteredEvent) => {
      console.log("handleUserRegistered", payload);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    };

    const handleUserDeleted = (payload: UserDeletedEvent) => {
      console.log("handleUserDeleted", payload);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (selectedUserIdRef.current === payload.id) {
        setSelectedUser(null);
      }
    };

    connection.on("MessageReceived", handleMessageReceived);
    connection.on("MessageRead", handleMessageRead);
    connection.on("UserRegistered", handleUserRegistered);
    connection.on("UserDeleted", handleUserDeleted);

    return () => {
      connection.off("MessageReceived", handleMessageReceived);
      connection.off("MessageRead", handleMessageRead);
      connection.off("UserRegistered", handleUserRegistered);
      connection.off("UserDeleted", handleUserDeleted);
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

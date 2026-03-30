import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "../../../../Models/User.model";
import type { Message } from "../../../../Models/Message.model";
import "./ChatPane.scss";
import ChatInput from "./ChatInput/ChatInput";
import messagesService from "../../../../Services/Messages.service";
import ChatBubble from "./ChatBubble/ChatBubble";
import { useAppSelector } from "../../../../store/hooks";

type ChatPaneProps = {
  selectedUser: User | null;
};

function ChatPane({ selectedUser }: ChatPaneProps): ReactElement {
  const receiverUserId = selectedUser ? selectedUser.id : null;
  const currentUserId = useAppSelector((state) => state.auth.user.sub);

  const messagesQuery = useQuery({
    queryKey: ["messages", receiverUserId],
    queryFn: () => {
      if (!receiverUserId) return Promise.resolve([] as Message[]);
      return messagesService.getConversation(receiverUserId);
    },
    enabled: receiverUserId != null,
  });

  return (
    <section className="ChatPane">
      <div className="header">{selectedUser ? selectedUser.name : "Chat"}</div>
      <div className="body">
        {!selectedUser && (
          <div className="empty">Select a user to view messages.</div>
        )}
        {selectedUser && messagesQuery.isLoading && (
          <div className="empty">Loading messages...</div>
        )}
        {selectedUser && messagesQuery.isError && (
          <div className="empty">
            Failed to load messages:{" "}
            {messagesQuery.error?.message ?? "Unknown error"}
          </div>
        )}
        {selectedUser && messagesQuery.data && (
          <div className="list">
            {messagesQuery.data.map((m) => (
              <ChatBubble
                key={m.id}
                content={m.content}
                isMine={m.senderUserId === currentUserId}
                isRead={Boolean(m.viewedAt)}
                time={new Date(m.sentAt).toLocaleTimeString()}
              />
            ))}
          </div>
        )}
      </div>
      <ChatInput receiverUserId={receiverUserId} />
    </section>
  );
}

export default ChatPane;

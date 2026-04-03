import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../../../Models/User.model";
import type { Message } from "../../../../Models/Message.model";
import "./ChatPane.scss";
import ChatInput from "./ChatInput/ChatInput";
import messagesService from "../../../../Services/Messages.service";
import ChatBubble from "./ChatBubble/ChatBubble";
import { useAppSelector } from "../../../../store/hooks";
import { formatLocalDateTime, toUtcIso } from "../../../../utils/dateTime";

type ChatPaneProps = {
  selectedUser: User | null;
};

function ChatPane({ selectedUser }: ChatPaneProps): ReactElement {
  const receiverUserId = selectedUser ? selectedUser.id : null;
  const currentUserId = useAppSelector((state) => state.auth.user.sub);
  const queryClient = useQueryClient();
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const messagesQuery = useQuery({
    queryKey: ["messages", receiverUserId],
    queryFn: () => {
      if (!receiverUserId) return Promise.resolve([] as Message[]);
      return messagesService.getConversation(receiverUserId);
    },
    enabled: receiverUserId != null,
  });

  useEffect(() => {
    if (!receiverUserId || !currentUserId || !messagesQuery.data) return;

    const unread = messagesQuery.data.filter(
      (m) => m.receiverUserId === currentUserId && !m.viewedAt,
    );

    if (unread.length === 0) return;

    const viewedAt = toUtcIso();

    queryClient.setQueryData<Message[]>(["messages", receiverUserId], (old) => {
      if (!old) return old;

      return old.map((m) =>
        unread.some((u) => u.id === m.id)
          ? { ...m, viewedAt: m.viewedAt ?? viewedAt }
          : m,
      );
    });

    Promise.all(
      unread.map((m) =>
        messagesService.markAsRead(m.id).catch((error) => {
          console.error("Failed to mark message as read:", error);
        }),
      ),
    );
  }, [receiverUserId, currentUserId, messagesQuery.data, queryClient]);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [receiverUserId, messagesQuery.data?.length]);

  return (
    <section className="ChatPane">
      <div className="header">{selectedUser ? selectedUser.name : "Chat"}</div>
      <div className="body" ref={bodyRef}>
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
        {selectedUser &&
          messagesQuery.data &&
          messagesQuery.data.length === 0 && (
            <div className="empty">
              There are no messages currently with that user.
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
                time={formatLocalDateTime(m.sentAt, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              />
            ))}
          </div>
        )}
      </div>
      {receiverUserId && <ChatInput receiverUserId={receiverUserId} />}
    </section>
  );
}

export default ChatPane;

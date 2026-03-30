import type { ReactElement } from "react";
import type { User } from "../../../../Models/User.model";
import "./ChatPane.scss";

type ChatPaneProps = {
  selectedUser: User | null;
};

function ChatPane({ selectedUser }: ChatPaneProps): ReactElement {
  return (
    <section className="ChatPane">
      <div className="header">
        {selectedUser ? selectedUser.name : "Chat"}
      </div>
      <div className="body">
        {!selectedUser && (
          <div className="empty">Select a user to view messages.</div>
        )}
      </div>
    </section>
  );
}

export default ChatPane;

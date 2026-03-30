import type { ReactElement } from "react";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import "./ChatBubble.scss";

type ChatBubbleProps = {
  content: string;
  isMine?: boolean;
  time?: string;
  isRead?: boolean;
};

function ChatBubble({
  content,
  isMine = false,
  time,
  isRead = false,
}: ChatBubbleProps): ReactElement {
  return (
    <div className={`ChatBubble ${isMine ? "mine" : ""}`}>
      <div className="text">{content}</div>
      {(time || isMine) && (
        <div className="meta">
          {time && <span className="time">{time}</span>}
          {isMine && (
            <span className={`status ${isRead ? "read" : "unread"}`}>
              {isRead ? (
                <DoneAllIcon fontSize="small" />
              ) : (
                <DoneIcon fontSize="small" />
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatBubble;

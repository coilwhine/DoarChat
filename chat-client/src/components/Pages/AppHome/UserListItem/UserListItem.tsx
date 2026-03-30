import type { ReactElement } from "react";
import "./UserListItem.scss";
import type { User } from "../../../../Models/User.model";

interface UserListItemProps {
  user: User;
  compact?: boolean;
}

function UserListItem({
  user,
  compact = false,
}: UserListItemProps): ReactElement {
  const initial = user.name?.trim()?.[0]?.toUpperCase() ?? "?";

  return (
    <div className={`UserListItem ${compact ? "compact" : ""}`}>
      <div className="initial" aria-hidden="true">
        {initial}
      </div>
      {!compact && <div className="name">{user.name}</div>}
    </div>
  );
}

export default UserListItem;

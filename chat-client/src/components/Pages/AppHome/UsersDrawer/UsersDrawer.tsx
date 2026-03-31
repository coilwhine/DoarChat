import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { useState } from "react";
import type { User } from "../../../../Models/User.model";
import usersService from "../../../../Services/Users.service";
import { useAppSelector } from "../../../../store/hooks";
import UserListItem from "../UserListItem/UserListItem";

type UsersDrawerProps = {
  selectedUserId: number | null;
  onSelectUser: (user: User) => void;
};

function UsersDrawer({
  selectedUserId,
  onSelectUser,
}: UsersDrawerProps): ReactElement {
  const [open, setOpen] = useState(false);

  const drawerWidthOpen = 320;
  const drawerWidthClosed = 72;
  const currentUserId = useAppSelector((state) => state.auth.user.sub);

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.getAll(),
  });

  return (
    <div className="UsersDrawer">
      <Drawer
        anchor="left"
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
          overflow: "visible",
          height: "100%",
          "& .MuiDrawer-paper": {
            width: open ? drawerWidthOpen : drawerWidthClosed,
            overflow: "visible",
            transition: "width 200ms ease",
            position: "relative",
            height: "100%",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            right: open ? -18 : -18,
            transform: "translateY(-50%)",
            zIndex: 2,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setOpen((v) => !v)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": { backgroundColor: "#f2f2f2" },
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
        <Box
          sx={{
            px: open ? 2 : 0,
            pb: 2,
            pt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              px: open ? 0 : 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.25rem",
                whiteSpace: "nowrap",
                textAlign: "center",
                width: "100%",
              }}
            >
              Users
            </Typography>
          </Box>
          <Divider />
          {open && usersQuery.isLoading && (
            <Typography>Loading users...</Typography>
          )}
          {open && usersQuery.isError && (
            <Typography color="error">
              Failed to load users:{" "}
              {usersQuery.error?.message ?? "Unknown error"}
            </Typography>
          )}
          <List
            dense
            sx={{
              flex: 1,
              overflowY: "auto",
            }}
          >
            {usersQuery.data
              ?.filter((u) => u.id !== currentUserId)
              .map((u) => (
                <ListItemButton
                  key={u.id}
                  className="item"
                  disableRipple
                  selected={selectedUserId === u.id}
                  onClick={() => onSelectUser(u)}
                  sx={{
                    justifyContent: open ? "flex-start" : "center",
                    px: open ? 2 : 1,
                  }}
                >
                  <UserListItem user={u} compact={!open} />
                </ListItemButton>
              ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
}

export default UsersDrawer;

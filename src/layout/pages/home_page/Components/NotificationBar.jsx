import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import * as React from 'react';
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import { MailIcon } from "lucide-react";

const NotificationBar = () => {
  return (
    <Stack spacing={2} direction="row" alignItems="center" sx={{ mr: 1 }}>
      <Tooltip
        title="Notifications"
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 10] // [horizontal, vertical] offset
              }
            }
          ]
        }}
      >
        <Badge badgeContent={4} color="primary">
          <Box sx={{ color: "text.primary" }}>
            <MailIcon fontSize="small" />
          </Box>
        </Badge>
      </Tooltip>
    </Stack>
  );
};

export default NotificationBar

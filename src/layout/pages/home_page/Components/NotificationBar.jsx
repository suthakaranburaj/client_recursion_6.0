import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import MailIcon from "@mui/icons-material/Mail"; // Updated import for MailIcon
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

const NotificationBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

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
        <Badge badgeContent={3} color="primary">
          <IconButton
            aria-describedby={id}
            color="inherit"
            onClick={open ? handleClose : handleClick}
          >
            <MailIcon fontSize="small" />
          </IconButton>
        </Badge>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <Typography variant="body1">You have 3 new messages.</Typography>
          <Typography variant="body1">Your account has been updated.</Typography>
          <Typography variant="body1">New feature available!</Typography>
        </Box>
      </Popover>
    </Stack>
  );
};

export default NotificationBar;
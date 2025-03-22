import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import MailIcon from "@mui/icons-material/Mail";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import {
  get_current_notification_service,
  update_notification_service,
} from "../../../../services/notificationServices/notificationServices";

const NotificationBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Fetch notifications on component mount
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await get_current_notification_service();
        if (response.data && response.data.status) {
          setNotifications(response.data.data);
        } else {
          setError("Failed to fetch notifications");
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Error fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Handle opening/closing the popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    setAnchorEl(null);

    // Mark all notifications as read
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    // Update the state to reflect read notifications
    setNotifications(updatedNotifications);

    // Send a POST request to update notifications when the popover is closed
    try {
      await update_notification_service({ notifications: updatedNotifications });
      console.log("Notifications updated successfully");
    } catch (err) {
      console.error("Error updating notifications:", err);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <Stack spacing={2} direction="row" alignItems="center" sx={{ mr: 1 }}>
      <Tooltip
        title="Notifications"
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 10], // [horizontal, vertical] offset
              },
            },
          ],
        }}
      >
        <Badge badgeContent={unreadCount} color="primary">
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

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          ) : notifications.length === 0 ? (
            <Typography variant="body1">No new notifications.</Typography>
          ) : (
            notifications.map((notification, index) => (
              <Box
                key={index}
                sx={{
                  p: 1,
                  mb: 1,
                  borderRadius: "4px",
                  backgroundColor: notification.read ? "background.paper" : "action.hover",
                  border: "1px solid",
                  borderColor: "divider",
                  position: "relative",
                }}
              >
                {!notification.read && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "primary.main",
                      color: "common.white",
                      borderRadius: "4px",
                      px: 1,
                      fontSize: "0.75rem",
                    }}
                  >
                    New
                  </Box>
                )}
                <Typography variant="body1">{notification.message}</Typography>
              </Box>
            ))
          )}
        </Box>
      </Popover>
    </Stack>
  );
};

export default NotificationBar;
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
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import {
  get_current_notification_service,
  update_notification_service
} from "../../../../services/notificationServices/notificationServices";

const NotificationBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    setAnchorEl(null);
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      is_read: true
    }));
    setNotifications(updatedNotifications);
    try {
      await update_notification_service({ notifications: updatedNotifications });
    } catch (err) {
      console.error("Error updating notifications:", err);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;
  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 1 }}>
      <Tooltip title="Notifications">
        <IconButton aria-describedby={id} color="primary" onClick={handleClick}>
          <Badge badgeContent={unreadCount} color="error">
            <MailIcon fontSize="medium" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Paper sx={{ p: 2, width: 350, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Notifications
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : notifications.length === 0 ? (
            <Typography color="textSecondary">No new notifications.</Typography>
          ) : (
            notifications.map((notification, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: notification.is_read ? "background.default" : "action.hover"
                }}
              >
                <Typography variant="body1" fontWeight={notification.is_read ? "normal" : "bold"}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(notification.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            ))
          )}
        </Paper>
      </Popover>
    </Stack>
  );
};

export default NotificationBar;

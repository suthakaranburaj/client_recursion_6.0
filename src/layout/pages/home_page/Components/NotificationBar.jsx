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

    // Send a POST request to update notifications when the popover is closed
    try {
      await update_notification_service({ notifications });
      console.log("Notifications updated successfully");
    } catch (err) {
      console.error("Error updating notifications:", err);
    }
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
                offset: [0, 10], // [horizontal, vertical] offset
              },
            },
          ],
        }}
      >
        <Badge badgeContent={notifications.length} color="primary">
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
              <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                {notification.message}
              </Typography>
            ))
          )}
        </Box>
      </Popover>
    </Stack>
  );
};

export default NotificationBar;
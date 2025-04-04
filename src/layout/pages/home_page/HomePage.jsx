import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Person4Icon from '@mui/icons-material/Person4';
import Divider from "@mui/material/Divider";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from '@mui/icons-material/History';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CloudCircleIcon from "@mui/icons-material/CloudCircle";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout, ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import {
  Box,

  Avatar,
  Paper,
  Container,
  Grid,
  Button,
 

  CircularProgress,
  Snackbar,
  
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import BoltIcon from '@mui/icons-material/Bolt';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { asyncHandler, getCookie } from "../../../helper/commonHelper.js";
import {
  login_service,
  logout_service,
  get_current_user_service
} from "../../../services/authServices/authServices.js";
import { get_current_statement_service } from "../../../services/statementServices/statementServices.js";

import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton
} from "@toolpad/core/Account";
import * as Pages from "../../index.js";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationBar from "./Components/NotificationBar.jsx";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items"
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    path: "/"
  },
  {
    segment: "profile",
    title: "Profile",
    icon: <Person4Icon />,
    path: "/profile"
  },
  {
    kind: "divider"
  },
  {
    kind: "header",
    title: "Analytics"
  },
  {
    segment: "budget-forecast",
    title: "Budget forecast",
    icon: <CurrencyRupeeIcon />,
    path: "/budget-forecast"
  },
  {
    segment: "chatbot",
    title: "Chatbot",
    icon: <SmartToyIcon />,
    path: "/chatbot"
  },
  // {
  //       segment: "insurances",
  //       title: "Insurances",
  //       icon: <DescriptionIcon />,
  //       path: ""
  // }
  
  {
    segment: "history",
    title: "Transaction History",
    icon: <HistoryIcon />,
    path: "/history"
  },
  {
    segment: "pdf",
    title: "Statements",
    icon: <ReceiptLongIcon />,
    path: "/pdf"
  },
  {
    segment: "add-goal",
    title: "Add Goals",
    icon: <EmojiEventsIcon />,
    path: "/add-goal"
  },
  {
    segment: "advance-chatbot",
    title: "Advanced Chatbot",
    icon: <PrecisionManufacturingIcon />,
    path: "/advance-chatbot"
  }
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme"
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536
    }
  }
});

function AccountSidebarPreview(props) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? "condensed" : "expanded"}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}

AccountSidebarPreview.propTypes = {
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  open: PropTypes.bool
};

function SidebarFooterAccountPopover() {
  return (
    <Stack direction="column">
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}

const createPreviewComponent = (mini) => {
  function PreviewComponent(props) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  }
  return PreviewComponent;
};

function SidebarFooterAccount({ mini }) {
  const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);
  return (
    <Account
      slots={{
        preview: PreviewComponent,
        popoverContent: SidebarFooterAccountPopover
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: "left", vertical: "bottom" },
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: (theme) =>
                  `drop-shadow(0px 2px 8px ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.32)"})`,
                mt: 1,
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                  zIndex: 0
                }
              }
            }
          }
        }
      }}
    />
  );
}

SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired
};

const demoSession = {
  user: {
    name: "Bharat Kashyap",
    email: "bharatkashyap@outlook.com",
    image: "https://avatars.githubusercontent.com/u/19550456",
    subscription: false // Added subscription status
  }
};

function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <CloudCircleIcon fontSize="large" color="primary" />
      <Typography variant="h6">Your Finance Tracker</Typography>
    </Stack>
  );
}

function ToolbarActionsSearch() {
  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div className="w-40">
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              display: { xs: "inline", md: "none" }
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        fullWidth
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="medium">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 }
          }
        }}
        sx={{
          display: { xs: "none", md: "inline-block" },
          mr: 1,
          width: "25vw"
        }}
      />
      <NotificationBar />
      <ThemeSwitcher />
    </Stack>
  );
}

const CustomMenuItem = React.forwardRef(({ selected, ...props }, ref) => (
  <MenuItem
    ref={ref}
    {...props}
    selected={selected}
    sx={{
      "&.Mui-selected": {
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"
      },
      "&.Mui-selected:hover": {
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"
      }
    }}
  />
));

function DashboardLayoutAccountSidebar(props) {
  const { window } = props;

  const location = useLocation();
  const [pathname, setPathname] = React.useState("/dashboard");
  const navigate = useNavigate();

  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState(null);

  const router = React.useMemo(() => {
    return {
      pathname: location.pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => navigate(String(path))
    };
  }, [navigate, location]);

  const demoWindow = window !== undefined ? window() : undefined;

  const [session, setSession] = React.useState(null);
  const [authView, setAuthView] = React.useState(null);

  React.useEffect(() => {
    const checkUser = async () => {
      await handle_get_user();
    };
    checkUser();
  }, [authView]);

  const handle_get_user = async () => {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");
    if (!accessToken || !refreshToken) {
      setSession(null);
      return;
    }

    try {
      const response = await get_current_user_service();
      const statementresponse = await get_current_statement_service();
      if (response.data.data) {
        setSession({
          user: response.data.data
        });
        localStorage.setItem("user", JSON.stringify(response.data.data));
        localStorage.setItem("statement", JSON.stringify(statementresponse.data.data));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setSession(null);
    }
  };

  const handleBudgetForecastClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.subscription) {
      setSubscriptionDialogOpen(true); // Open subscription dialog if subscription is false
    } else {
      navigate("/budget-forecast"); // Navigate to budget forecast if subscription is true
    }
  };

  const handleProceedToPayment = () => {
    const updatedUser = { ...session.user, subscription: true };
    setSession({ user: updatedUser });
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSubscriptionDialogOpen(false);
  };

  return (
    <AppProvider
      navigation={NAVIGATION.map((item) => {
        if (item.segment === "budget-forecast") {
          const user = JSON.parse(localStorage.getItem("user"));
          return {
            ...item,
            title: (
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>{item.title}</span>
                {user?.subscription ? <LockOpenIcon fontSize="small" /> : <LockIcon fontSize="small" />}
              </Stack>
            ),
            onClick: handleBudgetForecastClick
          };
        }
        if (item.segment === "chatbot") {
          const user = JSON.parse(localStorage.getItem("user"));
          return {
            ...item,
            title: (
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>{item.title}</span>
                {user?.subscription && <BoltIcon fontSize="small" />}
              </Stack>
            )
          };
        }
        return item;
      })}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      authentication={{
        signIn: () => setAuthView("login"),
        signOut: async () => {
          await logout_service();
          localStorage.removeItem('statements');
          setSession(null);
          setTimeout(() => {
            globalThis.location.reload();
          }, 100);
        }
      }}
      session={session?.user ? session : null}
      components={{
        MenuItem: CustomMenuItem
      }}
    >
      <DashboardLayout
        slots={{
          toolbarActions: ToolbarActionsSearch,
          appTitle: CustomAppTitle,
          sidebarFooter: SidebarFooterAccount
        }}
      >
        <Outlet />
      </DashboardLayout>

      {/* Subscription Dialog */}
      <Dialog open={subscriptionDialogOpen} onClose={() => setSubscriptionDialogOpen(false)}>
        <DialogTitle>
          Choose Your Plan
          <IconButton
            onClick={() => setSubscriptionDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Paper
                onClick={() => setSelectedPlan("free")}
                sx={{
                  p: 2,
                  cursor: "pointer",
                  border: selectedPlan === "free" ? "2px solid #1976d2" : "1px solid rgba(0,0,0,0.12)",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Free Plan
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="✓ Limited PDF statements allowed" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✗ No advanced chatbot" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper
                onClick={() => setSelectedPlan("premium")}
                sx={{
                  p: 2,
                  cursor: "pointer",
                  border: selectedPlan === "premium" ? "2px solid #1976d2" : "1px solid rgba(0,0,0,0.12)",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Finance Tracker Premium
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="✓ Advanced chatbot" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✓ Unlimited PDF statements" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✓ Alert budget system" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✓ Budget forecast" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={() => setSubscriptionDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              disabled={selectedPlan !== "premium"}
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {authView === "login" && (
        <Pages.Login
          onSwitchToRegister={() => setAuthView("register")}
          onClose={() => {
            setAuthView(null);
            handle_get_user();
          }}
        />
      )}
      {authView === "register" && (
        <Pages.Register
          onSwitchToLogin={() => setAuthView("login")}
          onClose={() => {
            setAuthView(null);
            handle_get_user();
          }}
        />
      )}
    </AppProvider>
  );
}

DashboardLayoutAccountSidebar.propTypes = {
  window: PropTypes.func
};

export default DashboardLayoutAccountSidebar;
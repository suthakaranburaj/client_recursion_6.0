// layout/NotFoundPage.jsx
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import * as Routes from '../../routes/index'

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <ReportProblemIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
        <Typography variant="h1" gutterBottom>
          404 Not Found
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The requested URL was not found on this server. Please check the address or navigate back
          to our homepage.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate(Routes.HOMEPAGE)}
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import * as Pages from "./layout/index.js";
import * as Routes from "./routes/index.js";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"; // Import Navigate
import NotFoundPage from "./layout/components/NotFoundPage";
import { AuthGuard } from "./layout/components/AuthGuard";

const router = createBrowserRouter([
  {
    path: Routes.HOMEPAGE,
    element: <Pages.HomePage />,
    children: [
      {
        path: "/",
        element: <Navigate to={Routes.DASHBOARD} replace />
      },
      {
        path: Routes.DASHBOARD,
        element: (
          <AuthGuard>
            <Pages.Dashboard />
          </AuthGuard>
        )
      },
      {
        path: Routes.PROFILE,
        element: (
            <AuthGuard><Pages.ProfilePage /></AuthGuard>  
        )
      },
      {
        path: Routes.BUDGETFORECAST,
        element:(<AuthGuard><Pages.BudgetForecast /> </AuthGuard>)
      },
      {
        path: Routes.CHATBOT,
        element:(<AuthGuard> <Pages.Chatbot /> </AuthGuard>)
      },
      {
        path: Routes.TRANSACTION_HISTORY,
        element:(<AuthGuard><Pages.TransactionHistory /> </AuthGuard>)
      },
      {
        path: Routes.UPLOADPDF,
        element:(<AuthGuard><Pages.PdfUpload /> </AuthGuard>)
      },
    ]
  },
  {
    path: Routes.LOGIN,
    element: (
        <Pages.Login />
    )
  },
  {
    path: Routes.REGISTER,
    element: <Pages.Register />
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);

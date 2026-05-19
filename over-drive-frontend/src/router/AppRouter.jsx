import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
]);

export default router;
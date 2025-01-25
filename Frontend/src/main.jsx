import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./component/home.jsx";
import Signin from "./component/signin.jsx";
import AppLayout from "./component/Layout.jsx/appLayout.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StoreProvider } from "./component/Context/storecontext.jsx";
import Signup from "./component/signup.jsx";
import Portfolio from "./component/portfolio.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/portfolio",
        element: <Portfolio />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </>
);

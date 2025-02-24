import { RouterProvider, } from "react-router-dom";
import './index.css'
import { StrictMode } from "react";
import router from "./Routes/Routes";
import { createRoot } from "react-dom/client";
import AuthProvider from "./Routes/Components/AuthProvider/AuthProvider";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);

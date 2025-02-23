import {RouterProvider,} from "react-router-dom";
import './index.css'
import  { StrictMode } from "react";
import router from "./Routes/Routes";
import { createRoot } from "react-dom/client";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

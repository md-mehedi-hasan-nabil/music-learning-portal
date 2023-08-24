import { RouterProvider } from "react-router-dom";
import router from "./routes/root";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import "./App.css";
import AuthProvider from "./context/AuthProveider";

export default function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" reverseOrder={false} />
      </HelmetProvider>
    </AuthProvider>
  );
}

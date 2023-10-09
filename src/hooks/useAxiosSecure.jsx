import { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProveider";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default function useAxiosSecure() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axiosSecure.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          logout();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
  }, [logout, navigate]);

  return { axiosSecure };
}

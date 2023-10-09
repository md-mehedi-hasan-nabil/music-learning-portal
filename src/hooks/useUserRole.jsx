import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProveider";
import axios from "axios";

export default function useUserRole() {
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState("student");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsSuccess(false);
    if (user?.email) {
      axios
        .get(import.meta.env.VITE_API_BASE_URL + "/api/user/" + user.email)
        .then(function (response) {
          setUserRole(response.data.role);
          setIsLoading(false);
          setIsSuccess(true);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
          setIsSuccess(false);
        });
    }
  }, [user]);

  return { userRole, isLoading, isSuccess };
}

import PropTypes from "prop-types";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "./Loader";
import { AuthContext } from "../context/AuthProveider";
import useUserRole from "../hooks/useUserRole";
import notFoundImage from "../assets/404.jpg";

export default function PrivateRoute({ children, role }) {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);
  const { userRole } = useUserRole();

  if (loading) {
    return <Loader />;
  }

  if (user && userRole !== role) {
    return (
      <div className="container text-center py-5">
        <h2 className="text-2xl">404 not found</h2>
        <img className="max-w-full" src={notFoundImage} alt="" />
      </div>
    );
  }

  return user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};

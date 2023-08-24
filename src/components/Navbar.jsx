import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProveider";
import useUserRole from "../hooks/useUserRole";
import Loader from "./Loader";
import { useQueryClient } from "@tanstack/react-query";

export default function Navbar() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);
  const { userRole, isLoading } = useUserRole();
  const [dashboardPath, setDashboardPath] = useState(null);
  const [theme, setTheme] = useState("light");

  const links = [
    {
      path: "/",
      name: "Home",
    },
    {
      path: "/courses",
      name: "Courses",
    },
    {
      path: "/instructors",
      name: "Instructors",
    },
  ];

  useEffect(() => {
    if (userRole === "admin") {
      setDashboardPath("/dashboard/manage-classes");
    } else if (userRole === "instructor") {
      setDashboardPath("/dashboard/add-course");
    } else {
      setDashboardPath("/dashboard/selected-courses");
    }
  }, [userRole]);

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      document.querySelector("html").setAttribute("data-theme", localTheme);
      setTheme(localTheme);
    } else {
      document.querySelector("html").setAttribute("data-theme", "light");
      setTheme("light");
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  function changeTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
    document
      ?.querySelector("html")
      ?.setAttribute("data-theme", theme === "light" ? "dark" : "light");
  }

  function handleLogout() {
    logout();
    // queryClient.invalidateQueries({ queryKey: ["courses"] });
    navigate("/");
  }

  return (
    <nav className="sticky top-0 z-50 shadow-lg bg-base-100/90 backdrop-blur-2xl">
      <div className="container">
        <div className="navbar">
          <div className="navbar-start">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                {/* for mobile device */}
                {links.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.path}
                      className={({ isActive, isPending }) =>
                        isActive ? "active" : ""
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
                {isLoading ? (
                  ""
                ) : (
                  <li className="md:mx-2">
                    <NavLink to={dashboardPath}>Dashboard</NavLink>
                  </li>
                )}
                <li>
                  <label className="capitalize">
                    {theme}
                    <input
                      type="checkbox"
                      className="toggle"
                      onChange={changeTheme}
                      checked={theme === "dark"}
                    />
                  </label>
                </li>
              </ul>
            </div>
            <Link to="/" className="btn btn-ghost normal-case text-xl">
              LyricLounge
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              {links.map((link) => (
                <li className="md:mx-2" key={link.name}>
                  <NavLink
                    to={link.path}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : ""
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
              {isLoading ? (
                ""
              ) : (
                <li className="md:mx-2">
                  <NavLink to={dashboardPath}>Dashboard</NavLink>
                </li>
              )}
              <li>
                <label className="capitalize">
                  {theme}
                  <input
                    type="checkbox"
                    className="toggle"
                    onChange={changeTheme}
                    checked={theme === "dark"}
                  />
                </label>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            {user?.displayName ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={user.photoURL} />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a className="justify-between border py-2">
                      {user.displayName}
                    </a>
                  </li>
                  <li>
                    {isLoading ? (
                      ""
                    ) : (
                      <Link to={dashboardPath} className="justify-between">
                        Dashbarrd
                        <span className="badge">New</span>
                      </Link>
                    )}
                  </li>
                  <li>
                    <a>Profile</a>
                  </li>
                  <li>
                    <a onClick={handleLogout}>Logout</a>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

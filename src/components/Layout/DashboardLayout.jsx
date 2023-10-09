import { Link, NavLink, ScrollRestoration } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthProveider";
import useUserRole from "../../hooks/useUserRole";
import Loader from "../Loader";
import { Fade, Hinge, JackInTheBox, Slide } from "react-awesome-reveal";

export default function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const { userRole, isLoading } = useUserRole();

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      document.querySelector("html")?.setAttribute("data-theme", localTheme);
    } else {
      document.querySelector("html")?.setAttribute("data-theme", "light");
    }
  }, []);

  return (
    <>
      <nav className="lg:sticky top-0 z-50 shadow-md bg-base-100/90 backdrop-blur-2xl">
        <div className="container">
          <div className="navbar">
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost normal-case text-xl">
                LyricLounge
              </Link>
            </div>
            <div className="flex-none gap-2">
              <div>
                <label
                  htmlFor="my-drawer-2"
                  className="btn drawer-button lg:hidden"
                >
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
              </div>

              {user?.email && (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img src={user.photoURL} />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <a className="justify-between">{user.displayName}</a>
                    </li>
                    <li>
                      <a onClick={logout}>Logout</a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <aside className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content w-full">
          {/* Page content here */}
          {children}
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            {isLoading ? (
              <Loader />
            ) : (
              userRole === "admin" && (
                <>
                  <Fade>
                    <li>
                      <NavLink to="/dashboard/manage-classes">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-cassette"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 6a1 1 0 0 0 0 2h2a1 1 0 1 0 0-2H7Z" />
                          <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13ZM1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-.691l-1.362-2.724A.5.5 0 0 0 12 10H4a.5.5 0 0 0-.447.276L2.19 13H1.5a.5.5 0 0 1-.5-.5v-9ZM11.691 11l1 2H3.309l1-2h7.382Z" />
                        </svg>
                        Manage Classes
                      </NavLink>
                    </li>
                  </Fade>
                  <Fade>
                    <li>
                      <NavLink to="/dashboard/manage-users">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-people"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                        </svg>
                        Manage Users
                      </NavLink>
                    </li>
                  </Fade>
                </>
              )
            )}
            {isLoading ? (
              <Loader />
            ) : (
              userRole === "student" && (
                <>
                  <JackInTheBox>
                    <li>
                      <NavLink to="/dashboard/selected-courses">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-journal-check"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                          />
                          <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                          <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                        </svg>
                        Selected Course
                      </NavLink>
                    </li>
                  </JackInTheBox>
                  <JackInTheBox>
                    <li>
                      <NavLink to="/dashboard/enrolled-courses">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-journal-arrow-down"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"
                          />
                          <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                          <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                        </svg>
                        Enrolled Course
                      </NavLink>
                    </li>
                  </JackInTheBox>
                  <JackInTheBox>
                    <li>
                      <NavLink to="/dashboard/payment-history">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-credit-card-2-front"
                          viewBox="0 0 16 16"
                        >
                          <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z" />
                          <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                        </svg>
                        Payment History
                      </NavLink>
                    </li>
                  </JackInTheBox>
                </>
              )
            )}
            {isLoading ? (
              <Loader />
            ) : (
              userRole === "instructor" && (
                <>
                  <Fade>
                    <li>
                      <NavLink to="/dashboard/add-course">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-file-plus"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z" />
                          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
                        </svg>{" "}
                        Add Classes
                      </NavLink>
                    </li>
                  </Fade>
                  <Fade>
                    <li>
                      <NavLink to="/dashboard/my-courses">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-cassette"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 6a1 1 0 0 0 0 2h2a1 1 0 1 0 0-2H7Z" />
                          <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13ZM1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-.691l-1.362-2.724A.5.5 0 0 0 12 10H4a.5.5 0 0 0-.447.276L2.19 13H1.5a.5.5 0 0 1-.5-.5v-9ZM11.691 11l1 2H3.309l1-2h7.382Z" />
                        </svg>
                        My Classes
                      </NavLink>
                    </li>
                  </Fade>
                </>
              )
            )}
          </ul>
        </div>
      </aside>
      <ScrollRestoration />
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

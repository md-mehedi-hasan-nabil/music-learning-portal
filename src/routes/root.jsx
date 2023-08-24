import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import InstructorsPage from "../pages/student/Instructors";
import CoursesPage from "../pages/student/Courses";
import SelectedCourses from "../pages/student/SelectedCourses";
import EnrolledCourses from "../pages/student/EnrolledCourses";
import PaymentHistory from "../pages/student/PaymentHistory";
import AddCourse from "../pages/instructor/AddCourse";
import MyCourses from "../pages/instructor/MyCourses";
import PrivateRoute from "../components/PrivateRoute";
import Payment from "../pages/student/Payment";
import ManageClasses from "../pages/admin/ManageClasses";
import ManageUsers from "../pages/admin/ManageUsers";
import InstructorCourses from "../pages/instructor/InstructorCourses";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard/manage-classes",
    element: (
      <PrivateRoute role="admin">
        <ManageClasses />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/manage-users",
    element: (
      <PrivateRoute role="admin">
        <ManageUsers />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/selected-courses",
    element: (
      <PrivateRoute role="student">
        <SelectedCourses />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/payment/:selectedCourseId",
    element: (
      <PrivateRoute role="student">
        <Payment />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/enrolled-courses",
    element: (
      <PrivateRoute role="student">
        <EnrolledCourses />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/payment-history",
    element: (
      <PrivateRoute role="student">
        <PaymentHistory />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/add-course",
    element: (
      <PrivateRoute role="instructor">
        <AddCourse />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/my-courses",
    element: (
      <PrivateRoute role="instructor">
        <MyCourses />
      </PrivateRoute>
    ),
  },
  {
    path: "/instructors",
    element: <InstructorsPage />,
  },
  {
    path: "/classes/:instructorEmail",
    element: <InstructorCourses />,
  },
  {
    path: "/courses",
    element: <CoursesPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration-form",
    element: <Registration />,
  },
]);

export default router;

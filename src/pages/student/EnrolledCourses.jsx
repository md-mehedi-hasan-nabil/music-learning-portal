import { Helmet } from "react-helmet-async";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProveider";
// import EnrollCourseItem from "../../components/SelectedCourseItem";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import EnrolledCourseItem from "../../components/EnrolledCourseItem";

export default function EnrolledCourses() {
  const { user } = useContext(AuthContext);
  const { axiosSecure } = useAxiosSecure();
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const {
    data: courses,
    isSuccess: isSuccessFetchEnrolledCourses,
    isLoading: isLoadingFetchEnrolledCourses,
  } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: async () => {
      return await axiosSecure.get("/api/enrolled-course");
    },
  });

  useEffect(() => {
    if (isSuccessFetchEnrolledCourses) {
      if (courses.data?.length > 0) {
        const result = courses?.data?.filter(
          (course) => course?.user === user?.email
        );

        setEnrolledCourses(result);
      }
    }
  }, [isSuccessFetchEnrolledCourses, courses, user]);

  if (isLoadingFetchEnrolledCourses) {
    return <Loader />;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Enrolled Courses Page</title>
      </Helmet>
      <div className="p-2">
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Course Name</th>
                <th>Instructor</th>
                <th>Available seat</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.length > 0 ? (
                enrolledCourses
                  .filter((course) => course.user === user.email)
                  .map((course, index) => (
                    <EnrolledCourseItem
                      key={course._id}
                      index={index + 1}
                      course={course}
                    />
                  ))
              ) : (
                <h2>No enrolled course found</h2>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

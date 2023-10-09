import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { AuthContext } from "../../context/AuthProveider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import CourseItem from "./CourseItem";
import { Helmet } from "react-helmet-async";

export default function MyCourses() {
  const { user } = useContext(AuthContext);
  const { axiosSecure } = useAxiosSecure();

  const [courses, setCourses] = useState([]);

  const {
    data: allcourses,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      return await axiosSecure.get("/api/course");
    },
  });

  useEffect(() => {
    if (isSuccess && allcourses?.data?.length) {
      const filterCourses = allcourses?.data?.filter(
        (course) => course?.email === user?.email
      );
      setCourses(filterCourses);
    }
  }, [isSuccess, allcourses, user]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>My Classes</title>
      </Helmet>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Instructor</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row */}
            {courses?.length > 0 ? (
              courses.map((course, index) => (
                <CourseItem key={course._id} index={index} course={course} />
              ))
            ) : (
              <h2 className="p-2 text-xl">No course found.</h2>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

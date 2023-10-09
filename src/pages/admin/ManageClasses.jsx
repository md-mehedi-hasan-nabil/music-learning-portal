import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import CardLoader from "../../components/CardLoader";
import { toast } from "react-hot-toast";
import ClassesItem from "./ClassesItem";
import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";

export default function ManageClasses() {
  const { axiosSecure } = useAxiosSecure();
  const {
    isLoading: isLoadingFetchCourses,
    data: courses,
    isSuccess: isSuccessFetchCourses,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      return await axiosSecure.get(import.meta.env.VITE_API_BASE_URL + "/api/course");
    },
  });

  if (isLoadingFetchCourses) {
    return <CardLoader />;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Manage Classes</title>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row */}
            {courses?.data?.length > 0 && isSuccessFetchCourses ? (
              courses?.data?.map((course, index) => (
                <ClassesItem key={course._id} course={course} index={index} />
              ))
            ) : (
              <h2 className="p-2 text-xl">No classes found.</h2>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

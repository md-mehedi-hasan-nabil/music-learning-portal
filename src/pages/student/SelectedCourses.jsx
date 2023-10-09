import { Helmet } from "react-helmet-async";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProveider";
import { useQuery } from "@tanstack/react-query";
import CardLoader from "../../components/CardLoader";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import SelectedCourseItem from "../../components/SelectedCourseItem";

export default function SelectedCourses() {
  const { user } = useContext(AuthContext);
  const { axiosSecure } = useAxiosSecure();

  const {
    isLoading: isLoadingFetchSelectedCourses,
    data: selectedCourses,
    isSuccess: isSuccessFetchSelectedCourses,
    refetch,
  } = useQuery({
    queryKey: ["selectedCourses"],
    queryFn: async () => {
      return await axiosSecure.get("/api/selected-course");
    },
  });

  if (isLoadingFetchSelectedCourses) {
    return <CardLoader />;
  }

  let content;

  if (isSuccessFetchSelectedCourses && selectedCourses?.data?.length > 0) {
    const filterArray = selectedCourses.data.filter(
      (course) => course?.user === user?.email
    );

    if (filterArray?.length > 0) {
      content = filterArray?.map((course, index) => (
        <SelectedCourseItem
          key={course._id}
          index={index + 1}
          course={course}
          refetch={refetch}
        />
      ));
    } else {
      content = <h2 className="p-2">No selected course found</h2>;
    }
  } else {
    content = <h2 className="p-2">No selected course found</h2>;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Selected Courses Page</title>
      </Helmet>
      <div className="p-2">
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>Instructor</th>
                <th>Available seats</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthProveider";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useUserRole from "../hooks/useUserRole";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function CourseCard({ course, refetch }) {
  const { axiosSecure } = useAxiosSecure();
  const { user, loading } = useContext(AuthContext);
  const { userRole } = useUserRole();
  const { _id, title, name, seats, image, total_seats } = course || {};

  const [selectedCoursesId, setSelectedCoursesId] = useState([]);

  const {
    isSuccess: isSuccessFetchSelectedCourses,
    data: selectedCourses,
    refetch: refetchCourses,
  } = useQuery({
    queryKey: ["selectedCourses"],
    queryFn: async () => {
      return await axiosSecure.get("/api/selected-course");
    },
  });

  useEffect(() => {
    if (isSuccessFetchSelectedCourses && !loading) {
      const result = selectedCourses?.data
        ?.filter((course) => course.user === user?.email)
        ?.map((course) => course.course);
      setSelectedCoursesId(result);
    }
  }, [isSuccessFetchSelectedCourses, selectedCourses, user, loading]);

  const { mutate: selectedCourse } = useMutation({
    mutationFn: (courseId) => {
      return axiosSecure.post(
        import.meta.env.VITE_API_BASE_URL + "/api/selected-course",
        {
          user: user.email,
          course: courseId,
        }
      );
    },
    onSuccess: () => {
      refetch();
      refetchCourses();
      toast.success("Course select successfull.");
    },
  });

  function handleSelectedCourse(courseId) {
    if (selectedCoursesId?.length < 10) {
      selectedCourse(courseId);
    } else {
      toast.error("Maximum 9 classes allow.");
    }
  }

  return (
    <div className="col-span-12 md:col-span-4 card bg-base-100 overflow-hidden shadow-xl my-1">
      <figure>
        <img src={image} alt={title} />
      </figure>
      <div
        className={`${seats === 0 ? "bg-red-600 text-white" : ""} card-body`}
      >
        <h2 className="card-title cursor-pointer line-clamp-2">{title}</h2>
        <p className="font-medium">Available Seats: {seats}</p>
        <p className="font-medium">Enrolled: {total_seats - seats}</p>
        <p className="font-medium">Price: ${course.price}</p>
        <p>
          <span className="font-medium">Instructor:</span> {name}
        </p>
        <div className="card-actions justify-end">
          <button
            disabled={
              selectedCoursesId?.includes(_id) ||
              userRole === "instructor" ||
              userRole === "admin" ||
              user?.email === "admin@gmail.com"
            }
            className="btn btn-active btn-neutral btn-sm disabled:cursor-not-allowed"
            onClick={() => handleSelectedCourse(_id)}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

CourseCard.propTypes = {
  course: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

import { useQuery } from "@tanstack/react-query";
import CourseCard from "./CourseCard";
import CardLoader from "./CardLoader";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Courses() {
  const location = useLocation();
  const [courses, setCourses] = useState([]);

  const {
    isLoading,
    isError,
    data: allcourses,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      return await axios.get(import.meta.env.VITE_API_BASE_URL + "/api/course");
    },
  });

  useEffect(() => {
    if (isSuccess) {
      if (location.pathname === "/courses") {
        const result = allcourses?.data
          ?.filter((course) => course?.status === "approved")
          ?.sort((a, b) => b.total_seats - b.seats - (a.total_seats - a.seats));

        setCourses(result);
      } else {
        const result = allcourses?.data
          ?.filter((course) => course?.status === "approved")
          ?.sort((a, b) => b.total_seats - b.seats - (a.total_seats - a.seats))
          ?.slice(0, 6);

        setCourses(result);
      }
    }
  }, [isSuccess, allcourses, location]);

  if (isLoading) {
    return (
      <div className="flex">
        <CardLoader />
        <CardLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container">
        <h2 className="text-red-600 text-2xl text-center">{error}</h2>
      </div>
    );
  }
  console.log(location.pathname);
  isSuccess && console.log(courses);
  return (
    <div className="container py-4">
      <h2 className="text-center text-3xl font-semibold border-t border-b py-2 my-5">
        Popular Classes
      </h2>
      <div className="grid grid-cols-12 gap-6">
        {isSuccess && courses?.length > 0
          ? courses?.map((course) => (
              <CourseCard key={course._id} course={course} refetch={refetch} />
            ))
          : "No class found"}
      </div>
    </div>
  );
}

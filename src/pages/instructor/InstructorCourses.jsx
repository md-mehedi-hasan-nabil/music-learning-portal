import { useParams } from "react-router-dom";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CardLoader from "../../components/CardLoader";
import CourseCard from "../../components/CourseCard";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function InstructorCourses() {
  const { instructorEmail } = useParams();
  const { axiosSecure } = useAxiosSecure();
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
      return await axiosSecure.get("/api/course");
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const result = allcourses?.data
        .filter((course) => course.email === instructorEmail)
        ?.filter((course) => course?.status === "approved")
        ?.sort((a, b) => b.total_seats - b.seats - (a.total_seats - a.seats));

      setCourses(result);
    }
  }, [isSuccess, allcourses, instructorEmail]);

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

  return (
    <DefaultLayout>
      <div className="container py-4">
        <h2 className="text-center text-3xl font-semibold border-t border-b py-2 my-5">
          Instructor Classes
        </h2>
        <div className="grid grid-cols-12 gap-6">
          {isSuccess && courses?.length > 0
            ? courses?.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  refetch={refetch}
                />
              ))
            : "No class found"}
        </div>
      </div>
    </DefaultLayout>
  );
}

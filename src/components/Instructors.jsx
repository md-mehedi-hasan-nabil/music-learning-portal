import { useQuery } from "@tanstack/react-query";
import InstructorCard from "./InstructorCard";
import CardLoader from "./CardLoader";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useLocation } from "react-router-dom";

export default function Instructors() {
  const { axiosSecure } = useAxiosSecure();
  const location = useLocation();

  const {
    isLoading,
    data: instructors,
    isSuccess,
  } = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      return await axiosSecure.get("/api/user");
    },
  });

  if (isLoading) {
    return <CardLoader />;
  }

  let content;

  if (
    isSuccess &&
    instructors?.data?.length > 0 &&
    location.pathname === "/instructors"
  ) {
    content = instructors?.data
      ?.filter((instructor) => instructor.role === "instructor")
      ?.slice(0, 6)
      ?.map((instructor) => (
        <InstructorCard key={instructor._id} instructor={instructor} />
      ));
  } else if (
    isSuccess &&
    instructors?.data?.length > 0 &&
    location.pathname === "/"
  ) {
    content = instructors?.data
      ?.filter((instructor) => instructor.role === "instructor")
      ?.map((instructor) => (
        <InstructorCard key={instructor._id} instructor={instructor} />
      ));
  } else if (isSuccess && instructors?.data?.length === 0) {
    content = <h2>No Instructor found</h2>;
  } else {
    content = <h2>Something is wrong.</h2>;
  }

  return (
    <div className="container py-4">
      <h2 className="text-center text-3xl font-semibold border-t border-b py-2 my-5">
        Popular Instructors
      </h2>

      <div className="grid grid-cols-12 gap-4">{content}</div>
    </div>
  );
}

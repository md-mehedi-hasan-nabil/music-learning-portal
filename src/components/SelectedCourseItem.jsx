import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import CardLoader from "./CardLoader";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function SelectedCourseItem({ course, index, refetch }) {
  const { axiosSecure } = useAxiosSecure();
  const { course: courseId, _id: selectedCourseId } = course || {};
  const [openToast, setOpenToast] = useState(true);

  const { isLoading: isLoadingFetchSelectedCourse, data: selectedCourse } =
    useQuery({
      queryKey: ["course", courseId],
      queryFn: async () => {
        return await axiosSecure.get(
          import.meta.env.VITE_API_BASE_URL + `/api/course/${courseId}`
        );
      },
    });

  const { title, image, name, email, price, seats } = selectedCourse?.data || {};

  const { mutate: removeCourse } = useMutation({
    mutationFn: (course_id) => {
      return axiosSecure.patch(
        import.meta.env.VITE_API_BASE_URL +
          `/api/selected-course/${selectedCourseId}`,
        {
          courseId: course_id,
        }
      );
    },
    onSuccess: () => {
      toast.success("removed course");
      refetch();
    },
  });

  function openConfirm() {
    if (openToast) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img className="h-10 w-14 rounded" src={image} alt="" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Are you sure?
                </p>
                <p className="mt-1 text-sm text-gray-500">Remove this course</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-100">
            <button
              onClick={() => {
                removeCourse(courseId);
                toast.dismiss(t.id);
                setOpenToast(true);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Remove
            </button>
          </div>
        </div>
      ));
    }
    // setOpenToast(false);
  }

  if (isLoadingFetchSelectedCourse) {
    return <CardLoader />;
  }

  return (
    <>
      <tr>
        <th>{index}</th>
        <td>
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="mask rounded-md w-24 h-16">
                <img src={image} alt={title} />
              </div>
            </div>
            <div>
              <div className="font-bold">{title}</div>
              <div className="text-sm opacity-80 font-medium">
                Price: {price}
              </div>
            </div>
          </div>
        </td>
        <td>
          {name}
          <br />
          <span className="badge badge-ghost badge-sm">{email}</span>
        </td>
        <td>{seats}</td>
        <th>
          <Link
            to={`/dashboard/payment/${selectedCourseId}`}
            className="btn btn-success btn-xs mr-2"
          >
            Pay
          </Link>
          <button
            className="btn btn-error text-white btn-xs"
            onClick={openConfirm}
          >
            remove
          </button>
        </th>
      </tr>
    </>
  );
}

SelectedCourseItem.propTypes = {
  course: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  refetch: PropTypes.func.isRequired,
};

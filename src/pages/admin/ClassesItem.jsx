import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import FeedbackModal from "./FeedbackModal";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function ClassesItem({ course, index }) {
  const { axiosSecure } = useAxiosSecure();
  const queryClient = useQueryClient();
  const { _id, title, seats, status, total_seats, name, email } = course || {};
  const [courseStatus, setCourseStatus] = useState(status);
  const [openModal, setopenModal] = useState(false);
  const [feedbackCourseIdList, setFeedbackCourseIdList] = useState([]);

  const { data: feedbacks, isSuccess: isSuccessFetchFeedbacks } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      return await axios.get(
        import.meta.env.VITE_API_BASE_URL + "/api/feedback"
      );
    },
  });

  useEffect(() => {
    if (isSuccessFetchFeedbacks) {
      if (feedbacks?.data?.length > 0) {
        setFeedbackCourseIdList(feedbacks?.data.map((fb) => fb.courseId));
      }
    }
  }, [isSuccessFetchFeedbacks, feedbacks]);

  const { mutate: courseStatusChange } = useMutation({
    mutationFn: (courseId) => {
      return axiosSecure.patch(`/api/course-status/${courseId}`, {
        status: courseStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course status change successfull.");
    },
  });

  function handleStatusChange(value) {
    console.log(value);
    if (value) {
      setCourseStatus(value);
      courseStatusChange(_id);
    }
  }

  return (
    <>
      <FeedbackModal courseId={_id} open={openModal} close={setopenModal} />
      <tr key={course._id}>
        <th>{index + 1}</th>
        <td>
          <div className="avatar">
            <div className="rounded-md w-28 h-20">
              <img src={course.image} alt="image" />
            </div>
          </div>
        </td>
        <td>
          {title}
          <br />
          <span className="badge badge-ghost badge-sm">
            Seats: {course.seats}
          </span>
          <p className="text-xs font-semibold mt-1">
            Enrolled: {total_seats - seats}
          </p>
        </td>
        <td>
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-bold">{name}</div>
              <div className="text-sm opacity-50">{email}</div>
            </div>
          </div>
        </td>

        <td>
          <div className="flex gap-2">
            <>
              <button
                disabled={status === "pending" || status === "denied"}
                onClick={() => handleStatusChange("pending")}
                className="btn btn-xs"
              >
                Pending
              </button>
              <button
                disabled={status === "approved" || status === "denied"}
                onClick={() => handleStatusChange("approved")}
                className="btn btn-xs"
              >
                Approved
              </button>
            </>

            {!(status === "denied") ? (
              <button
                disabled={status === "denied"}
                onClick={() => handleStatusChange("denied")}
                className="btn btn-xs"
              >
                Denied
              </button>
            ) : (
              <button
                disabled={feedbackCourseIdList?.includes(_id)}
                onClick={() => setopenModal(true)}
                className="btn btn-xs"
              >
                Feedback
              </button>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}

ClassesItem.propTypes = {
  course: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

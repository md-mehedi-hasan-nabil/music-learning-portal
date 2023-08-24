import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function CourseItem({ course, index }) {
  const { axiosSecure } = useAxiosSecure();
  const { _id, image, title, seats, total_seats, name, email, status } =
    course || {};

  const { data: feedback, isSuccess: isSuccessFetchFeedback } = useQuery({
    queryKey: ["feedback"],
    queryFn: async () => {
      return await axiosSecure.get(`/api/feedback/${_id}`);
    },
  });

  return (
    <tr key={_id}>
      <th>{index + 1}</th>
      <td>
        <div className="avatar">
          <div className="rounded-md w-28 h-20">
            <img src={image} alt="image" />
          </div>
        </div>
      </td>
      <td>
        {title}
        <br />
        <span className="badge badge-ghost badge-sm">Seats: {seats}</span>
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
        <p className="capitalize font-medium">{status}</p>
        {isSuccessFetchFeedback &&
        status === "denied" &&
        feedback?.data?.message ? (
          <p className="text-red-600 font-medium">{feedback?.data?.message}</p>
        ) : (
          ""
        )}
      </td>

      <td>
        <button className="btn btn-xs">Edit</button>
      </td>
      <th>
        <button className="btn btn-error text-white btn-xs">delete</button>
      </th>
    </tr>
  );
}

CourseItem.propTypes = {
  course: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

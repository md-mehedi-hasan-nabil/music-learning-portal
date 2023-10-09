import moment from "moment";
import PropTypes from "prop-types";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

export default function PaymentHistoryItem({ payment, index }) {
  const { axiosSecure } = useAxiosSecure();
  const { email, transactionId, price, date, course_id } = payment || {};

  const { data: course, isSuccess } = useQuery({
    queryKey: ["course", course_id],
    queryFn: async () => {
      return await axiosSecure.get(`/api/course/${course_id}`);
    },
  });

  return (
    <tr>
      <th>{index + 1}</th>
      <td>{email}</td>
      <td>{transactionId}</td>
      <td>{isSuccess ? course?.data?.title : "Course is not available now."}</td>
      <td>$ {price}</td>
      <td>{moment(date).format("MMMM Do YYYY, h:mm:ss a")}</td>
    </tr>
  );
}

PaymentHistoryItem.propTypes = {
  payment: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

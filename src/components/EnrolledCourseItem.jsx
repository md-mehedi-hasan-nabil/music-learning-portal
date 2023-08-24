import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export default function EnrolledCourseItem({ course, index }) {
  const { course: courseId } = course || {};
  const [selectedCourse, setSelectedCourse] = useState({});

  const { title, image, name, email, price, seats } = selectedCourse || {};

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_BASE_URL + `/api/course/${courseId}`)
      .then(function (response) {
        setSelectedCourse(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [courseId]);

  return (
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
            <div className="text-sm opacity-50">Price: {price}</div>
          </div>
        </div>
      </td>
      <td>
        {name}
        <br />
        <span className="badge badge-ghost badge-sm">{email}</span>
      </td>
      <td>{seats}</td>
    </tr>
  );
}

EnrolledCourseItem.propTypes = {
  course: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

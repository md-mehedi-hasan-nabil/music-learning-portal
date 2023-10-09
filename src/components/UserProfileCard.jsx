import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function UserProfileCard({ userInfo }) {
  const { axiosSecure } = useAxiosSecure();
  const queryClient = useQueryClient();
  const { _id, email, photoURL, displayName, role } = userInfo || {};

  const { mutate: changeUserRole } = useMutation({
    mutationFn: ({ userId, userRole }) => {
      return axiosSecure.patch(`/api/user-role/${userId}`,
        {
          role: userRole,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Course status change successfull.");
    },
  });

  function handleChangeUserRole(value) {
    if (value) {
      changeUserRole({
        userId: _id,
        userRole: value,
      });
    }
  }

  return (
    <div className="col-span-12 md:col-span-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center py-10">
        <img
          className="w-24 h-24 object-cover mb-3 rounded-full shadow-lg"
          src={photoURL}
          alt={displayName}
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900">
          {displayName}
        </h5>
        <span className="text-sm text-gray-500">{email}</span>
        <span className="text-sm text-gray-500 font-medium capitalize">
          {role}
        </span>
        <div className="flex mt-4 space-x-3 md:mt-6">
          <button
            onClick={() => handleChangeUserRole("admin")}
            disabled={role === "admin"}
            className={`bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center px-4 py-2 text-sm font-medium text-center border rounded-md focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-400`}
          >
            Admin
          </button>
          <button
            onClick={() => handleChangeUserRole("instructor")}
            disabled={role === "instructor"}
            className={`bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center px-4 py-2 text-sm font-medium text-center border rounded-md focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-400`}
          >
            Instructor
          </button>
        </div>
      </div>
    </div>
  );
}

UserProfileCard.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

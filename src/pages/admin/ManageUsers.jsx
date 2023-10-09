import { useQuery } from "@tanstack/react-query";
import CardLoader from "../../components/CardLoader";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { toast } from "react-hot-toast";
import UserProfileCard from "../../components/UserProfileCard";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProveider";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function ManageUsers() {
  const { axiosSecure } = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const {
    isLoading: isLoadingFetchCourses,
    data: users,
    isSuccess: isSuccessFetchUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await axiosSecure.get(import.meta.env.VITE_API_BASE_URL + "/api/user");
    },
  });

  if (isLoadingFetchCourses) {
    return <CardLoader />;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Manage Users</title>
      </Helmet>
      <div className="grid grid-cols-12 gap-6 p-4">
        {users?.data?.length > 0 && isSuccessFetchUsers ? (
          users?.data
            ?.filter((u) => u.email !== user.email)
            ?.map((user) => <UserProfileCard key={user._id} userInfo={user} />)
        ) : (
          <h2>No user found</h2>
        )}
      </div>
    </DashboardLayout>
  );
}

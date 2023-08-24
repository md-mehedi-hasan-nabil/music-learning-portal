import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../context/AuthProveider";
import { useContext, useEffect, useState } from "react";
import Loader from "../../components/Loader";
import PaymentHistoryItem from "../../components/PaymentHistoryItem";

export default function PaymentHistory() {
  const { axiosSecure } = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [userPayments, setUserPayments] = useState([]);

  const {
    isLoading: isLoadingFetchPayments,
    data: payments,
    isSuccess: isSuccessFetchPayments,
  } = useQuery({
    queryKey: ["payment"],
    queryFn: async () => {
      return await axiosSecure.get(`/api/payment/`);
    },
  });

  useEffect(() => {
    if (isSuccessFetchPayments && payments?.data?.length > 0) {
      setUserPayments(
        payments?.data?.filter((payment) => payment.email === user.email)
      );
    }
  }, [isSuccessFetchPayments, payments, user]);

  if (isLoadingFetchPayments) {
    return <Loader />;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Payment History</title>
      </Helmet>
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Transaction Id</th>
                <th>Course Title</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {isSuccessFetchPayments && userPayments?.length > 0 ? (
                userPayments?.map((payment, index) => (
                  <PaymentHistoryItem
                    key={payment._id}
                    index={index}
                    payment={payment}
                  />
                ))
              ) : (
                <h2>No payment found</h2>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

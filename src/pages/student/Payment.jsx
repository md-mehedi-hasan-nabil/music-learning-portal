import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// import CheckoutForm from "./CheckoutForm";
import { Helmet } from "react-helmet-async";
import CardLoader from "../../components/CardLoader";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import CheckoutForm from "../../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_PK);

export default function Payment() {
  const { selectedCourseId } = useParams();
  const { axiosSecure } = useAxiosSecure();

  const {
    isLoading: isLoadingFetchSelectedCourse,
    data: selectedCourse,
    isSuccess: isSuccessFetchSelectedCourse,
  } = useQuery({
    queryKey: ["selectedCourse", selectedCourseId],
    queryFn: async () => {
      return await axiosSecure.get(`/api/selected-course/${selectedCourseId}`);
    },
  });

  const { course } = selectedCourse?.data || {};

  if (isLoadingFetchSelectedCourse) {
    return <CardLoader />;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Payment</title>
      </Helmet>
      {isSuccessFetchSelectedCourse ? (
        <div className="flex justify-center pt-40">
          <div className="checkout-form">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                price={Number(course?.price)}
                course_id={course._id}
                selectedCourseId={selectedCourseId}
              />
            </Elements>
          </div>
        </div>
      ) : (
        <h2 className="text-lg">Fetch error</h2>
      )}
    </DashboardLayout>
  );
}

import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../context/AuthProveider";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function CheckoutForm({ price, course_id, selectedCourseId }) {
  const navigate = useNavigate();
  const { axiosSecure } = useAxiosSecure();
  const { user, loading } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (price > 0) {
      axiosSecure
        .post("/api/create-payment-intent", { price })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [axiosSecure, price]);

  if (loading) {
    return <Loader />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
      console.log("[error]", error);
    } else {
      setCardError("");
      console.log(paymentMethod);
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "unknown",
            name: user?.displayName || "anonymous",
          },
        },
      });

    if (confirmError) {
      setCardError(
        confirmError?.message ? confirmError?.message : "Something is wrong."
      );
    }

    // console.log("payment intent", paymentIntent);

    if (paymentIntent?.status === "succeeded") {
      setTransactionId(paymentIntent.id);
      // save payment information to the server

    

      if (
        user?.email &&
        paymentIntent.id &&
        price &&
        course_id &&
        selectedCourseId
      ) {  
        const payment = {
        email: user?.email,
        transactionId,
        price,
        date: Date.now(),
        course_id,
        selectedCourseId,
      };
        setProcessing(true);
        axiosSecure
          .post("/api/payment", payment)
          .then((res) => {
            if (res.data.payment.insertedId) {
              setProcessing(false);
              toast.success("Payment successfull");
              navigate("/dashboard/enrolled-courses");
            }
          })
          .catch((error) => {
            setProcessing(false);
            console.log(error);
          });
      } else {
        toast.error("field required.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <p className="mt-2 text-sm text-red-600 font-medium">{cardError}</p>
      <button
        className="mt-3 disabled:cursor-not-allowed"
        type="submit"
        disabled={!stripe || !clientSecret}
      >
        {processing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}

CheckoutForm.propTypes = {
  price: PropTypes.number.isRequired,
  course_id: PropTypes.string.isRequired,
  selectedCourseId: PropTypes.string.isRequired,
};

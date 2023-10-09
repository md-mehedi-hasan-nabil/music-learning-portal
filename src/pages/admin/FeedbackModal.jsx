import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/AuthProveider";

export default function FeedbackModal({ open, close, courseId }) {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const { email } = user || {};

  const { mutate: giveFeedback } = useMutation({
    mutationFn: ({ message, email, courseId }) => {
      return axios.post(import.meta.env.VITE_API_BASE_URL + `/api/feedback`, {
        message,
        email,
        courseId,
      });
    },
    onSuccess: () => {
      close(false);
      setFeedbackMessage("");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Feedback successfull.");
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (feedbackMessage && email) {
      const obj = {
        message: feedbackMessage,
        email,
        courseId,
      };

      giveFeedback(obj);
    }
  }

  return (
    <dialog className="modal modal-bottom sm:modal-middle" open={open}>
      <div method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Give feedback!</h3>
        <form onSubmit={handleSubmit} className="py-4">
          <div>
            <label htmlFor="message" className="label-text mb-2 block">
              Write comment
            </label>
            <textarea
              id="message"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="Feedback"
              className="textarea textarea-bordered textarea-lg w-full"
            ></textarea>
          </div>
          <button type="submit" className="btn btn-neutral btn-sm mt-3">
            Feedback
          </button>
        </form>

        <div className="modal-action">
          <button
            className="btn btn-error text-white btn-xs"
            onClick={() => close(false)}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}

FeedbackModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired,
};

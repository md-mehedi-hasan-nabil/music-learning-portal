import { useForm } from "react-hook-form";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import axios from "axios";
import { AuthContext } from "../../context/AuthProveider";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function AddCourse() {
  const { user } = useContext(AuthContext);
  const { axiosSecure } = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    const { title, seats, price } = data;
    const { displayName, email } = user || {};

    const formData = new FormData();
    formData.append("image", data.image[0]);
    axios
      .post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGE_HOST_TOKEN
        }`,
        formData
      )
      .then(function (response) {
        if (response.data.success) {
          const image = response.data.data.display_url;
          const obj = {
            title,
            seats,
            image,
            name: displayName,
            email,
            price,
            status: "pending",
            total_seats: seats,
            date: Date.now(),
          };

          axiosSecure
            .post("/api/course", obj)
            .then(function () {
              toast.success("Course add success.");
              reset();
              setLoading(false);
            })
            .catch(function (error) {
              console.error(error);
              setLoading(false);
            });
        }
      })
      .catch(function (error) {
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Add Class</title>
      </Helmet>
      <div className="flex items-center justify-center h-full">
        <div className="card flex-shrink-0 shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <h2 className="text-2xl font-semibold text-center py-5">
              Add New Class
            </h2>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                placeholder="title"
                className="input input-bordered"
                {...register("title")}
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Seats</span>
                </label>
                <input
                  type="number"
                  placeholder="seats"
                  className="input input-bordered"
                  {...register("seats")}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="number"
                  placeholder="price"
                  className="input input-bordered"
                  {...register("price")}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Image</span>
              </label>
              <input
                type="file"
                placeholder="image"
                className="file-input file-input-bordered"
                {...register("image")}
                required
              />
            </div>

            <div className="form-control mt-6">
              <button disabled={loading} className="btn btn-neutral">
                {loading ? "submitting..." : "Add Class"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  GoogleAuthProvider,
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProveider";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { app } from "../firebase/firebaseConfig";

export default function Registration() {
  const navigate = useNavigate();
  const location = useLocation();

  const auth = getAuth(app);

  const { user, logout } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginError, setLoginError] = useState("");

  const redirectLocation = location?.state?.from?.pathname || "/";

  if (user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const onSubmit = (data) => {
    setLoginError("");
    const { displayName, email, password, photoURL } = data;

    if (password.length > 7) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const validUser = userCredential.user;

          // updated for ui
          validUser.displayName = displayName;
          validUser.photoURL = photoURL;

          // update user
          updateProfile(auth.currentUser, {
            displayName,
            photoURL,
          })
            .then(() => {
              axios
                .post(import.meta.env.VITE_API_BASE_URL + "/api/user", {
                  email,
                  displayName,
                  photoURL,
                  role: "student",
                })
                .then(function (response) {
                  if (response.data.acknowledged) {
                    toast.success("Registration successfully");
                    navigate(redirectLocation);
                  }
                })
                .catch((error) => {
                  logout();
                  console.log(error?.message);
                  toast.error(error?.message);
                  setLoginError(error?.message);
                });
            })
            .catch((err) => {
              console.log(err?.message);
              toast.error(err?.message);
              setLoginError(err?.message);
            });
        })
        .catch((err) => {
          console.log(err);
          console.log(err.message);
          setLoginError(err?.message);
        });
    } else {
      toast.error("Password is less than 6 characters.");
    }
  };


  return (
    <section className="flex justify-center items-center h-screen">
      <Helmet>
        <title>Registration Page</title>
      </Helmet>
      <div>
        <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100 pt-4">
          <h1 className="text-center text-2xl font-semibold mt-4">
            Create your Account
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                {...register("displayName")}
                className="input input-bordered"
              />
            </div>
            <div className="flex gap-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  {...register("email")}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  {...register("password")}
                  className="input input-bordered"
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">photoURL</span>
              </label>
              <input
                type="url"
                placeholder="Profile photo"
                {...register("photoURL")}
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-3">
              <button className="btn btn-primary">Sign Up</button>
            </div>
            <p className="textsm">{loginError ? loginError : ""}</p>
            <p className="text-sm">
              Already have an account?{" "}
              <Link className="hover:text-blue-600" to="/login">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

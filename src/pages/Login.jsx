import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import google from "../assets/google.png";
import { Helmet } from "react-helmet-async";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProveider";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { app } from "../firebase/firebaseConfig";


export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { googleLogin, user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const auth = getAuth(app);

  const [loginError, setLoginError] = useState("");
  const [inputType, setInputType] = useState("password");
  const [checkBoxValue, setCheckBoxValue] = useState(false);

  const redirectLocation = location?.state?.from?.pathname || "/";

  // google provider
  const googleProvider = new GoogleAuthProvider();

  if (user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // handle google sign in
  const handleGoogleLogin = () => {
    googleLogin(googleProvider)
      .then((result) => {
        const loggedUser = result.user;
        const { email, displayName, photoURL } = loggedUser;

        axios
          .post(import.meta.env.VITE_API_BASE_URL + "/api/user", {
            email,
            displayName,
            photoURL,
            role: "student",
          })
          .then(function (response) {
            if (response?.data?.accessToken) {
              localStorage.setItem("accessToken", response.data.accessToken);
              navigate(redirectLocation);
            }
          })
          .catch(function (error) {
            console.error(error);
          });
        // naviagte to the location
      })
      .catch((err) => console.log(err.message));
  };

  // sign in user
  const handleEmailAndPasswordLogin = (data) => {
    setLoginError("");

    const { email, password } = data;

    // login user
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
// console.log(res)
        toast.success("Login Successfull");

        // redirected to main location
        navigate(redirectLocation);
      })
      .catch((err) => {
        console.log(err)
        if (err?.message) {
          setLoginError("Please insert correct email and password!");
        }
      });
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <Helmet>
        <title>Login Page</title>
      </Helmet>
      <div>
        <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100 pt-4">
          <Link to="/" className="text-center text-xl font-semibold mt-4">LyricLounge</Link>
          <h1 className="text-center text-2xl font-semibold mt-4">
            Login to your Account
          </h1>
          <form
            onSubmit={handleSubmit(handleEmailAndPasswordLogin)}
            className="card-body"
          >
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
                type={inputType}
                placeholder="password"
                {...register("password")}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Show password</span>
                <input
                  type="checkbox"
                  checked={checkBoxValue}
                  onChange={() => {
                    setCheckBoxValue(!checkBoxValue);
                    setInputType(checkBoxValue ? "password" : "text");
                  }}
                  className="checkbox"
                />
              </label>
            </div>
            <div className="form-control mt-3">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
          <div className="px-8 pb-8">
            <button className="w-full btn flex" onClick={handleGoogleLogin}>
              <img className="w-8" src={google} alt="google" />
              <span>Login with Google</span>
            </button>
            <p className="text-sm text-red-600">
              {loginError ? loginError : ""}
            </p>
            <p className="text-sm mt-3">
              Don’t have an account?{" "}
              <Link className="hover:text-blue-600" to="/registration-form">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

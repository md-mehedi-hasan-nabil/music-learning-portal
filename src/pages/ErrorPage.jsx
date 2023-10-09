import { useRouteError } from "react-router-dom";
import notFoundImage from "../assets/404.jpg";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="container py-5 text-center">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <img className="max-w-full" src={notFoundImage} alt="404" />
    </div>
  );
}

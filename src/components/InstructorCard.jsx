import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function InstructorCard({ instructor }) {
  const { photoURL, displayName, email } = instructor || {};
  return (
    <div className="col-span-12 md:col-span-6 card card-side px-3 bg-base-100 shadow-xl">
      <figure>
        <img className="rounded-full" src={photoURL} alt={displayName} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{displayName}</h2>
        <p>{email}</p>
        <div className="card-actions justify-end">
          <Link
            to={`/classes/${email}`}
            className="btn btn-active btn-neutral btn-sm"
          >
            See Classes
          </Link>
        </div>
      </div>
    </div>
  );
}

InstructorCard.propTypes = {
  instructor: PropTypes.object.isRequired,
};

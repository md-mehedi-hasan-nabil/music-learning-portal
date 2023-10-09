import PropTypes from "prop-types";

export default function BlogCard({ blog }) {
  const { title, description, date, author, image } = blog || {};
  return (
    <div className="col-span-12 lg:col-span-4 card bg-base-100 my-3">
      <figure>
        <img src={image} alt={title} />
      </figure>
      <div className="card-body p-2">
        <h2 className="card-title line-clamp-2">{title}</h2>
        <p className="line-clamp-3">{description}</p>
        <div className="card-actions justify-between mt-2">
          <p>{author}</p>
          <p>{date}</p>
          <button className="btn btn-xs">read more</button>
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  blog: PropTypes.object.isRequired,
};

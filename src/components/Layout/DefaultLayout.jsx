import PropTypes from "prop-types";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { ScrollRestoration } from "react-router-dom";

export default function DefaultLayout({ children }) {
  return (
    <div>
      <Navbar />
        <main className="pb-5">{children}</main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

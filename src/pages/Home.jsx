import DefaultLayout from "../components/Layout/DefaultLayout";
import Hero from "../components/Hero";
import Courses from "../components/Courses";
import Instructors from "../components/Instructors";
import Blog from "../components/Blog";
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <DefaultLayout>
      <Helmet>
        <title>Home Page</title>
      </Helmet>
       <Hero />
      <Courses />
      <Instructors /> 
      <Blog />
    </DefaultLayout>
  );
}

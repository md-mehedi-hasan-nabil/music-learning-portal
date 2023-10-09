import { Helmet } from "react-helmet-async";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import Courses from "../../components/Courses";

export default function CoursesPage() {
  return (
    <DefaultLayout>
      <Helmet>
        <title>Course Page</title>
      </Helmet>
      <Courses />
    </DefaultLayout>
  );
}

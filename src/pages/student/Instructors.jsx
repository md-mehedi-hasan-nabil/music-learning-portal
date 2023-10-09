import { Helmet } from "react-helmet-async";
import Instructors from "../../components/Instructors";
import DefaultLayout from "../../components/Layout/DefaultLayout";

export default function InstructorsPage() {
  return (
    <DefaultLayout>
      <Helmet>
        <title>Instructors Page</title>
      </Helmet>
      <Instructors />
    </DefaultLayout>
  );
}

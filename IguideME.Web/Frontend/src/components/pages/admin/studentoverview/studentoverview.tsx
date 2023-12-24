import AdminTitle from "@/components/atoms/admin-titles/admin-titles";
import { type FC, type ReactElement } from "react";

const StudentOverview: FC = (): ReactElement => {
  return (
    <div>
      <AdminTitle
        title="Student Overview"
        description="An overview of students grades and consent."
      />
    </div>
  );
};

export default StudentOverview;

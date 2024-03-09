import AdminTitle from "@/components/atoms/admin-titles/admin-titles";
import SettingsTable from "@/components/crystals/consent-table/consent-table";
import GradesTable from "@/components/crystals/grades-table/grades-table";
import { Divider } from "antd";
import { type FC, type ReactElement } from "react";

const StudentOverview: FC = (): ReactElement => {
  return (
    <div>
      <AdminTitle
        title="Student Overview"
        description="An overview of students grades and consent."
      />
      <SettingsTable />
      <Divider />
      <GradesTable />
    </div>
  );
};

export default StudentOverview;

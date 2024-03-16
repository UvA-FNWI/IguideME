// /------------------------- Module imports -------------------------/
import NotificationPanel from "@/components/atoms/notification-panel/notification-panel";
import { Button, Col, ConfigProvider, Row, Select, Space } from "antd";
import { getSelf, getStudents } from "@/api/users";
import { useQuery } from "react-query";
import "./style.scss";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import {
  type Dispatch,
  type FC,
  type ReactElement,
  type SetStateAction,
  useState,
} from "react";

// /-------------------------- Own imports ---------------------------/
import { type User, UserRoles } from "@/types/user";

/**
 * Helper function for the student selector component.
 * @param isAdmin - Boolean describing the admin status of the user
 * @param currentUser - The current user selected in the selector
 * @param setCurrentUser - Setter function to update the current user in the state
 * @returns {React.ReactElement} The student selector
 */
const selector = (
  isAdmin: boolean,
  currentUser: User | undefined,
  setCurrentUser: Dispatch<SetStateAction<User | undefined>>,
  navigate: NavigateFunction,
): ReactElement => {
  const { data } = useQuery("students", getStudents, { enabled: isAdmin });

  const students = data
    ?.sort((a, b) => a.sortable_name.localeCompare(b.sortable_name))
    .filter((student) => student.userID !== currentUser?.userID);

  const changeStudent = (userID: string): void => {
    setCurrentUser(students?.find((student) => student.userID === userID));
    navigate(userID ?? "/");
  };

  // Don't show the selector to students.
  if (!isAdmin) {
    return <></>;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          controlOutlineWidth: 0,
          controlHeight: 38,
          colorText: "white",
          colorBorder: "white",
          colorTextSecondary: "white",
          colorTextQuaternary: "white",
          colorBgBase: "rgb(90, 50, 255)",
          motion: false,
        },
      }}
    >
      <Select
        placeholder={"Choose a student"}
        value={currentUser?.name}
        onChange={changeStudent}
        showSearch={true}
        optionFilterProp="label"
        options={students?.map((student) => ({
          label: student.name,
          value: student.userID,
        }))}
        allowClear={true}
        style={{ width: "40vw", maxWidth: "400px" }}
      />
    </ConfigProvider>
  );
};

/**
 * Header component.
 * @returns {React.ReactElement} The header
 */
const Header: FC = (): ReactElement => {
  // Set up the navigator, used to change the route.
  const navigate = useNavigate();

  // Get the current user from the backend and updates the route if the user is a student.
  const { data: self } = useQuery("self", getSelf, {
    onSuccess: (data) => {
      if (data === null) {
        // navigate(errorpage) TODO:
        return;
      }
      if (data.role === UserRoles.student) {
        navigate(data.userID ?? "/");
      }
    },
  });

  const [currentUser, setCurrentUser] = useState<User | undefined>(self);
  const [inHome, setInHome] = useState<boolean>(true);

  const isAdmin: boolean = self?.role === UserRoles.instructor;

  const goHome = (): void => {
    setCurrentUser(undefined);
    setInHome(true);
    navigate("/");
  };

  const toggleAdmin = (path: string): void => {
    setInHome(!inHome);
    navigate(path);
  };

  return (
    <div className="Header">
      <Row
        justify={"space-between"}
        align="middle"
        style={{
          padding: "0 20px",
        }}
      >
        <Col>
          <div className="homebutton">
            <Button type="link" onClick={goHome}>
              <h1>IguideME</h1>
            </Button>
          </div>
        </Col>
        <Col>
          {selector(isAdmin && inHome, currentUser, setCurrentUser, navigate)}
        </Col>
        <Col>
          <Space>
            <div style={{ minWidth: "30px" }}>
              <NotificationPanel user={currentUser} />
            </div>
            <div style={{ minWidth: "100px" }}>
              {isAdmin && (
                <Button
                  className="headerButton adminButton"
                  type="link"
                  onClick={() => {
                    inHome ? toggleAdmin("/admin") : goHome();
                  }}
                >
                  <h3>{inHome ? "Admin Panel" : "Home"}</h3>
                </Button>
              )}
            </div>
          </Space>
        </Col>
      </Row>
      {import.meta.env.MODE === "mock" && (
        <Row>
          <div
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: "#ff6e5a",
              textAlign: "center",
              fontFamily: "Maitree,serif",
            }}
          >
            Application is running in <strong>demo</strong> mode. Changes will
            not be saved!
          </div>
        </Row>
      )}{" "}
    </div>
  );
};

export default Header;

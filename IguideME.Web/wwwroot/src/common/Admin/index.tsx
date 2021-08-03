import React, { Component } from "react";
import { withAdminRole } from "../../hoc/withAdminRole";
import AdminHeader from "../../containers/AdminHeader";
import { Redirect } from "react-router-dom";
import { Col, Row } from "antd";
import AdminMenu from "./AdminMenu";
import "./style.scss";

class Admin extends Component<any> {

  render(): React.ReactNode {
    const { isAdmin, menuKey } = this.props;
    if (!isAdmin) return (<Redirect to={'/'} />);

    return (
      <div id={"admin"}>
        <AdminHeader />
        <Row>
          <Col xs={4}>
            <AdminMenu menuKey={menuKey} />
          </Col>
          <Col xs={20} id={'wrapper'} className={`${ menuKey !== "settings" && "noOverflow"}`}>
            { this.props.children }
          </Col>
        </Row>
      </div>
    )
  }
}

export default withAdminRole(Admin);
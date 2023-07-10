import React, { Component } from 'react';
import {Link} from "react-router-dom";
import "./style.scss";

export default class ExternalDataManager extends Component {
  render(): React.ReactNode {
    return (
      <div id={"externalDataManager"}>
        <h2>Tiles of type external data need no further configuration.</h2>
        <span>Data can be uploaded via the <Link to={'/admin/data-wizard'}>Data Wizard</Link>!</span>
        <div id={"illustration"} />
      </div>
    );
  }
}
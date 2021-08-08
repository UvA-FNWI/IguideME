import React, { Component } from "react";
import {Button, Checkbox, message} from "antd";
import ConsentController from "../../api/controllers/consent";
import {store} from "../../utils/configureStore";
import { Redirect } from "react-router-dom";

export default class Consent extends Component<{
  text?: string | null,
}> {

  state = {
    hasRead: false,
    redirect: false
  }

  handleAccept = () => {
    ConsentController.setConsent(true).then(() => {
      this.setState({ redirect: true });
    });
  }

  handleDecline = () => {
    ConsentController.setConsent(false).then(() => {
      message.success("Consent declined!");
    });
  }

  render(): React.ReactNode {
    const { text } = this.props;
    const { hasRead, redirect } = this.state;

    if (redirect) return <Redirect to={'/'} />

    let consentText = text;

    if (!text || text.length === 0) {
      const {course} = store.getState();
      consentText = course?.text;
    }

    if (consentText === null || consentText === undefined || consentText.length === 0) {
      return (
        <div>
          <h1>Application improperly configured.</h1>
          <p>Please notify your instructor that the informed consent is not configured. Once configured you will be able to accept to the terms to start using the application!</p>
        </div>
      );
    }

    return (
      <div style={{maxWidth: 700, margin: '0 auto', boxSizing: 'border-box', padding: 20 }}>
        <h1>Informed Consent</h1>
        <p>Please read the informed consent carefully. You will be asked to accept the informed consent, if declined your data will not be processed. You can change your preference at any time.</p>
        <div style={{ backgroundColor: '#eaeaea', padding: 20, borderRadius: 10 }}
             dangerouslySetInnerHTML={{__html: consentText}} />

        <div style={{marginTop: 20}}>
          <Checkbox
            checked={hasRead}
            onChange={e => this.setState({ hasRead: e.target.checked })}
          >
            I have read and understood the informed consent
          </Checkbox>

          <br />

          <Button type={"primary"} disabled={!hasRead} onClick={this.handleAccept}>
            Accept
          </Button>
          {' '}
          <Button disabled={!hasRead} danger onClick={() => {
            this.handleDecline();
            this.setState({ hasRead: false });
          }}>
            Decline
          </Button>
        </div>
      </div>
    )
  }
}
import React, { Component } from "react";
import {Button, Checkbox, Row, message} from "antd";
import ConsentController from "../../api/controllers/consent";
import {store} from "../../utils/configureStore";

export default class Consent extends Component<{
  text?: string | null,
  handle_accept: () => void
}> {

  state = {
    hasRead: false,
    accepted: -1,
  }

  handleAccept = () => {
    ConsentController.setConsent(true).then(() => {
      message.success("Consent Accepted!");
      this.props.handle_accept();
    });
  }

  handleDecline = () => {
    ConsentController.setConsent(false).then(() => {
      message.success("Consent declined!");
    });
  }

  componentDidMount(): void {
    ConsentController.fetchConsent().then(consent => this.setState({accepted: consent, hasRead: consent !== -1}))
  }

  render(): React.ReactNode {
    const { text } = this.props;
    const { hasRead, accepted } = this.state;

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

    let color1 = accepted === 1? "green" : "default";
    let color2 = accepted === 0? "red" : "default";


    return (
      <div style={{maxWidth: 700, margin: '0 auto', boxSizing: 'border-box', padding: 20 }}>
        <h1>Informed Consent</h1>
        <p>Please read the informed consent carefully. You will be asked to accept the informed consent, if declined your data will not be processed. You can change your preference at any time.</p>
        <div style={{ backgroundColor: '#eaeaea', padding: 20, borderRadius: 10 }}
             dangerouslySetInnerHTML={{__html: consentText}} />

        <Row justify={"center"} style={{margin: "15px", textAlign: 'center'}}>
          <Checkbox
            checked={hasRead}
            onChange={e => this.setState({ hasRead: e.target.checked })}
          >
            I have read and understood the informed consent
          </Checkbox>

        </Row>

        <Row justify={"center"}>

          <Button style={{ background: color1, borderColor: color1, marginRight: '5px'}} type={"primary"} disabled={!hasRead} onClick={this.handleAccept}>
            Accept
          </Button>

          <Button style={{ background: color2, borderColor: color2, marginLeft: '5px' }} disabled={!hasRead} danger onClick={() => {
            this.handleDecline();
            this.setState({ hasRead: false });
          }}>
            Decline
          </Button>
        </Row>
      </div>
    )
  }
}

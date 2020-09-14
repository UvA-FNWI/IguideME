import React, { Component } from "react";
import {Button, Checkbox, Col, Row} from "antd";
import {IState} from "./types";
import FadeIn from "react-fade-in";
import {RootState} from "../../store";
import {connect} from "react-redux";
import {setConsent} from "../../store/actions/consent";
import ConsentController from "../../api/consent";


class Consent extends Component<any, IState> {

  state = {
    acceptedTerms: false
  }

  render(): React.ReactNode {
    const { dispatch } = this.props;
    return (
      <div
        id={"consent"}
        style={{
          display: 'block',
          padding: '10px',
          width: '100vw',
        }}
      >
        <FadeIn>
          <div style={{textAlign: 'center'}}>
            <h1>IguideME</h1>
            <h2>INFORMED CONSENT</h2>
          </div>
        </FadeIn>
        <p>
          Dear participant,<br />
          We ask for your cooperation in an evaluation study into educational improvement. In this document, the so-called "informed consent", we explain this study and you can indicate whether you want to cooperate. Read the text below carefully. Then click on the informed consent link to sign the document (with yes or no, that choice is free).
        </p>

        <h3>Goal of the research</h3>
        <p>
          The goal of this educational research is to study the effects of the feedback tool “IguideME” and activating learning tools (e.g. Perusall) on the learning process.<br />
          The results of this research can be used to facilitate your learning process, to improve the design of this and other courses, and for scientific publications.
        </p>

        <h3>Research description</h3>
        <p>
          To investigate the effects of using IguideME, personal data (name and student ID) and learning activity data will be collected. Based on these data, you will receive personal feedback via the IguideME dashboard in Canvas. To investigate the effects of activating learning tools, the quality of assignments will be assessed and the results of a short questionnaire that scores motivation and learning behavior will be compared between the beginning and at the end of the course. For presentations purposes, all data will be anonymized.
        </p>

        <h3>Voluntariness</h3>
        <p>
          The participation in this research is voluntary. In the case that you decline to participate or stop your participation the data that you have generated will not be used in the research. You are free to stop your participation in this research without specifying a reason by informing dr. Erwin van Vliet.
        </p>

        <h3>Insurance</h3>
        <p>
          This research brings no risks for your health and safety and in this case the regular liability insurance of the University of Amsterdam is valid.
        </p>

        <h3>Additional Information</h3>
        <p>
          In case of any questions about this research please contact: dr. Erwin van Vliet (projectleader IGuideME), phone <a href={"tel:0205257630"}>020-525 7630</a>, e-mail <a href={"mailto:e.a.vanvliet@uva.nl"}>e.a.vanvliet@uva.nl</a>
        </p>

        <h2>CONSENT FORM</h2>
        <p>
          Here you will be asked to sign the Informed consent.<br />

          <ul>
            <li>
              By choosing <i>"Yes"</i> in this form, you declare that you have read the document entitled “informed consent IguideME”, understood it, and confirm that you agree with the procedure as described.<br />
            </li>
            <li>
              By choosing <i>"No"</i> in the form, you declare that you have read read the document entitled “informed consent IguideME”, understood it, and confirm that you do not want to participate in this study.
            </li>
          </ul>
        </p>

        <Checkbox
          value={this.state.acceptedTerms}
          onChange={() => this.setState((prevState: IState) => ({acceptedTerms: !prevState.acceptedTerms}))}
        >
          “I declare that I have read the information and understood it. I authorize the participation in this educational research and the use of my data in it. I keep my right to stop this authorization without giving an explicit reason to stop and to stop my participation in this experiment at any moment.”
        </Checkbox>

        <Row gutter={[6, 6]} style={{marginTop: 20}}>
          <Col md={12} xs={24}>
            <Button
              onClick={() => ConsentController.setConsent(true).then(() => dispatch(setConsent(true)))}
              disabled={!this.state.acceptedTerms}
              type="primary"
              block
            >
              Yes, I give consent
            </Button>
          </Col>
          <Col md={12} xs={24}>
            <a href={"#"}>
              <Button
                onClick={() => ConsentController.setConsent(false).then(() => dispatch(setConsent(false)))}
                block
              >
                No, I do not give consent
              </Button>
            </a>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect((state: RootState) => ({
  consent: state.consent
}))(Consent);
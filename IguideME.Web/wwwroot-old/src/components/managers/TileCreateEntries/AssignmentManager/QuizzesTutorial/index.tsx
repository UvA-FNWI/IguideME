import React, { Component } from "react";
import {Button, Col, Divider, Modal, Row} from "antd";

export default class QuizzesTutorial extends Component<{ open: boolean, setOpen: (val: boolean) => any }> {
  render(): React.ReactNode {
    return (
      <Modal
        title={"Response Canvas quizzes"}
        centered
        closable={true}
        visible={this.props.open}
        width={'90%'}
        onCancel={() => this.props.setOpen(false)}
        footer={
          <div>
            <Button onClick={() => this.props.setOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        <Row gutter={[10, 10]}>
          <Col xs={24} md={8}>
            <h2>Create a quiz</h2>
            <p>The responsive setup of the quizzes is reliant on a varying points-per-question. This functionality is only available in the "New Quizzes" Quiz Engine. Select the "New Quizzes" and hit "Submit".</p>
          </Col>

          <Col xs={24} md={16} style={{textAlign: 'center'}}>
            <img src={'/assets/img/tutorial/quiz-create.jpg'} style={{height: '100%', maxHeight: 400}} alt={''} />
          </Col>

          <Col xs={24}><Divider /></Col>

          <Col xs={24}>
            <h2>Quiz details</h2>
            <p>When you select the Quiz Engine the assignment details must be provided. Be sure to tick the box in front of <i>"Do not count this assignment towards the final grade"</i>. When all details are in-place hit the "Build" button.</p>
          </Col>

          <Col xs={24}><Divider /></Col>

          <Col xs={24} md={8}>
            <h2>Specifying the question type</h2>
            <p>To add a question to the quiz click the plus-button placed under the instructions field. You will be asked which type of question you want to add. Choose the "Multiple choice" question type.</p>
          </Col>

          <Col xs={24} md={16} style={{textAlign: 'center'}}>
            <img src={'/assets/img/tutorial/quiz-add-question.jpg'} style={{height: '100%', maxHeight: 300}} alt={''}/>
          </Col>

          <Col xs={24}><Divider /></Col>

          <Col xs={24} md={8}>
            <h2>Formulating the question</h2>
            <p>When you specify the question type you are able to formulate the question. In the right-side figure an example formulation is shown asking the student to specify the time spend on an assignment. Other use-cases may be to poll the reading times on class exercises. Be sure to tick the <i>"Varying points by answer"</i> checkbox. Create as many options as you wish and use the assigned points as a measurement of the student's answer. In the example students are rewarded points equivalent to the maximum time of the answer in minutes. Be consistent with the time unit used for the assigned points.</p>
          </Col>

          <Col xs={24} md={16} style={{textAlign: 'center'}}>
            <img src={'/assets/img/tutorial/quiz-question.jpg'} style={{height: '100%', maxHeight: 320}} alt={''}/>
          </Col>

          <Col xs={24}><Divider /></Col>

          <Col xs={24} md={8}>
            <h2>Quiz Settings</h2>
            <p>Lastly we wish to hide the obtained points from the students. To do this navigate to the "Settings" tab and enable the "Restrict result view". Uncheck the box where students are shown their rewarded points.</p>
          </Col>

          <Col xs={24} md={16} style={{textAlign: 'center'}}>
            <img src={'/assets/img/tutorial/quiz-settings.jpg'} style={{height: '100%', maxHeight: 320}} alt={''}/>
          </Col>

          <Col xs={24}><Divider /></Col>

          <Col xs={24}>
            <h2>We're done!</h2>
            <p>That's it, students should now be able to take the quiz and IguideME is able to extract the rewarded points per student.</p>
          </Col>
        </Row>
      </Modal>
    )
  }
}

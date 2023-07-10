import React, { Component } from "react";
import { IState } from "./types";
import { EditorState } from 'draft-js';
// @ts-ignore plugin does not support TypeScript
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
// @ts-ignore plugin does not support TypeScript
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import Editor from 'draft-js-plugins-editor';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from 'draft-js-buttons';
import 'draft-js/dist/Draft.css';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import "./style.scss";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import { standardConsent } from "./template";
import {Alert, Button, message} from "antd";
import Loading from "../../../utils/Loading";
import {RootState} from "../../../../store";
import {CourseActions} from "../../../../store/actions/course";
import {connect, ConnectedProps} from "react-redux";
import AppController from "../../../../api/controllers/app";

const toolbarPlugin = createToolbarPlugin();
const linkifyPlugin = createLinkifyPlugin();
const { Toolbar } = toolbarPlugin;

const mapState = (state: RootState) => ({
  course: state.course,
});

const mapDispatch = {
  loadCourse: () => CourseActions.loadCourse()
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>;

class ConsentEditor extends Component<PropsFromRedux, IState> {

  state = {
    doneLoading: false,
    editorState: undefined,
    initialState: undefined,
    hasChanged: false,
    saving: false
  }

  componentDidMount(): void {
    const { course }: PropsFromRedux = this.props;

    // const editorState = course ? (course.text ? course.text : undefined) : undefined;

    setTimeout(() => {
      this.setState({
        doneLoading: true,
        editorState: EditorState.createWithContent(stateFromHTML(course ? (course.text ? course.text : standardConsent) : standardConsent)),
        initialState: stateToHTML(stateFromHTML(course ? (course.text ? course.text : "") : "")),
        hasChanged: false
      });
    }, 300);
  }

  isUpToDate = () => {
    if (!this.state.editorState || !this.state.doneLoading) return false;
    const currentState: EditorState = this.state.editorState!;
    return (stateToHTML(currentState.getCurrentContent()).toString().trim() === this.state.initialState)
  }

  updateState = (newState: EditorState) => {
    this.setState({ editorState: newState, hasChanged: true });
  }

  save = () => {
    const { course } = this.props;
    this.setState({ saving: true }, () => {
      const currentState: EditorState = this.state.editorState!;
      const text = stateToHTML(currentState.getCurrentContent());

      AppController.updateConsent(course!.require_consent, text).then(() => {
        this.props.loadCourse().then(() => {
          this.setState({
            saving: false,
            initialState: text
          }, () => message.success("Informed consent saved!"));
        });
      });
    });
  }

  render(): React.ReactNode {
    if (!this.state.doneLoading) {
      return <Loading small={true} />
    }

    return (
      <div id={"consentEditor"}>
        <div id={"editorToolbar"}>
          <Toolbar>
            {
              (externalProps: any) => (
                <React.Fragment>
                  <BoldButton {...externalProps} />
                  <ItalicButton {...externalProps} />
                  <UnderlineButton {...externalProps} />
                  <CodeButton {...externalProps} />
                  <UnorderedListButton {...externalProps} />
                  <HeadlineOneButton {...externalProps} />
                  <HeadlineTwoButton {...externalProps} />
                  <HeadlineThreeButton {...externalProps} />
                  <OrderedListButton {...externalProps} />
                  <BlockquoteButton {...externalProps} />
                  <CodeBlockButton {...externalProps} />
                  <Button
                    id={"save"}
                    type={"link"}
                    disabled={this.isUpToDate() || this.state.saving}
                    onClick={this.save}
                  >
                    { this.state.saving ? "Saving" : "Save" }
                  </Button>
                </React.Fragment>
              )
            }
          </Toolbar>

          { !this.state.initialState &&
          <Alert
            message={"Consent can not be given because the informed consent is undefined. Provide the" +
            " informed consent below"}
            type={"error"} showIcon />
          }
        </div>

        <div id={"contentWrapper"}
             className={`${this.isUpToDate() && "up-to-date"} ${this.state.saving && "saving"}`}>
          <Editor
            editorState={this.state.editorState!}
            onChange={this.updateState}
            plugins={[toolbarPlugin, linkifyPlugin]}
          />
        </div>
      </div>
    )
  }
}

export default connector(ConsentEditor);
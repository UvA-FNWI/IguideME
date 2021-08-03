import {EditorState} from "draft-js";

export interface IState {
  doneLoading: boolean;
  initialState: string | undefined;
  editorState: EditorState | undefined;
  hasChanged: boolean;
  saving: boolean;
}
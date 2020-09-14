import {combineReducers} from "redux";
import { routerReducer } from 'react-router-redux';
import defaultReducer from "./default/reducers";

const rootReducer = combineReducers({
  // react
  routing: routerReducer,
  tiles: defaultReducer('TILES', []),
  view: defaultReducer('VIEW', null),
  consent: defaultReducer('CONSENT', null),
  adminView: defaultReducer('ADMIN_VIEW', false),
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;

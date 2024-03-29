import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Controller from "./api/controller";
import App from "./app";
import { Provider } from "react-redux";
import {persistor, store} from "./utils/configureStore";
import {PersistGate} from "redux-persist/integration/react";

import 'sweetalert2/src/sweetalert2.scss';
import 'ui-neumorphism/dist/index.css';
import "./scss/base.scss";

Controller.setup();

ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

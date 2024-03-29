import thunk from "redux-thunk";
import promise from "redux-promise";
import { createLogger } from "redux-logger";
import { compose, applyMiddleware, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "../store";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["COURSE", "USER", "TILES"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const logger = createLogger() commented out because it was not matching the overload in applymiddleware
export const store = createStore(
  persistedReducer,
  applyMiddleware(thunk, promise),
);

export const persistor = persistStore(store);

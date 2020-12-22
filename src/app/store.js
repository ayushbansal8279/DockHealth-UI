import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import reducers from './reducers/root-reducer';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers =
  (process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const saga = createSagaMiddleware();

const middlewares = [saga, thunk];

function setupStore() {
  return createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
}

const store = setupStore();

export default store;

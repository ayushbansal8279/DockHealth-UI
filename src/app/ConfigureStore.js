import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/root-reducer';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers =
  (process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

function setupStore() {
  return createStore(reducers, composeEnhancers(applyMiddleware(thunk)));
}

const store = setupStore();

export default function configureStore() {
  return store;
}

import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers/rootReducer';
import thunk from 'redux-thunk';

function setupStore() {
  return createStore(
    reducers,
    applyMiddleware(thunk)
  );
}

const store = setupStore();

export default function configureStore() {
    return store;
}

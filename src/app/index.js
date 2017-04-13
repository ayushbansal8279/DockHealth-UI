import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory, hashHistory } from 'react-router'
import configureStore from './configureStore'
import routes from './routes'
import * as PatientActions from './actions/patient-actions'

const store = configureStore();

//store.dispatch(PatientActions.getAllPatients())

const Routing = () => (
  <Provider store={store}>
    <Router history={hashHistory} routes={routes} />
  </Provider>
)

render(<Routing />, document.getElementById('app'))

/*
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
*/
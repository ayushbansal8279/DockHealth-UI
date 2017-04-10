import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Router, browserHistory, hashHistory } from 'react-router'
import store from './store'
import routes from './routes'

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
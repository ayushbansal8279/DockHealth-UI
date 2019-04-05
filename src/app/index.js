import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import configureStore from './configureStore';
import { Routes } from './routes';

const store = configureStore();

const Routing = () => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <Provider store={store}>
      <Router history={hashHistory}>
        {Routes(store)}
      </Router>
    </Provider>
  </MuiPickersUtilsProvider>
);

render(<Routing />, document.getElementById('app'));

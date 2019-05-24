import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import configureStore from './configureStore';
import { Routes } from './routes';

const store = configureStore();

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '"Open Sans"',
      '"Helvetica Neue"',
      'Helvetica',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const Routing = () => (
  <MuiThemeProvider theme={theme}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Provider store={store}>
        <Router history={hashHistory}>
          {Routes(store)}
        </Router>
      </Provider>
    </MuiPickersUtilsProvider>
  </MuiThemeProvider>
);

render(<Routing />, document.getElementById('app'));

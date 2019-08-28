import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import configureStore from './configureStore';
import { Routes } from './routes';
import theme from './theme';
import flags, { FlagsProvider } from './flags';

const store = configureStore();

const Routing = () => (
  <MuiThemeProvider theme={theme}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <FlagsProvider flags={flags}>
        <Provider store={store}>
            <Routes store={store} />
        </Provider>
      </FlagsProvider>
    </MuiPickersUtilsProvider>
  </MuiThemeProvider>
);

render(<Routing />, document.getElementById('app'));

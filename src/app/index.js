import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import configureStore from './configureStore';
import { Routes } from './routes';
import theme from './theme';
import flags, { FlagsProvider } from './flags';

// change 'a minute' to '1 minute', etc.
moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'seconds',
    m: '1 minute',
    mm: '%d minutes',
    h: '1 hour',
    hh: '%d hours',
    d: '1 day',
    dd: '%d days',
    M: '1 month',
    MM: '%d months',
    y: '1 year',
    yy: '%d years',
  },
});

const store = configureStore();

const App = () => (
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

render(<App />, document.getElementById('app'));

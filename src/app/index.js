import React from 'react';
import ReactGA from 'react-ga';
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
    m: '1 min',
    mm: '%d mins',
    h: '1 hr',
    hh: '%d hrs',
    d: '1 day',
    dd: '%d days',
    M: '1 mth',
    MM: '%d mths',
    y: '1 yr',
    yy: '%d yrs',
  },
});

const store = configureStore();

ReactGA.initialize('TRACKING_CODE_HERE', {
  debug: true,
});

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

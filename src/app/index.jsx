import MomentUtils from '@date-io/moment';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import moment from 'moment';
import React from 'react';
import { render } from 'react-dom';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import { StripeProvider } from 'react-stripe-elements';

import configureStore from './ConfigureStore';
import flags, { FlagsProvider } from './flags';
import { Routes } from './routes';
import theme from './theme';

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

const { SUBSCRIPTION_TOKEN_API_KEY } = process.env;
const { GA_TRACKING_CODE } = process.env;

ReactGA.initialize(GA_TRACKING_CODE, {
  debug: false,
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <FlagsProvider flags={flags}>
        <Provider store={store}>
          <StripeProvider apiKey={SUBSCRIPTION_TOKEN_API_KEY}>
            <Routes store={store} />
          </StripeProvider>
        </Provider>
      </FlagsProvider>
    </MuiPickersUtilsProvider>
  </MuiThemeProvider>
);

render(<App />, document.querySelector('#app'));

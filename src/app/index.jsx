/* eslint-disable @typescript-eslint/no-var-requires */
// import Symbol_observable from 'symbol-observable';
/* eslint-disable global-require */
// import MomentUtils from '@date-io/moment';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { LocalizationProvider as MuiPickersUtilsProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { HashRouter } from 'react-router-dom';
import moment from 'moment';
import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import { getTheme } from 'styles/theme';
import configureStore from './ConfigureStore';
import ErrorBoundary from './ErrorBoundary';
// import flags, { FlagsProvider } from './helpers/flags';
import Routes from './routing/routes';
import App from './views/App';

if (import.meta.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

// disable all react-beautiful-dnd development warnings
window['__react-beautiful-dnd-disable-dev-warnings'] = true;

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

const {
  VITE_GA_TRACKING_CODE,
  VITE_GA_TRACKING_CODE_ROLLUP,
  // VITE_SUBSCRIPTION_TOKEN_API_KEY,
} = import.meta.env;

ReactGA.initialize(
  [
    {
      trackingId: VITE_GA_TRACKING_CODE,
      gaOptions: {
        name: 'webapp',
      },
    },
    {
      trackingId: VITE_GA_TRACKING_CODE_ROLLUP,
      gaOptions: {
        name: 'rollup',
      },
    },
  ],
  {
    debug: false,
    alwaysSendToDefaultTracker: false,
  },
);

// const stripeProps = VITE_SUBSCRIPTION_TOKEN_API_KEY
//   ? { apiKey: VITE_SUBSCRIPTION_TOKEN_API_KEY }
//   : { apiKey: 'NON_EXISTENT_API_KEY' };

const Index = () => (
  <MuiThemeProvider theme={getTheme()}>
    <MuiPickersUtilsProvider dateAdapter={AdapterDateFns}>
      {/* <FlagsProvider flags={flags}> */}
      <Provider store={store}>
        <ErrorBoundary>
          <HashRouter forceRefresh>
            <App>
              <Routes />
            </App>
          </HashRouter>
        </ErrorBoundary>
      </Provider>
      {/* </FlagsProvider> */}
    </MuiPickersUtilsProvider>
  </MuiThemeProvider>
);

const container = document.querySelector('#app');
const root = createRoot(container);
root.render(<Index />);

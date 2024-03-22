/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { HashRouter } from 'react-router-dom';
import moment from 'moment';
import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { IntercomProvider } from 'react-use-intercom';
import { getTheme } from 'styles/theme';
import configureStore from './ConfigureStore';
import ErrorBoundary from './ErrorBoundary';
// import flags, { FlagsProvider } from './helpers/flags';
import Routes from './routing/routes';
import App from './views/App';
import './register/register-mui-license-premium';

if (import.meta.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

const { VITE_INTERCOM_APP_CODE } = import.meta.env;

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

const Index = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={getTheme()}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <FlagsProvider flags={flags}> */}
        <Provider store={store}>
          <ErrorBoundary>
            <HashRouter forceRefresh>
              <IntercomProvider appId={VITE_INTERCOM_APP_CODE} autoBoot>
                <App>
                  <Routes />
                </App>
              </IntercomProvider>
            </HashRouter>
            {import.meta.env.VITE_APP_ENV === 'local' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </ErrorBoundary>
        </Provider>
        {/* </FlagsProvider> */}
      </LocalizationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const container = document.querySelector('#app');
const root = createRoot(container);
root.render(<Index />);

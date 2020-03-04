import MomentUtils from '@date-io/moment';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Font } from '@react-pdf/renderer';
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
import OpenSansRegularFontSource from './fonts/OpenSans-Regular.ttf';
import OpenSansBoldFontSource from './fonts/OpenSans-Bold.ttf';
import ErrorBoundary from './ErrorBoundary';

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

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

const { GA_TRACKING_CODE, SUBSCRIPTION_TOKEN_API_KEY } = process.env;

ReactGA.initialize(GA_TRACKING_CODE, {
  debug: true,
});

const stripeProps = SUBSCRIPTION_TOKEN_API_KEY
  ? { apiKey: SUBSCRIPTION_TOKEN_API_KEY }
  : { apiKey: 'NON_EXISTENT_API_KEY' };

const App = () => {
  Font.register({
    family: 'Open Sans',
    fonts: [
      {
        src: OpenSansRegularFontSource,
        fontWeight: 'normal',
      },
      {
        src: OpenSansBoldFontSource,
        fontWeight: 'bold',
      },
    ],
  });

  return (
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <FlagsProvider flags={flags}>
          <Provider store={store}>
            <StripeProvider {...stripeProps}>
              <ErrorBoundary>
                <Routes store={store} />
              </ErrorBoundary>
            </StripeProvider>
          </Provider>
        </FlagsProvider>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

render(<App />, document.querySelector('#app'));

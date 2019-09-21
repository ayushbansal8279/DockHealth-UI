import { addParameters, addDecorator, configure } from '@storybook/react';
import { withPropsTable } from 'storybook-addon-react-docgen';
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import theme from '../src/app/theme';
import flags, { FlagsProvider } from '../src/app/flags';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

export const Providers = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <FlagsProvider flags={flags}>
          {children}
      </FlagsProvider>
    </MuiPickersUtilsProvider>
  </MuiThemeProvider>
);

addDecorator(storyFn => <Providers>{storyFn()}</Providers>);

addDecorator(withPropsTable);

addParameters({
  props: {
    propTablesExclude: [ Providers ],
  }
});

configure(loadStories, module);

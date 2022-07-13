import React, { createContext } from 'react';

const getStringSet = (lang = 'en') => {
  const stringSet = {
    en: {
      CONTEXT_MENU_DROPDOWN__RESEND: 'Resend',
      CONTEXT_MENU_DROPDOWN__DELETE: 'Delete',
    },
  };
  return stringSet[lang];
};

const LocalizationContext = createContext({
  stringSet: getStringSet('en'),
  dateLocale: null,
});

const LocalizationProvider = props => {
  const { children } = props;
  return (
    <LocalizationContext.Provider value={props}>
      {children}
    </LocalizationContext.Provider>
  );
};

export { LocalizationContext, LocalizationProvider };

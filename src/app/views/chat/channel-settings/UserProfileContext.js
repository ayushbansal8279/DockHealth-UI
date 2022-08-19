import React from 'react';

/**
 * user profile goes deep inside the component tree
 * use this context as a short circuit to send in values
 */
const UserProfileContext = React.createContext({
  disableUserProfile: true,
  isOpenChannel: false,
  renderUserProfile: null,
});

const UserProfileProvider = props => {
  const { children } = props;
  return (
    <UserProfileContext.Provider value={props}>
      {children}
    </UserProfileContext.Provider>
  );
};

export { UserProfileContext, UserProfileProvider };

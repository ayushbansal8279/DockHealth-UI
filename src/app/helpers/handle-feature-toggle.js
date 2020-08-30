import { any, identity } from 'ramda';
import { hashHistory } from 'react-router';

export default ({ location, user }) => {
  const { pathname } = location;
  const access = user?.access;

  const rawPathname = pathname.replace(/^\//, '');

  if (access) {
    const shouldRedirectToMainPage = any(identity)([
      !access.patientsEnabled && rawPathname.startsWith('patients'),
      !access.peopleEnabled && rawPathname.startsWith('people'),
      !access.searchEnabled && rawPathname.startsWith('taskSearch'),
      !access.listsEnabled && rawPathname.startsWith('lists'),
      !access.userProfileEnabled && rawPathname.startsWith('userProfile'),
    ]);

    if (shouldRedirectToMainPage) {
      hashHistory.replace('/');
    }
  }
};

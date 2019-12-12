import { hashHistory } from 'react-router';
import any from 'ramda/es/any';
import identity from 'ramda/es/identity';

export default ({ location, user }) => {
  const { pathname } = location;
  const { access } = user;

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

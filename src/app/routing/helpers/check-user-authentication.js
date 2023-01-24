/* eslint-disable consistent-return */
import {
  isAuthenticated,
  updateStoreWithCurrentUser,
  getEnterpriseAccessTokensByAuthCode,
} from 'api/user-auth-api';
import queryString from 'query-string';
import {
  setCurrentPageInSessionStorage,
  showAlert,
} from 'helpers/utility-functions';
import { CREATE_ACCOUNT_PATH, DEFAULT_REDIRECT_PATH } from './paths';

const checkUserAuthentication = async ({ history, isRequiredLogin }) => {
  try {
    const { location } = history;
    const { pathname } = location;
    let search = location?.search;
    if (search === '') {
      search = window.location.search;
    }

    const queryValues = queryString.parse(search);

    if (queryValues.code !== undefined) {
      const authCode = queryValues.code.replace('#/auth/login', '');
      const issValue = queryValues.iss.replace('#/', '');

      await getEnterpriseAccessTokensByAuthCode(authCode, issValue)
        .then(() => {
          const patientIdentifier = sessionStorage.getItem('PatientIdentifier');
          console.log(patientIdentifier);
          window.location.href =
            patientIdentifier &&
            patientIdentifier !== '' &&
            patientIdentifier !== 'null'
              ? `/#/core/patient/${patientIdentifier}`
              : `/#/core/home`;
        })
        .catch((error) => {
          showAlert({ status: 'error', title: 'Error', text: error.message });
        });
    }

    const { isLoggedIn, user } = await isAuthenticated();

    if (!isLoggedIn && pathname === CREATE_ACCOUNT_PATH) {
      return { redirectPath: null, user };
    }

    if ((!isLoggedIn || !user) && isRequiredLogin) {
      await setCurrentPageInSessionStorage(pathname);
      return { redirectPath: DEFAULT_REDIRECT_PATH, user };
    }

    if (isLoggedIn && isRequiredLogin) {
      await updateStoreWithCurrentUser(user);
      return { redirectPath: null, user };
    }

    return { redirectPath: null, user };
  } catch {
    history.push(DEFAULT_REDIRECT_PATH);
  }
};

export default checkUserAuthentication;

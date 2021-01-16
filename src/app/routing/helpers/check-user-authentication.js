/* eslint-disable consistent-return */
import {
  isAuthenticated,
  updateStoreWithCurrentUser,
  getEnterpriseAccessTokensByAuthCode,
} from 'api/user-api';
import queryString from 'query-string';
import { mobileAnalyticsClient } from 'api/analytics-api';
import {
  setCurrentPageInSessionStorage,
  showAlert,
} from 'helpers/utility-functions';
import { CREATE_ACCOUNT_PATH, DEFAULT_REDIRECT_PATH } from './paths';

const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let tem;
  let M =
    ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) ||
    [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return { name: 'IE', version: tem[1] || '' };
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/);
    if (tem != null) {
      return { name: 'Opera', version: tem[1] };
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

  tem = ua.match(/version\/(\d+)/i);
  if (tem != null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1],
  };
};

const checkUserAuthentication = async ({ history, isRequiredLogin }) => {
  try {
    const { location } = history;
    const { pathname, search } = location;

    const queryValues = queryString.parse(search);

    if (queryValues.code !== undefined) {
      const authCode = queryValues.code.replace('#/auth/login', '');
      const issValue = queryValues.iss.replace('#/', '');

      await getEnterpriseAccessTokensByAuthCode(authCode, issValue)
        .then(() => {
          return { redirectPath: '/core/tasks', user: null };
        })
        .catch(error => {
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
      const browser = getBrowserInfo();
      mobileAnalyticsClient.recordEvent('BROWSER_INFO', {
        Name: browser.name,
        Version: browser.version,
      });

      await updateStoreWithCurrentUser(user);
      return { redirectPath: null, user };
    }

    return { redirectPath: null, user };
  } catch (error) {
    history.push(DEFAULT_REDIRECT_PATH);
  }
};

export default checkUserAuthentication;

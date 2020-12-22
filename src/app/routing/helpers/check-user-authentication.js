/* eslint-disable consistent-return */
import { isAuthenticated, updateStoreWithCurrentUser } from 'api/user-api';
import { mobileAnalyticsClient } from 'api/analytics-api';
import { setCurrentPageInSessionStorage } from 'helpers/utility-functions';
import { CREATE_ACCOUNT_PATH, DEFAULT_REDIRECT_PATH } from './paths';
import checkUserAccountState from './check-user-account-state';

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

const checkUserAuthentication = async ({
  dispatch,
  history,
  isRequiredLogin,
  isRequiredSubscription,
  checkTrialExpiration,
}) => {
  try {
    const { isLoggedIn, user } = await isAuthenticated();
    const { location } = history;
    const { pathname } = location;

    if (!isLoggedIn && pathname === CREATE_ACCOUNT_PATH) {
      return null;
    }

    if ((!isLoggedIn || !user) && isRequiredLogin) {
      await setCurrentPageInSessionStorage(pathname);
      return DEFAULT_REDIRECT_PATH;
    }

    if (isLoggedIn && isRequiredLogin) {
      const browser = getBrowserInfo();
      mobileAnalyticsClient.recordEvent('BROWSER_INFO', {
        Name: browser.name,
        Version: browser.version,
      });

      await updateStoreWithCurrentUser(user);
      return await checkUserAccountState({
        history,
        user,
        checkTrialExpiration,
        isRequiredSubscription,
        dispatch,
      });
    }

    return null;
  } catch (error) {
    history.push(DEFAULT_REDIRECT_PATH);
  }
};

export default checkUserAuthentication;

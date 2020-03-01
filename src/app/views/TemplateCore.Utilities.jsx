import { hashHistory } from 'react-router';
import * as userApi from '../api/user-api';
import * as organizationApi from '../api/organization-api';
import handleFeatureToggle from '../helpers/handle-feature-toggle';
import { mobileAnalyticsClient } from '../api/analytics-api';

const CREATE_ACCOUNT_PATH = '/onboarding/create-account';
const EULA_PATH = '/onboarding/eula';
const BAA_OVERVIEW_PATH = '/onboarding/baa-overview';
const BAA_CHECK_PATH = '/onboarding/baa-check';
// const TEAM_ORG_SETUP_PATH = '/onboarding/team-org-setup';
// const USER_PROFILE_PATH = '/userProfile';
const HOME_PATH = '/tasks';

export const getBrowserInfo = () => {
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

const checkUserAccountState = async ({ user, pathname }) => {
  const data = await userApi.getUserByEmail(user.username, user);
  let orgData = null;
  if (data && data.organizationIdentifier) {
    orgData = await organizationApi.checkBAASignedStatus();
  }
  // console.log(orgData);
  if (!data.organizationIdentifier || data.organizationIdentifier === '') {
    hashHistory.push('/unEnrolledUser');
  } else if (!data.eulaAcknowledged) {
    if (pathname !== EULA_PATH) {
      hashHistory.replace(EULA_PATH);
    }
  } else if (orgData && !orgData.baaSigned) {
    if (!(pathname === BAA_CHECK_PATH || pathname === BAA_OVERVIEW_PATH)) {
      hashHistory.replace(BAA_CHECK_PATH);
    }

    // } else if (!data.titleList || data.titleList === "") {
    //   if(pathname !== USER_PROFILE_PATH ){
    //     hashHistory.replace(USER_PROFILE_PATH);
    //   }
    //   return
  } else {
    if (data.profileThumbnailPictureHash) {
      userApi.getUserProfilePic(data.userIdentifier, 'PROFILE');
    }
    handleFeatureToggle({
      location: hashHistory.getCurrentLocation(),
      user: data,
    });

    if (data.eulaAcknowledged && pathname === EULA_PATH) {
      hashHistory.replace(HOME_PATH);
    } else if (
      orgData &&
      orgData.baaSigned &&
      (pathname === BAA_OVERVIEW_PATH || pathname === BAA_CHECK_PATH)
    ) {
      hashHistory.replace(HOME_PATH);
    }
  }
};

const isLoggedIn = (loggedIn, user) => {
  const { pathname } = hashHistory.getCurrentLocation();

  if (!loggedIn && pathname === CREATE_ACCOUNT_PATH) {
    return;
  }

  if (!loggedIn || !user) {
    hashHistory.push('login');
    return;
  }

  const browser = getBrowserInfo();
  mobileAnalyticsClient.recordEvent('BROWSER_INFO', {
    Name: browser.name,
    Version: browser.version,
  });

  userApi.updateStoreWithCurrentUser(user);

  try {
    checkUserAccountState({ user, pathname });
  } catch (error) {
    // console.log(error);
    hashHistory.push('login');
  }
};

export const checkUserAuthentication = async () => {
  await userApi.isAuthenticated({
    isLoggedIn,
  });
};

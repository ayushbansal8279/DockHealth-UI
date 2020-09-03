import { hashHistory } from 'react-router';
import {
  checkBAASignedStatus,
  getConfigurationForReferral,
} from 'actions/organization-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import * as userApi from 'api/user-api';
import handleFeatureToggle from 'helpers/handle-feature-toggle';
import { setCurrentPageAfterLogin, useMobile } from 'helpers/utility-functions';

const CREATE_ACCOUNT_PATH = '/onboarding/create-account';
const EULA_PATH = '/onboarding/eula';
const BAA_OVERVIEW_PATH = '/onboarding/baa-overview';
const BAA_CHECK_PATH = '/onboarding/baa-check';
const BAA_INVITATION_SENT_PATH = '/onboarding/baa-invitation-sent';
const TRIAL_EXPIRATION_PATH = '/onboarding/trial-check';
const TEAM_ORG_SETUP_PATH = '/onboarding/organization-setup';
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

const handleMobileRedirection = ({ data, orgData }) => {
  if (data?.eulaAcknowledged && orgData?.baaSigned) {
    hashHistory.replace(TEAM_ORG_SETUP_PATH);
  }
};

const handleHomeRedirection = async ({
  data,
  orgData,
  isEulaPath,
  isBaaPath,
}) => {
  if (data?.profileThumbnailPictureHash) {
    userApi.getUserProfilePic(data?.userIdentifier, 'PROFILE');
  }
  userApi.getUserNotoficationPrefs();

  handleFeatureToggle({
    location: hashHistory.getCurrentLocation(),
    user: data,
  });

  if (
    (data?.eulaAcknowledged && isEulaPath) ||
    (orgData?.baaSigned && isBaaPath)
  ) {
    hashHistory.replace(HOME_PATH);
  }
};

const checkUserAccountState = async ({
  dispatch,
  user,
  pathname,
  checkTrialExpiration,
}) => {
  const data = await userApi.getUserByEmail(user.username, user);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isMobile = useMobile();

  const isBaaPath =
    pathname === BAA_CHECK_PATH ||
    pathname === BAA_OVERVIEW_PATH ||
    pathname === BAA_INVITATION_SENT_PATH;

  let orgData = null;

  if (data?.organizationIdentifier !== '') {
    orgData = await checkBAASignedStatus()(dispatch);
    getConfigurationForReferral({ referralCode: orgData?.referralCode })(
      dispatch,
    );
  }

  // uncomment the paragraph below if you have problems with signing BAA

  // handleHomeRedirection({
  //   data,
  //   orgData,
  //   isEulaPath: pathname === EULA_PATH,
  //   isBaaPath,
  //   isMobile,
  //   dispatch,
  // });
  // return;

  if (data?.organizationIdentifier === '') {
    hashHistory.push('/unEnrolledUser');
  } else if (data && !data.eulaAcknowledged) {
    if (pathname !== EULA_PATH) {
      hashHistory.replace(EULA_PATH);
    }
  } else if (
    data?.organizationIdentifier !== '' &&
    !orgData?.baaSigned &&
    !isBaaPath
  ) {
    hashHistory.replace(BAA_OVERVIEW_PATH);
  } else if (
    checkTrialExpiration &&
    orgData?.subscriptionDetails?.trialEnded &&
    pathname !== TRIAL_EXPIRATION_PATH
  ) {
    hashHistory.replace(TRIAL_EXPIRATION_PATH);
  } else if (isMobile) {
    handleMobileRedirection({
      data,
      orgData,
    });
  } else {
    handleHomeRedirection({
      data,
      orgData,
      isEulaPath: pathname === EULA_PATH,
      isBaaPath,
      isMobile,
      dispatch,
    });
  }
};

const isLoggedIn = ({ dispatch, checkTrialExpiration }) => (loggedIn, user) => {
  const { pathname } = hashHistory.getCurrentLocation();

  if (!loggedIn && pathname === CREATE_ACCOUNT_PATH) {
    return;
  }

  if (!loggedIn || !user) {
    setCurrentPageAfterLogin();
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
    checkUserAccountState({ user, pathname, dispatch, checkTrialExpiration });
  } catch (error) {
    hashHistory.push('login');
  }
};

export const checkUserAuthentication = async ({
  dispatch,
  checkTrialExpiration,
}) => {
  await userApi.isAuthenticated({
    isLoggedIn: isLoggedIn({ dispatch, checkTrialExpiration }),
  });
};

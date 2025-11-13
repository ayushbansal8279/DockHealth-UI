/* eslint-disable unicorn/filename-case */
import {
  getConfigurationForReferral,
  getOrganizationCustomFields,
} from 'actions/organization-actions';
import { getCurrentUserNotificationPreferences } from 'actions/user-actions';
import { getUserByEmail } from 'api/user-auth-api';
import { captureLocalTimezone } from 'api/user-api';
import { useMobile as checkIsMobile } from 'helpers/utility-functions';
// import { openModal } from 'modal/actions';
import {
  EULA_PATH,
  UNENROLLED_USER,
  HOME_PATH,
  DEFAULT_REDIRECT_PATH,
  SUBS_SETTINGS_PATH,
  SUBS_EXPIRED_PATH,
} from './paths';
// import handleMobileRedirection from './handle-mobile-redirection';
import handleHomeRedirection from './handle-home-redirection';
import checkBAASignedStatus from './check-BAA-signed-status';

const checkUserAccountState = async ({
  user,
  history,
  dispatch,
  isRequiredSubscription,
}) => {
  try {
    const { location } = history;
    const { pathname } = location;

    const data = await getUserByEmail(user.email || user.username, user);

    const isOrganizationAdmin = ['ADMIN', 'OWNER'].includes(data.orgUserRole);
    try {
      captureLocalTimezone();
    } catch {
      // do nothing
    }

    const isMobile = checkIsMobile();

    let orgData = null;

    if (data?.organizationIdentifier !== '') {
      orgData = await checkBAASignedStatus({
        dispatch,
        organizationIdentifier: data?.organizationIdentifier,
      });

      getConfigurationForReferral({ referralCode: orgData?.referralCode });
    }

    // // uncomment the paragraph below if you have problems with signing BAA
    // return await handleHomeRedirection({
    //   data,
    //   orgData,
    //   isEulaPath: pathname === EULA_PATH,
    //   isBaaPath,
    //   isMobile,
    //   history,
    // });

    if (data?.organizationIdentifier === '') {
      return UNENROLLED_USER;
    }

    if (
      data &&
      !data.eulaAcknowledged &&
      pathname !== EULA_PATH &&
      !orgData?.whiteLabelEnabled
    ) {
      return EULA_PATH;
    }

    const subscriptionPath = isOrganizationAdmin
      ? SUBS_SETTINGS_PATH
      : SUBS_EXPIRED_PATH;

    if (
      orgData?.subscriptionDetails?.trialEnded &&
      pathname !== subscriptionPath &&
      isRequiredSubscription
    ) {
      return subscriptionPath;
    }

    // if (isMobile) {
    //   return await handleMobileRedirection({
    //     data,
    //     orgData,
    //     history,
    //   });
    // }

    dispatch(getCurrentUserNotificationPreferences());
    dispatch(getOrganizationCustomFields());

    return await handleHomeRedirection({
      data,
      isEulaPath: pathname === EULA_PATH,
      isMobile,
      history,
      isHomePath: pathname === HOME_PATH,
    });
  } catch {
    return DEFAULT_REDIRECT_PATH;
  }
};

export default checkUserAccountState;

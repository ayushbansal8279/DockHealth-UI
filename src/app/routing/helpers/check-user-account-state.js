/* eslint-disable unicorn/filename-case */
import { getConfigurationForReferral } from 'actions/organization-actions';
import { getUserByEmail } from 'api/user-api';
import { useMobile as checkIsMobile } from 'helpers/utility-functions';
import { openModal } from 'modal/actions';
import {
  BAA_CHECK_PATH,
  BAA_OVERVIEW_PATH,
  BAA_INVITATION_SENT_PATH,
  EULA_PATH,
  UNENROLED_USER,
  HOME_PATH,
  DEFAULT_REDIRECT_PATH,
  SUBS_SETTINGS_PATH,
} from './paths';
import handleMobileRedirection from './handle-mobile-redirection';
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

    const data = await getUserByEmail(user.username, user);

    const isMobile = checkIsMobile();
    const isBaaPath =
      pathname === BAA_CHECK_PATH ||
      pathname === BAA_OVERVIEW_PATH ||
      pathname === BAA_INVITATION_SENT_PATH;

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
      return UNENROLED_USER;
    }

    if (data && !data.eulaAcknowledged && pathname !== EULA_PATH) {
      return EULA_PATH;
    }

    if (
      data?.organizationIdentifier !== '' &&
      !orgData?.baaSigned &&
      !isBaaPath
    ) {
      return BAA_OVERVIEW_PATH;
    }

    if (
      orgData?.subscriptionDetails?.trialEnded &&
      pathname !== SUBS_SETTINGS_PATH &&
      isRequiredSubscription
    ) {
      dispatch(openModal('TrialExpiration', { closeOnClickBackground: false }));
      return HOME_PATH;
    }

    if (isMobile) {
      return await handleMobileRedirection({
        data,
        orgData,
        history,
      });
    }

    return await handleHomeRedirection({
      data,
      orgData,
      isEulaPath: pathname === EULA_PATH,
      isBaaPath,
      isMobile,
      history,
      isHomePath: pathname === HOME_PATH,
    });
  } catch (error) {
    return DEFAULT_REDIRECT_PATH;
  }
};

export default checkUserAccountState;

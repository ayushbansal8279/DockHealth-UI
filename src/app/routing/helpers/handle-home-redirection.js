import { getUserProfilePic, getUserNotificationPrefs } from 'api/user-api';
import { HOME_PATH, DEFAULT_REDIRECT_PATH } from './paths';

const handleHomeRedirection = async ({
  data,
  orgData,
  isEulaPath,
  isBaaPath,
  isHomePath,
}) => {
  try {
    if (data?.profileThumbnailPictureHash) {
      await getUserProfilePic(data?.userIdentifier, 'PROFILE');
    }

    await getUserNotificationPrefs();

    if (
      ((data?.eulaAcknowledged && isEulaPath) ||
        (orgData?.baaSigned && isBaaPath)) &&
      !isHomePath
    ) {
      return HOME_PATH;
    }

    return null;
  } catch (error) {
    return DEFAULT_REDIRECT_PATH;
  }
};

export default handleHomeRedirection;

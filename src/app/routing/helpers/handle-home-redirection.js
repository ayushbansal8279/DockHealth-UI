import { HOME_PATH, DEFAULT_REDIRECT_PATH } from './paths';

const handleHomeRedirection = async ({ data, isEulaPath, isHomePath }) => {
  try {
    if (data?.eulaAcknowledged && isEulaPath && !isHomePath) {
      return HOME_PATH;
    }

    return null;
  } catch {
    return DEFAULT_REDIRECT_PATH;
  }
};

export default handleHomeRedirection;

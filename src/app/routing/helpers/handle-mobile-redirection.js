// eslint-disable-next-line import/named
import { ORG_SETUP_PATH } from './paths';

const handleMobileRedirection = ({ data, orgData }) => {
  if (data?.eulaAcknowledged && orgData?.baaSigned) {
    return ORG_SETUP_PATH;
  }
  return null;
};

export default handleMobileRedirection;

import { TEAM_ORG_SETUP_PATH } from './paths';

const handleMobileRedirection = ({ data, orgData }) => {
  if (data?.eulaAcknowledged && orgData?.baaSigned) {
    return TEAM_ORG_SETUP_PATH;
  }
  return null;
};

export default handleMobileRedirection;

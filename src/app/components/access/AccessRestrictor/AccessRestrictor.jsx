import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';

const RestrictAccess = ({ children, required = [], allowedToRoles }) => {
  const { orgUserPermissions } = useSelector(userProfileSelector);

  if (allowedToRoles) {
    console.warn('Using deprecated prop.', new Error().stack);
  }

  if (!orgUserPermissions) {
    return null;
  }

  if (required.every(permission => orgUserPermissions[permission])) {
    return children;
  }

  return null;
};

export const CAN_ACCESS_HOME_PAGE = 'canAccessHomePage';
export const CAN_ACCESS_SEARCH_PAGE = 'canAccessSearchPage';
export const CAN_ACCESS_TASK_LIST_PAGE = 'canAccessSearchPage';
export const CAN_ACCESS_PEOPLE_LIST_PAGE = 'canAccessPeopleListPage';
export const CAN_ACCESS_MEMBER_LIST_PAGE = 'canAccessMemberListPage';
export const CAN_ACCESS_WORKFLOW_LIST_PAGE = 'canAccessWorkflowListPage';
export const CAN_ACCESS_ANALYTICS_PAGE = 'canAccessAnalyticsPage';
export const CAN_ACCESS_CHAT_PAGE = 'canAccessChatPage';
export const CAN_ACCESS_SETTINGS_PAGE = 'canAccessSettingsPage';
export const CAN_ACCESS_PROFILE_PAGE = 'canAccessProfilePage';
export const CAN_ACCESS_EDUCATION_CENTER_PAGE = 'canAccessEducationCenterPage';

export default RestrictAccess;

import prop from 'ramda/src/prop';
import { createSelector } from 'reselect';

export const organizationStateSelector = state => state.organizationState;

export const organizationSelector = createSelector(
  organizationStateSelector,
  ({ organization }) => organization,
);

export const isFetchingOrganizationSelector = createSelector(
  organizationStateSelector,
  ({ isFetching }) => isFetching,
);

export const currentSubscriptionPlanSelector = createSelector(
  organizationStateSelector,
  ({ billingData }) => billingData,
);

export const isSavingNewPlanSelector = createSelector(
  organizationStateSelector,
  ({ isSavingNewPlan }) => isSavingNewPlan,
);

export const billingDetailsSelector = createSelector(
  organizationStateSelector,
  ({ billingDetails }) => billingDetails,
);

export const messageBannerBarSelector = createSelector(
  organizationStateSelector,
  ({ referralConfig }) => referralConfig?.messageBannerBar,
);

export const organizationStatusesSelector = createSelector(
  organizationStateSelector,
  prop('statuses'),
);

export const organizationStatusesErrorSelector = createSelector(
  organizationStateSelector,
  prop('statusesError'),
);

export const fetchingOrganizationStatusesSelector = createSelector(
  organizationStateSelector,
  prop('isFetchingStatuses'),
);

export const organizationUsersSelector = createSelector(
  organizationStateSelector,
  prop('organizationUsers'),
);

export const isFetchingOrganizationUsersSelector = createSelector(
  organizationStateSelector,
  prop('isFetchingOrganizationUsers'),
);

export const organizationCustomFieldsSelector = createSelector(
  organizationStateSelector,
  prop('organizationCustomFields'),
);

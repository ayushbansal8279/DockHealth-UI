import { prop } from 'ramda';
import { createSelector } from 'reselect';

export const organizationStateSelector = state => state.organizationState;

export const organizationSelector = createSelector(
  organizationStateSelector,
  ({ organization }) => organization,
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

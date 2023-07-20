import prop from 'ramda/src/prop';
import { createSelector } from 'reselect';

export const organizationStateSelector = (state) => state.organizationState;

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

export const invoiceDetailsSelector = createSelector(
  organizationStateSelector,
  ({ invoiceDetails }) => invoiceDetails,
);

export const referralConfigSelector = createSelector(
  organizationStateSelector,
  ({ referralConfig }) => referralConfig,
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

export const organizationCustomFieldsSelector = createSelector(
  organizationStateSelector,
  prop('organizationCustomFields'),
);

export const newPaymentPlanSelector = createSelector(
  organizationStateSelector,
  ({ newPaymentPlan }) => newPaymentPlan,
);

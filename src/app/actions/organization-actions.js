import * as OrganizationApi from 'api/organization-api';
import * as ActionTypes from 'actions/action-types';

export const handleOrganizationResponse = ({ fetchMethod, dispatch }) =>
  fetchMethod()
    .then(data => {
      dispatch({
        type: ActionTypes.GET_ORGANIZATION_SUCCESS,
        payload: data,
      });
      return data;
    })
    .catch(error => {
      dispatch({
        type: ActionTypes.GET_ORGANIZATION_FAILURE,
        error,
      });
      throw error;
    });

export const getOrganizationById = ({ organizationIdentifier }) => dispatch => {
  if (!organizationIdentifier) {
    return Promise.reject(new Error('No organization identifier provided'));
  }

  dispatch({
    type: ActionTypes.REQUEST_GET_ORGANIZATION,
  });

  return handleOrganizationResponse({
    fetchMethod: () => OrganizationApi.getOrganization(organizationIdentifier),
    dispatch,
  });
};

export const saveBillingDetails = (billingData, cardToken) => dispatch => {
  dispatch({
    type: ActionTypes.REQUEST_SAVE_BILLING_DETAILS,
  });

  return OrganizationApi.saveBillingDetails({ billingData, cardToken })
    .then(data => {
      dispatch({
        type: ActionTypes.SAVE_BILLING_DETAILS_SUCCESS,
        payload: data,
      });
    })
    .catch(error => {
      dispatch({
        type: ActionTypes.SAVE_BILLING_DETAILS_FAILURE,
        error,
      });
    });
};

export function updateSubscriptionDetails(newPlan) {
  return {
    type: ActionTypes.UPDATE_SUBSCRIPTION_PLAN,
    newPlan,
  };
}

export const getBillingEstimate = ({
  subscriptionPlan,
  billingFrequency,
} = {}) => dispatch => {
  dispatch({
    type: ActionTypes.REQUEST_GET_BILLING_ESTIMATE,
  });

  return OrganizationApi.getBillingEstimate({
    subscriptionPlan,
    billingFrequency,
  })
    .then(data => {
      dispatch({
        type: ActionTypes.GET_BILLING_ESTIMATE_SUCCESS,
        payload: data,
      });
    })
    .catch(error => {
      dispatch({
        type: ActionTypes.GET_BILLING_ESTIMATE_FAILURE,
        error,
      });
    });
};

// eslint-disable-next-line unicorn/consistent-function-scoping
export const getBillingDetails = () => dispatch => {
  dispatch({
    type: ActionTypes.REQUEST_GET_BILLING_DETAILS,
  });

  return OrganizationApi.getBillingDetails()
    .then(data => {
      dispatch({
        type: ActionTypes.GET_BILLING_DETAILS_SUCCESS,
        payload: data,
      });
    })
    .catch(error => {
      dispatch({
        type: ActionTypes.GET_BILLING_DETAILS_FAILURE,
        error,
      });
    });
};

export const getInvoiceDetails = ({ organizationIdentifier }) => dispatch => {
  dispatch({
    type: ActionTypes.REQUEST_GET_INVOICE_DETAILS,
  });

  OrganizationApi.getInvoiceDetails({ organizationIdentifier })
    .then(data => {
      dispatch({
        type: ActionTypes.GET_INVOICE_DETAILS_SUCCESS,
        payload: data,
      });
    })
    .catch(error => {
      dispatch({
        type: ActionTypes.GET_INVOICE_DETAILS_FAILURE,
        error,
      });
    });
};

export const setPaymentNewPlan = ({ newPlan }) => dispatch => {
  dispatch({
    type: ActionTypes.SET_NEW_PAYMENT_PLAN,
    payload: newPlan,
  });
};

export const updateOrganization = ({
  organizationName,
  organizationInitials,
  organizationProfileColor,
  organizationIdentifier,
}) => dispatch =>
  OrganizationApi.updateOrganization({
    organizationName,
    organizationInitials,
    organizationProfileColor,
    organizationIdentifier,
  }).then(() => {
    dispatch({
      type: ActionTypes.UPDATE_ORGANIZATION,
      payload: {
        organizationName,
      },
    });
  });

// eslint-disable-next-line unicorn/consistent-function-scoping
export const checkBAASignedStatus = organizationIdentifier => dispatch => {
  dispatch({
    type: ActionTypes.REQUEST_GET_ORGANIZATION,
  });

  return handleOrganizationResponse({
    fetchMethod: () => {
      const checkBAASignedStatusWithMemo = OrganizationApi.checkBAASignedStatusWithMemo(
        organizationIdentifier,
      );

      return checkBAASignedStatusWithMemo(organizationIdentifier);
    },
    dispatch,
  });
};

export const getConfigurationForReferral = ({ referralCode }) => dispatch => {
  if (!referralCode) {
    // return Promise.reject(new Error('No referral code'));
    return Promise.resolve('No referral code');
  }

  return OrganizationApi.getConfigurationForReferral(referralCode)
    .then(data => {
      dispatch({
        type: ActionTypes.GET_REFERRAL_CONFIG_SUCCESS,
        payload: data,
      });
      return data;
    })
    .catch(error => {
      dispatch({
        type: ActionTypes.GET_REFERRAL_CONFIG_FAILURE,
        error,
      });
      throw error;
    });
};

export function setOrganizationStatuses(statuses) {
  return {
    type: ActionTypes.SET_ORGANIZATION_STATUSES,
    statuses,
  };
}

export function setFetchingOrganizationStatuses() {
  return {
    type: ActionTypes.SET_FETCHING_ORGANIZATION_STATUSES,
  };
}

export function setOrganizationStatusesError() {
  return {
    type: ActionTypes.SET_ORGANIZATION_STATUSES_ERROR,
  };
}

export function updateOrganizationStatus(identifier, dataToUpdate) {
  return {
    type: ActionTypes.UPDATE_ORGANIZATION_STATUS,
    identifier,
    dataToUpdate,
  };
}

export function getOrganizationUsers() {
  return { type: ActionTypes.GET_ORGANIZATION_USERS };
}

export function changeUserOrganizationRole(userIdentifier, role) {
  return {
    type: ActionTypes.CHANGE_USER_ORGANIZATION_ROLE,
    userIdentifier,
    role,
  };
}

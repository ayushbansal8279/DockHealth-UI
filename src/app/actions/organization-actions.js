import * as OrganizationApi from '../api/organization-api';
import {
  GET_ORGANIZATION_FAILURE,
  GET_ORGANIZATION_SUCCESS,
  REQUEST_GET_ORGANIZATION,
  REQUEST_SELECT_SUBSCRIPTION_PLAN,
  SELECT_SUBSCRIPTION_PLAN_FAILURE,
  SELECT_SUBSCRIPTION_PLAN_SUCCESS,
  REQUEST_GET_BILLING_ESTIMATE,
  GET_BILLING_ESTIMATE_FAILURE,
  GET_BILLING_ESTIMATE_SUCCESS,
} from './action-types';

export const getOrganizationById = ({ organizationId }) => dispatch => {
  dispatch({
    type: REQUEST_GET_ORGANIZATION,
  });

  OrganizationApi.get({ organizationId })
    .then(data => {
      dispatch({
        type: GET_ORGANIZATION_SUCCESS,
        payload: data,
      });
    })
    .catch(error => {
      dispatch({
        type: GET_ORGANIZATION_FAILURE,
        error,
      });
    });
};

export const selectSubscriptionPlan = ({ subscriptionPlan }) => dispatch => {
  dispatch({
    type: REQUEST_SELECT_SUBSCRIPTION_PLAN,
  });

  OrganizationApi.selectSubscriptionPlan({ subscriptionPlan })
    .then(data => {
      dispatch({
        type: SELECT_SUBSCRIPTION_PLAN_SUCCESS,
        payload: data,
      });
    })
    .catch(error => {
      dispatch({
        type: SELECT_SUBSCRIPTION_PLAN_FAILURE,
        error,
      });
    });
};

export const getBillingEstimate = ({ organizationId }) => dispatch => {
  dispatch({
    type: REQUEST_GET_BILLING_ESTIMATE,
  });

  OrganizationApi.getBillingEstimate({ organizationId })
    .then(data => {
      dispatch({
        type: GET_BILLING_ESTIMATE_SUCCESS,
        payload: data,
      });
    })
    .catch(error => {
      dispatch({
        type: GET_BILLING_ESTIMATE_FAILURE,
        error,
      });
    });
};

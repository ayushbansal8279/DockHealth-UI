import axios from './axios-heydoc';

export const get = ({ organizationId }) =>
  axios.get(`/organization/${organizationId}`).then(response => {
    if (response.data) {
      return response.data;
    }

    throw new Error('Organization not found');
  });

export const selectSubscriptionPlan = ({
  organizationId,
  subscriptionPlan,
  billingFrequency,
}) =>
  axios({
    method: 'put',
    url: '/organization/selectSubscriptionPlan',
    data: {
      organizationId,
      subscriptionPlan,
      billingFrequency,
    },
  }).then(response => response.data);

export const saveBillingDetails = ({ data, token }) =>
  axios({
    method: 'put',
    url: '/organization/saveBillingDetails',
    data: {
      billingName: data.name,
      billingEmail: data.email,
      billingAddressLine1: data.address,
      billingAddressCity: data.city,
      billingAddressState: data.state,
      billingAddressPostalCode: data.zip,
      cardTokenIdentifier: token.token.id,
    },
  }).then(response => response.data);

export const getBillingEstimate = ({ organizationId }) =>
  axios({
    method: 'get',
    url: `/organization/getBillingEstimate/${organizationId}`,
  }).then(response => response.data);

export const getBillingDetails = ({ organizationId }) =>
  axios({
    method: 'get',
    url: `/organization/getBillingDetails/${organizationId}`,
  }).then(response => response.data);

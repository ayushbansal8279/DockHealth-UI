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
    params: {
      organizationId,
      subscriptionPlan,
      billingFrequency,
    },
  }).then(response => response.data);

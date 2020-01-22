import axios from './axios-heydoc';

export const get = ({ organizationId }) =>
  axios
    .get(`/organization/${organizationId}`)
    .then(
      response => response.data || throw new Error('Organization not found'),
    );

export const selectSubscriptionPlan = ({ planType: role }) =>
  axios({
    method: 'get',
    url: '/organization/selectSubscriptionPlan',
    params: {
      role,
    },
  }).then(response => response.data);

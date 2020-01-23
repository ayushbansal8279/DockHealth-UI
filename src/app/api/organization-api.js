import axios from './axios-heydoc';

export const get = ({ organizationId }) =>
  axios.get(`/organization/${organizationId}`).then(response => {
    if (response.data) {
      return response.data;
    }

    throw new Error('Organization not found');
  });

export const selectSubscriptionPlan = ({ organizationId, planType: role }) =>
  axios({
    method: 'put',
    url: '/organization/selectSubscriptionPlan',
    params: {
      organizationId,
      role,
    },
  }).then(response => response.data);

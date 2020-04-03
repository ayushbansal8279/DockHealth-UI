import axios from './axios-heydoc';

export const getConfigurationForReferral = ( referralCode ) =>
  axios.get(`/referral/config/${referralCode}`).then(response => {
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Referral config not found');
  });

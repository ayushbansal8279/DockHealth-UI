import { memoizeWith, identity } from 'ramda';
import axios from './axios-heydoc';

export const get = ({ organizationIdentifier }) => {
  addAuthorizationHeader();
  return axios.get(`/organization/${organizationIdentifier}`).then(response => {
    if (response.data) {
      return response.data;
    }

    throw new Error('Organization not found');
  });
};

export const saveBillingDetails = ({ billingData, token }) =>
  axios({
    method: 'put',
    url: '/organization/saveBillingDetails',
    data: {
      billingName: billingData.name,
      billingEmail: billingData.email,
      billingAddressLine1: billingData.address,
      billingAddressLine2: billingData.address2,
      billingAddressCity: billingData.city,
      billingAddressState: billingData.state,
      billingAddressPostalCode: billingData.zip,
      discountCode: billingData.discountCode,
      subscriptionDetails: {
        subscriptionPlan: billingData.subscriptionDetails?.subscriptionPlan,
        billingFrequency: billingData.subscriptionDetails?.billingFrequency,
      },
      cardTokenIdentifier: token.token.id,
    },
  }).then(response => response.data);

export const getBillingEstimate = ({ subscriptionPlan, billingFrequency }) =>
  axios({
    method: 'get',
    url: '/organization/getBillingEstimate',
    params: {
      selectedSubscriptionPlan: subscriptionPlan,
      selectedBillingFrequency: billingFrequency,
    },
  }).then(response => response.data);

export const getBillingDetails = () => {
  addAuthorizationHeader();
  return axios({
    method: 'get',
    url: `/organization/getBillingDetails`,
  }).then(response => response.data);
};
export const getInvoiceDetails = () =>
  axios({
    method: 'get',
    url: `/organization/getInvoiceDetails`,
  }).then(response => response.data);

export const updateLegalEntityName = ({ legalEntityName }) =>
  axios({
    method: 'put',
    url: '/organization/updateOrganizationLegalEntityName',
    data: {
      organizationLegalEntityName: legalEntityName,
    },
  }).then(response => response.data);

export const updateOrganizationName = ({ organizationName }) =>
  axios({
    method: 'put',
    url: '/organization/updateOrganizationName',
    data: {
      organizationName,
    },
  }).then(response => response.data);

export const signOrganizationBAADocument = ({ legalEntityName }) =>
  axios({
    method: 'put',
    url: '/organization/signOrganizationBAADocument',
    data: {
      organizationLegalEntityName: legalEntityName,
    },
  }).then(response => response.data);

export const storeSignatureResult = ({
  signatureIdentifier,
  signatureResult,
}) =>
  axios({
    method: 'put',
    url: '/organization/storeSignatureResult',
    data: {
      signatureIdentifier,
      signatureResult,
    },
  }).then(response => response.data);

export const inviteAuthorizedSigner = ({
  firstName,
  lastName,
  email,
  phoneNumber,
}) =>
  axios({
    method: 'put',
    url: '/organization/inviteAuthorizedSigner',
    data: {
      firstName,
      lastName,
      email,
      phoneNumber,
    },
  }).then(response => response.data);

export const downloadSignedDocument = () =>
  axios({
    url: `/organization/downloadSignedDocument`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  }).then(response => {
    return response.data;
  });

export const checkBAASignedStatus = memoizeWith(identity, () =>
  axios.get(`/organization/checkBAASignedStatus`).then(response => {
    if (response.data) {
      return response.data;
    }

    throw new Error('Unable to check BAA signature status');
  }),
);

export const getConfigurationForReferral = referralCode =>
  axios.get(`/referral/config/${referralCode}`).then(response => {
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Referral config not found');
  });

const addAuthorizationHeader = () => {
  const currentAccessToken = sessionStorage.getItem('accessToken');
  axios.defaults.headers.common.Authorization = `Bearer ${currentAccessToken}`;
};

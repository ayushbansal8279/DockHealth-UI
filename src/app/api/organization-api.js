import axios from './axios-heydoc';

export const get = ({ organizationId }) =>
  axios.get(`/organization/${organizationId}`).then(response => {
    if (response.data) {
      return response.data;
    }

    throw new Error('Organization not found');
  });

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
      subscriptionDetails: {
        subscriptionPlan: data.subscriptionDetails?.subscriptionPlan,
        billingFrequency: data.subscriptionDetails?.billingFrequency,
      },
      cardTokenIdentifier: token.token.id,
    },
  }).then(response => response.data);

export const getBillingEstimate = () =>
  axios({
    method: 'get',
    url: `/organization/getBillingEstimate`,
  }).then(response => response.data);

export const getBillingDetails = () =>
  axios({
    method: 'get',
    url: `/organization/getBillingDetails`,
  }).then(response => response.data);

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

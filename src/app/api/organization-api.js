import memoize from 'lodash.memoize';
import { noop } from 'helpers/utility-functions';
import axios from './axios-heydoc';

export const get = ({ organizationIdentifier }) => {
  return axios.get(`/organization/${organizationIdentifier}`).then(response => {
    if (response.data) {
      return response.data;
    }

    throw new Error('Organization not found');
  });
};

export const createOrganization = ({
  organizationName,
  organizationInitials,
  organizationProfileColor,
}) =>
  axios({
    method: 'post',
    url: '/organization',
    data: {
      organizationName,
      organizationInitials,
      organizationProfileColor,
    },
  }).then(({ data }) => data);

export const saveBillingDetails = ({ billingData, token }) =>
  axios({
    method: 'put',
    url: '/organization/saveBillingDetails',
    data: {
      billingName: billingData.nameOnCard,
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

export const updateOrganizationName = ({
  organizationName,
  organizationInitials,
  organizationProfileColor,
  organizationIdentifier = null,
}) =>
  axios({
    method: 'put',
    url: '/organization/updateOrganizationName',
    data: {
      organizationName,
      organizationInitials,
      organizationProfileColor,
      organizationIdentifier,
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

export const checkBAASignedStatus = (organizationIdentifier, resetCachedOrg) =>
  axios
    .get(
      `/organization/checkBAASignedStatus?organizationIdentifier=${organizationIdentifier}`,
    )
    .then(response => {
      if (resetCachedOrg) {
        sessionStorage.removeItem('refreshOrgMemo');
      }

      if (response.data) {
        return response.data;
      }

      throw new Error('Unable to check BAA signature status');
    });

const keyResolver = (...arguments_) => JSON.stringify(arguments_);

export const checkBAASignedStatusWithMemo = () =>
  memoize(checkBAASignedStatus, keyResolver);

export const getConfigurationForReferral = referralCode =>
  axios.get(`/referral/config/${referralCode}`).then(response => {
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Referral config not found');
  });

// const addAuthorizationHeader = () => {
//   const currentAccessToken = sessionStorage.getItem('accessToken');
//   axios.defaults.headers.common.Authorization = `Bearer ${currentAccessToken}`;
// };

export const referAColleague = referDetails => {
  axios({
    method: 'put',
    url: '/organization/referAColleague',
    data: referDetails,
  }).then(response => response.data);
};

export function downloadBAADocument() {
  return axios({
    url: `/organization/downloadBAADocument`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', 'Dock_Health_Standard_BAA.pdf');
      document.body.append(link);
      link.click();
    })
    .catch(noop);
}

export function getOrganizationStatuses() {
  return axios
    .get(`/organization/settings/taskStatus/getAllTaskStatuses`)
    .then(({ data }) => data);
}

export function deleteOrganizationStatus(identifier) {
  return axios
    .delete(`/organization/settings/taskStatus/${identifier}`)
    .then(({ data }) => data);
}

export function createOrganizationStatus(statusData) {
  return axios
    .post(`/organization/settings/taskStatus`, statusData)
    .then(({ data }) => data);
}

export function updateOrganizationStatus(identifier, statusData) {
  return axios
    .put(`/organization/settings/taskStatus`, { identifier, ...statusData })
    .then(({ data }) => data);
}

export function reorderOrganizationStatuses(taskStatusIdentifiers) {
  return axios
    .put(`/organization/settings/taskStatus/sort`, { taskStatusIdentifiers })
    .then(({ data }) => data);
}

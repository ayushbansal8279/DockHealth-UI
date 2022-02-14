import memoize from 'lodash.memoize';
import { uniqBy, prop } from 'ramda';
import { noop } from 'helpers/utility-functions';
import axios from './axios-heydoc';

export function getOrganizationUsersAndUserGroups() {
  return axios
    .get('user/findAllUsersByOrganizationId?includeGroups=true')
    .then(response => {
      return response.data;
    })
    .catch(error => error?.response?.data);
}

export function getOrganizationUsers() {
  return axios
    .get('user/findAllUsersByOrganizationId?includeGroups=false')
    .then(response => {
      return response.data;
    })
    .catch(error => error?.response?.data);
}

export function findAllUsersForOrganization() {
  return Promise.all([
    axios({
      method: 'get',
      url: '/user/findAllUsersByOrganizationId?includeGroups=false',
    }),
    axios({
      method: 'get',
      url: '/user/findAllInActiveUsersByOrganizationId',
    }),
  ])
    .then(([responseActive, responseInactive]) => {
      const allUsers = [
        ...responseActive.data.map(({ subscription, ...otherData }) => ({
          ...otherData,
          subscription: subscription ?? { subscriptionPlanName: 'Standard' },
        })),
        ...responseInactive.data.map(({ ...otherData }) => ({
          ...otherData,
          subscription: null,
        })),
      ];

      return uniqBy(prop('email'), allUsers);
    })
    .catch(error => {
      throw new Error(error?.response?.data ?? error?.message);
    });
}

export function updateOrganizationCallType({ type, organizationIdentifier }) {
  return axios
    .patch(`organization`, {
      organizationIdentifier,
      customerType: type.selectedRecord.key,
    })
    .then(({ data }) => data);
}

export const getOrganization = organizationIdentifier => {
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
        professionalServicesIncluded:
          billingData.subscriptionDetails?.professionalServicesIncluded,
      },
      cardTokenIdentifier: token.token.id,
    },
  }).then(response => response.data);

export function updateSubscriptionPlan(newPlan) {
  return axios
    .put(`/organization/saveBillingDetails`, {
      subscriptionDetails: newPlan,
    })
    .then(({ data }) => data);
}

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

export const updateOrganization = ({
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

export function changeUserOrganizationRole(userIdentifier, role) {
  return axios
    .put(
      `${'organization/changeUserRoleForOrg/' +
        '?markedUserId='}${userIdentifier}&role=${role}`,
    )
    .then(response => {
      return response.data;
    });
}

export function invitePersonToOrganization(person) {
  return axios({
    url: 'organization/invitePersonToOrganization',
    method: 'put',
    data: person,
  })
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function resendInviteToOrganization(userIdentifier) {
  return axios
    .put(
      `organization/resendInviteToOrganization/?userIdentifier=${userIdentifier}`,
    )
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function resendApprovalRequestUserForOrganization(userIdentifier) {
  return axios
    .put(
      `user/resendApprovalRequestUserForOrganization/?userIdentifier=${userIdentifier}`,
    )
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function cancelInviteToOrganization(markedUserIdentifier) {
  return axios
    .put(
      `${'organization/cancelInviteToOrganization/' +
        '?userIdentifier='}${markedUserIdentifier}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function removeUserFromOrganization(removedUserIdentifier) {
  return axios
    .delete(
      `${'user/removeUserFromOrganization' +
        '?userIdentifier='}${removedUserIdentifier}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function reactivateUserInOrganization(userIdentifier) {
  return axios
    .put(`${'user/addUserToOrganization?userIdentifier='}${userIdentifier}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function approvePendingUser({ userIdentifier, role }) {
  return axios
    .put(`user/approveUserForOrganization?userIdentifier=${userIdentifier}`, {
      role,
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function denyPendingUser({ userIdentifier }) {
  return axios
    .put(`user/denyUserForOrganization?userIdentifier=${userIdentifier}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function archiveUser(userIdentifier) {
  return axios.delete(
    `user/archiveUserFromOrganization?userIdentifier=${userIdentifier}`,
  );
}

export function reactivateUser(userIdentifier, role) {
  return axios.put(
    `user/addUserToOrganization?userIdentifier=${userIdentifier}&role=${role}`,
  );
}

export function changeUserToOwner(userIdentifier) {
  return axios.put(
    `organization/reassignOwnerForOrg?assignedUserId=${userIdentifier}`,
  );
}

export function getCurrentUserOrganizations() {
  return axios.get('user/findUserOrganizations').then(({ data }) => data);
}

export const leaveOrganization = organizationIdentifier =>
  axios
    .delete(`/user/leaveOrganization/${organizationIdentifier}`)
    .then(({ data }) => data);

export function selectCurrentOrganizationWithRedirection(
  organizationIdentifier,
  redirectionLink,
) {
  return axios({
    method: 'put',
    url: `/user/selectOrganization/${organizationIdentifier}`,
  }).then(() => {
    sessionStorage.setItem(
      'currentOrganizationIdentifier',
      organizationIdentifier,
    );
    sessionStorage.setItem('redirectToLink', redirectionLink);
    axios.defaults.headers.common.CurrentOrganizationIdentifier = organizationIdentifier;
    window.location.reload();
  });
}

export function selectCurrentOrganization(
  organizationIdentifier,
  redirectToHome = true,
) {
  return axios({
    method: 'put',
    url: `/user/selectOrganization/${organizationIdentifier}`,
  }).then(() => {
    sessionStorage.setItem(
      'currentOrganizationIdentifier',
      organizationIdentifier,
    );
    if (redirectToHome) {
      sessionStorage.setItem('redirectToHome', JSON.stringify(true));
    }
    axios.defaults.headers.common.CurrentOrganizationIdentifier = organizationIdentifier;
    window.location.reload();
  });
}

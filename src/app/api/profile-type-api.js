import axios from './axios-heydoc';
import { showAlert } from '../helpers/utility-functions';
import { withWorkspaceHeaders } from '../helpers/api-helpers';

export function getAllProfileTypes(contextType, workspaceIdentifier) {
  const url = contextType
    ? `profile/type/getAll?contextType=${encodeURIComponent(contextType)}`
    : 'profile/type/getAll';

  return axios
    .get(url, withWorkspaceHeaders(workspaceIdentifier))
    .then(({ data }) => data);
}

export function getAllProfileTypesWithPredefined(workspaceIdentifier) {
  return axios
    .get(
      'profile/type/getAll?includePredefinedProfileTypes=true',
      withWorkspaceHeaders(workspaceIdentifier),
    )
    .then(({ data }) => data)
    .catch((error) => {
      console.error('Error fetching profile types:', error);
      throw new Error(
        error?.response?.data?.errorMessage || 'Failed to fetch profile types',
      );
    });
}

export function getProfileDetailsType(identifier) {
  return axios.get(`profile/type/${identifier}`).then(({ data }) => data);
}

export function createProfileType(profile, workspaceIdentifier) {
  return axios
    .post('profile/type', profile, withWorkspaceHeaders(workspaceIdentifier))
    .then(({ data }) => data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error.response?.data?.errorMessage ?? 'Error creating object type',
      });
    });
}

export function editProfileType(identifier, profile) {
  return axios
    .put(`profile/type/${identifier}`, profile)
    .then(({ data }) => data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error.response?.data?.errorMessage ?? 'Error updating object type',
      });
    });
}

export function deleteProfileType(identifier) {
  return axios
    .delete(`profile/type/${identifier}`)
    .then(({ data }) => data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error.response?.data?.errorMessage ?? 'Error deleting object type',
      });
    });
}

export function getProfileListPreferences(profileTypeIdentifier) {
  return axios
    .get(`profile/type/list/getUserPreferences/${profileTypeIdentifier}`)
    .then(({data}) => data);
}

export function updateProfileListPreferences(setup, profileTypeIdentifier) {
  return axios
    .put(`profile/type/list/updateUserPreferences/${profileTypeIdentifier}`, setup)
    .then(({ data }) => data);
}

export const getRelationshipTypes = (customProfileIdentifier) =>
  axios
    .get(`/profile/type/getAll/relationshipTypes/${customProfileIdentifier}`)
    .then(({ data }) => data);
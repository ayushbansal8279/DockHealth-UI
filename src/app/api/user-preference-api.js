import axios from './axios-heydoc';

export async function getUserPreference(contextType, contextIdentifier) {
  const params = contextIdentifier ? { contextIdentifier } : {};
  return axios
    .get(`/user/preference/${contextType}`, { params })
    .then(({ data }) => data);
}

export function updateUserPreference(
  contextType,
  contextIdentifier,
  partialDetails,
) {
  const params = contextIdentifier ? { contextIdentifier } : {};
  return axios
    .patch(`/user/preference/${contextType}`, partialDetails, { params })
    .then(({ data }) => data);
}


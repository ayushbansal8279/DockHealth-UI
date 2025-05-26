import { log } from '../helpers/log';
import { showAlert } from '../helpers/utility-functions';
import { createWorkspacePayload, Workspace } from '../types/workspace';
import axios from './axios-heydoc';

export async function getAllUserWorkspaces() {
  return axios
    .get(
      `workspace?organizationIdentifier=160f8db5-40c2-11ea-a4e8-124feabd863a`,
    )
    .then((response) => response.data);
}

export async function getWorkspaceByIdentifier(workspaceIdentifier: string) {
  return axios
    .get(`workspace/${workspaceIdentifier}`)
    .then((response) => response.data);
}

export async function createWorkspace(workspace: createWorkspacePayload) {
  return axios
    .post('workspace', workspace)
    .then((response) => response.data)
    .catch((error) => {
      log(error);
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error adding. Please try again.',
      });
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export async function updateWorkspace(workspace: createWorkspacePayload) {
  return axios
    .post('workspace', workspace)
    .then((response) => response.data)
    .catch((error) => {
      log(error);
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error adding. Please try again.',
      });
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export async function removeWorkspace(workspaceIdentifier: string) {
  return axios
    .delete(`workspace/${workspaceIdentifier}`)
    .then((response) => response)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export async function changeUserRoleForWorkspace(
  workspaceIdentifier: string,
  role: string,
  userIdentifier: string,
) {
  return axios
    .put(
      `workspace/${workspaceIdentifier}/changeUserRoleForOrg?role=${role}?&userIdentifier=${userIdentifier}`,
    )
    .then((response) => response)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

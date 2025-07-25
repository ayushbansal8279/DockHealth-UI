import { log } from '../helpers/log';
import { showAlert } from '../helpers/utility-functions';
import { ChangeUserRolePayload, createWorkspacePayload } from '../types/workspace';
import axios from './axios-heydoc';

function handleApiError(error: any): never {
  log(error);
  throw new Error(error?.response?.data?.errorMessage ?? 'Something went wrong. Please try again.');
}

export async function getWorkspaceByIdentifier(workspaceIdentifier: string) {
  return axios
    .get(`workspace/${workspaceIdentifier}`)
    .then((response) => response.data);
}

// TODO: move to ws-list
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

export async function getWorkspaceUsers(workspaceIdentifier: string) {
  try {
    const response = await axios.get(`workspace/${workspaceIdentifier}/listAllUsers`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function changeWorkspaceUserRole({
  workspaceIdentifier,
  userIdentifier,
  role,
}: ChangeUserRolePayload) {
  try {
    const response = await axios.put(
      `workspace/${workspaceIdentifier}/changeUserRole`,
      {},
      { params: { role, userIdentifier } }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

interface InviteUserToWorkspaceApiParams {
  userIdentifier: string;
  workspaceIdentifier: string;
}

export async function inviteUserToWorkspace({
  workspaceIdentifier,
  userIdentifier,
}: InviteUserToWorkspaceApiParams) {
  try {
    const response = await axios.put(
      `workspace/${workspaceIdentifier}/inviteUser/user/${userIdentifier}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

interface RemoveUserFromWorkspaceApiParams {
  userIdentifier: string;
  workspaceIdentifier: string;
}

export async function removeUserFromWorkspace({
  workspaceIdentifier,
  userIdentifier,
}: RemoveUserFromWorkspaceApiParams) {
  try {
    const response = await axios.delete(
      `/workspace/${workspaceIdentifier}/removeUser`,
      { params: { userIdentifier } }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function invitePersonToWorkspace(
  workspaceIdentifier: string,
  data: {
    firstName: string;
    lastName: string;
    userRole: string;
    email: string;
  },
) {
  try {
    const response = await axios.put(
      `/workspace/${workspaceIdentifier}/invitePerson`,
      data
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}
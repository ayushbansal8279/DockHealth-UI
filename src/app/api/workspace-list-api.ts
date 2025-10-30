import { log } from '../helpers/log';
import axios from './axios-heydoc';

export async function getAllUserWorkspaces() {
  return axios
    .get(
      `workspace?organizationIdentifier=160f8db5-40c2-11ea-a4e8-124feabd863a`, //dynamic !?
    )
    .then((response) => response.data);
}

export async function updateWorkspace(workspace) {
  return axios
    .patch(`workspace/${workspace.workspaceIdentifier}`, workspace)
    .then((response) => response.data)
    .catch((error) => {
      log(error);
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
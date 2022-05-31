import {
  onTaskListDeleted,
  onTaskListInvitationRejected,
} from 'helpers/ga-event-helper';
import axios from './axios-heydoc';

export function getTaskListForUser() {
  return axios({
    url: 'list/findTaskListsForUser?basicDetails=true',
    method: 'get',
  })
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getArchivedTaskListForUser() {
  return axios
    .get('list/findArchivedTaskListsForUser?basicDetails=true')
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getSharedTaskListsWithCurrentUser(userIdentifier) {
  return axios({
    url: `list/findSharedTaskListsWithCurrentUser/${userIdentifier}?basicDetails=true`,
    method: 'get',
  })
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getPendingTaskListsForUser() {
  return axios
    .get('list/findPendingTaskListsForUser?basicDetails=true')
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function addTaskList(tasklist) {
  return axios
    .post('list/', tasklist)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getTaskListById(taskListIdentifier) {
  return axios.get(`list/${taskListIdentifier}`).then(({ data }) => data);
}

export function updateTaskList(taskList) {
  // userIdentifier - make sure authorized user can only update the task list
  return axios
    .put('list/', taskList)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getMembersByTaskListId(taskListIdentifier, memberStatus) {
  return axios
    .get(
      `user/listAllUsersByTaskListId/${taskListIdentifier}?status=${memberStatus}`,
    )
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function invitePersonToTaskList(taskListIdentifier, personInfo) {
  return axios
    .put(`user/invitePersonToTaskList/${taskListIdentifier}`, personInfo)
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getOrganizationUsersNotInTaskList(taskListIdentifier) {
  return axios
    .get(`user/findOrganizationUsersNotInTaskList/${taskListIdentifier}`)
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export const inviteUserToTaskList = (taskListIdentifier, userIdentifier) =>
  axios
    .put(
      `/user/inviteUserToTaskList/${taskListIdentifier}/user/${userIdentifier}`,
    )
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });

export function inviteMultipleUsersToTaskList(
  taskListIdentifier,
  invitedUsersIdentifier,
) {
  const multiUserInvitation = {
    invitedUsersIdentifier,
  };

  return axios
    .put(
      `user/inviteMultipleUsersToTaskList/${taskListIdentifier}`,
      multiUserInvitation,
    )
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getNonOrgUsersByTaskList(taskListIdentifier) {
  return axios
    .get(`user/findNonOrgUsersByTaskList/${taskListIdentifier}`)
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function changeUserRoleForList(
  taskListIdentifier,
  markedUserIdentifier,
  role,
) {
  return axios
    .put(
      `list/changeUserRoleForList/${taskListIdentifier}?markedUserId=${markedUserIdentifier}&role=${role}`,
    )
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function deleteTaskListById(taskListIdentifier) {
  return axios
    .delete(`list/deleteTaskListById/${taskListIdentifier}`)
    .then(response => {
      onTaskListDeleted();
      return response?.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function archiveTaskListById(taskListIdentifier, archive) {
  return axios
    .put(`list/archive/${taskListIdentifier}?archive=${archive}`)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function removeUserFromTaskList(
  taskListIdentifier,
  removedUserIdentifier,
) {
  return axios
    .delete(
      `user/removeUserFromTaskList/${taskListIdentifier}?userIdentifier=${removedUserIdentifier}`,
    )
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function cancelInviteToTaskList(
  taskListIdentifier,
  cancelledUserIdentifier,
) {
  return axios
    .put(
      `list/cancelInviteToTaskList/${taskListIdentifier}?userIdentifier=${cancelledUserIdentifier}`,
    )
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function findAuditsByTaskList(taskListIdentifier, queryStartPosition) {
  return axios
    .get(
      `audit/findAuditsByTaskList/${taskListIdentifier}?queryStartPosition=${queryStartPosition}`,
    )
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function findAuditsForAllTaskListsByUserId(queryStartPosition) {
  return axios
    .get(
      `${'audit/findAuditsForAllTaskListsByUserId/' +
        '?queryStartPosition='}${queryStartPosition}`,
    )
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function findActivityFeedForAllTaskListsByUserId(queryStartPosition) {
  return axios
    .get(
      `${'audit/findActivityFeedForAllTaskListsByUserId/' +
        '?queryStartPosition='}${queryStartPosition}`,
    )
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function toggleListNotifications(
  taskListIdentifier,
  receiveNotifications,
) {
  return axios
    .put(
      `list/toggleUserNotificationsForTaskList/${taskListIdentifier}?notifications=${receiveNotifications}`,
    )
    .then(response => response)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function findGenericListCountsForUser() {
  return axios
    .get('list/getGenericListCountsForUser')
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function downloadPDF(taskListIdentifier) {
  return axios({
    url: `list/downloadPDFForTasksInList?taskListId=${taskListIdentifier}`,
    method: 'GET',
    responseType: 'blob', // important
  })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response?.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'DOCK_ActionGrid.pdf');
      document.body.append(link);
      link.click();
      return 'success';
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export const getTaskListStats = async ({ taskListIdentifier }) => {
  try {
    return await axios.get(`list/getTaskListStats/${taskListIdentifier}`);
  } catch (error) {
    throw new Error(error?.response?.data?.errorMessage);
  }
};

export function getListMembersByName(taskListIdentifier, name) {
  return axios
    .get(`/user/findListMembersByName/${taskListIdentifier}?name=${name}`)
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export function acceptInviteToTaskList(taskListIdentifier) {
  return axios
    .put(`list/acceptInviteToTaskList/${taskListIdentifier}`)
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function rejectInviteToTaskList(taskListIdentifier) {
  return axios
    .put(`list/rejectInviteToTaskList/${taskListIdentifier}`)
    .then(({ data }) => {
      onTaskListInvitationRejected();
      return data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function leaveList(taskListIdentifier) {
  return axios
    .delete(`user/userLeavesList/${taskListIdentifier}`)
    .then(({ data }) => {
      return data;
    });
}

export function updateUserColumnsListViewSetup(setup, taskListIdentifier) {
  return axios
    .put(`list/updateUserPreferences/${taskListIdentifier}`, {
      displayColumns: setup,
    })
    .then(({ data }) => data);
}

export function updateUserOptionsListViewSetup(setup, taskListIdentifier) {
  return axios
    .put(`list/updateUserPreferences/${taskListIdentifier}`, {
      displayOptions: setup,
    })
    .then(({ data }) => data);
}

export function updateUserCustomFieldsOptionsListViewSetup(
  setup,
  taskListIdentifier,
) {
  return axios
    .put(`list/updateUserPreferences/${taskListIdentifier}`, {
      customFieldDisplayColumns: setup,
    })
    .then(({ data }) => data);
}

export function updateUserAllFieldsOrderSetup(
  listDisplayColumns,
  taskListIdentifier,
) {
  return axios
    .put(`list/updateUserPreferences/${taskListIdentifier}`, {
      listDisplayColumns,
    })
    .then(({ data }) => data);
}

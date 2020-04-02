import axios from './axios-heydoc';

export function getTaskListForUser() {
  return axios({
    url: 'list/findTaskListsByUserId',
    method: 'get',
  })
    .then(response => response?.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function findPendingTaskListsForUser() {
  return axios
    .get('list/findPendingTaskListsForUser')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function addTaskList(tasklist) {
  return axios
    .post('list/', tasklist)
    .then(response => {
      toggleTaskForm();
      return response.data;
    })
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function getTaskListById(taskListIdentifier) {
  return axios
    .get(`list/${taskListIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function updateTaskList(taskList) {
  // userIdentifier - make sure authorized user can only update the task list
  return axios
    .put('list/', taskList)
    .then(response => {
      toggleTaskForm();
      return response.data;
    })
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function getMembersByTaskListId(taskListIdentifier, memberStatus) {
  return axios
    .get(
      `user/listAllUsersByTaskListId/${taskListIdentifier}?status=${memberStatus}`,
    )
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function invitePersonToTaskList(taskListIdentifier, personInfo) {
  return axios
    .put(`list/invitePersonToTaskList/${taskListIdentifier}`, personInfo)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function getOrganizationUsersNotInTaskList(taskListIdentifier) {
  return axios
    .get(`user/findOrganizationUsersNotInTaskList/${taskListIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export const inviteUserToTaskList = (taskListIdentifier, userIdentifier) =>
  axios
    .put(
      `/user/inviteUserToTaskList/${taskListIdentifier}/user/${userIdentifier}`,
    )
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data);
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
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function getNonOrgUsersByTaskList(taskListIdentifier) {
  return axios
    .get(`user/findNonOrgUsersByTaskList/${taskListIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
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
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function deleteTaskListById(taskListIdentifier) {
  return axios
    .delete(`list/deleteTaskListById/${taskListIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function removeUserFromTaskList(
  taskListIdentifier,
  removedUserIdentifier,
) {
  return axios
    .delete(
      `user/removeUserFromTaskList/${taskListIdentifier}?removedUserId=${removedUserIdentifier}`,
    )
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function cancelInviteToTaskList(taskListIdentifier, email) {
  return axios
    .put(
      `list/cancelInviteToTaskList/${taskListIdentifier}?markedUserEmail=${encodeURIComponent(
        email,
      )}`,
    )
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function findAuditsByTaskList(taskListIdentifier, queryStartPosition) {
  return axios
    .get(
      `audit/findAuditsByTaskList/${taskListIdentifier}?queryStartPosition=${queryStartPosition}`,
    )
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function findAuditsForAllTaskListsByUserId(queryStartPosition) {
  return axios
    .get(
      `${'audit/findAuditsForAllTaskListsByUserId/' +
        '?queryStartPosition='}${queryStartPosition}`,
    )
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function findActivityFeedForAllTaskListsByUserId(queryStartPosition) {
  return axios
    .get(
      `${'audit/findActivityFeedForAllTaskListsByUserId/' +
        '?queryStartPosition='}${queryStartPosition}`,
    )
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
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
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function findGenericListCountsForUser() {
  return axios
    .get('list/getGenericListCountsForUser')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function downloadPDF(taskListIdentifier) {
  return axios({
    url: `list/downloadPDFForTasksInList?taskListId=${taskListIdentifier}`,
    method: 'GET',
    responseType: 'blob', // important
  })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'DOCK_ActionGrid.pdf');
      document.body.append(link);
      link.click();
      return 'success';
    })
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export const getTaskListStats = async ({ taskListIdentifier }) => {
  try {
    return await axios.get(`list/getTaskListStats/${taskListIdentifier}`);
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data);
  }
};

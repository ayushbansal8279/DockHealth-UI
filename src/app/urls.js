const URLS = {
  taskGroupList: {
    // get: listId => `task/group/getGroupsForTaskList/${listId}`,
    get: listId => `task/stats/getTaskStatsForListTaskGroups/${listId}`,
    add: 'task/group',
    edit: 'task/group',
    delete: groupId => `task/group/${groupId}`,
    sort: 'task/group/sortTaskGroups',
  },
  tasks: {
    reassignTasks: groupIdentifier =>
      `task/group/assignTasksToTaskGroup/${groupIdentifier}`,
  },
  megaFilter: {
    getFiltersForTaskList: (listId, status) =>
      `task/filter/filterOptionsForTaskList/${listId}?status=${status}`,
    getFiltersForPeopleList: (userId, status) =>
      `/task/filter/filterOptionsForAssignedToUser/${userId}?status=${status}`,
  },
};

export default URLS;

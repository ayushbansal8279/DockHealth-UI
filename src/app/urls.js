const URLS = {
  taskGroupList: {
    get: listId => `task/group/getGroupsForTaskList/${listId}`,
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
    getFilters: listId => `task/filter/filterOptionsForTaskList/${listId}`,
  },
};

export default URLS;

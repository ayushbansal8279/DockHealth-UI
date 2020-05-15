const URLS = {
  taskGroupList: {
    get: listId => `task/group/getGroupsForTaskList/${listId}`,
    add: 'task/group',
    edit: 'task/group',
    delete: groupId => `task/group/${groupId}`,
    sort: 'task/group/sortTaskGroups',
  },
};

export default URLS;

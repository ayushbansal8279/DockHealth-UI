const checkIfAssignNameMatch = (searchValue, assignedUser = {}) => {
  if (!assignedUser) return false;

  const { firstName, lastName } = assignedUser;

  return !!`${firstName} ${lastName}`
    .toLowerCase()
    .includes(searchValue?.toLowerCase());
};

const checkIfWorkflowMatch = (searchValue, workflowStatus) => {
  if (!workflowStatus) return false;

  return !!`${workflowStatus}`
    .toLowerCase()
    .includes(searchValue?.toLowerCase());
};

export const checkIfTaskMatchesSearch = (task, searchValue) => {
  const { workflowStatus, assignedTo } = task;

  if (!searchValue || searchValue === '') {
    return true;
  }

  return (
    checkIfAssignNameMatch(searchValue, assignedTo) ||
    checkIfWorkflowMatch(searchValue, workflowStatus)
  );
};

export default checkIfTaskMatchesSearch;

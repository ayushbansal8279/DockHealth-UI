const checkIfAssignNameMatch = (searchValue, assignedUser = {}) => {
  if (!assignedUser) return false;

  const { firstName, lastName } = assignedUser;

  if (
    `${firstName} ${lastName}`
      .toLowerCase()
      .includes(searchValue?.toLowerCase())
  ) {
    return true;
  }
  return false;
};

const checkIfWorkflowMatch = (searchValue, workflowStatus) => {
  if (!workflowStatus) return false;

  if (`${workflowStatus}`.toLowerCase().includes(searchValue?.toLowerCase())) {
    return true;
  }

  return false;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
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

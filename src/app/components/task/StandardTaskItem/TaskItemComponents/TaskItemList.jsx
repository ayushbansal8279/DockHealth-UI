import React from 'react';
import { ListLink } from '../../styled';

const TaskItemList = ({ listName, taskListIdentifier, taskStatus }) => {
  return listName && taskListIdentifier ? (
    <ListLink
      to={`/core/tasks/${taskListIdentifier}${
        taskStatus === 'COMPLETE' ? '/complete' : ''
      }`}
    >
      {listName}
    </ListLink>
  ) : (
    ''
  );
};

export default TaskItemList;

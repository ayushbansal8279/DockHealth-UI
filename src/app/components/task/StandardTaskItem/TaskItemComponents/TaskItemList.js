import React from 'react';
import palette from 'styles/palette';
import { StandardTaskItemCell, ListLink } from '../../styled';

const TaskItemList = ({ listName, taskListIdentifier, taskStatus }) => {
  return (
    <StandardTaskItemCell
      color={listName ? palette.brightBlue : palette.coolGrey2}
      width="168px"
    >
      {listName && taskListIdentifier ? (
        <ListLink
          to={`/core/tasks/${taskListIdentifier}${
            taskStatus === 'COMPLETE' ? '/complete' : ''
          }`}
        >
          {listName}
        </ListLink>
      ) : (
        'Unfiled'
      )}
    </StandardTaskItemCell>
  );
};

export default TaskItemList;

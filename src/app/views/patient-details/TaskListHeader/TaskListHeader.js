import React from 'react';
import TaskListMembers from 'components/tasklist/TaskListMembers/TaskListMembers';
import {
  ListDetailsContainer,
  ListDetailsHeader,
  ListNameContainer,
  ListDescription,
} from 'components/tasklist/DropdownListSection/styled';

const TaskListHeader = ({ list, refreshView, children }) => {
  const { listUsers } = list || {};

  return (
    <ListDetailsHeader>
      <ListNameContainer>
        <ListDescription>{list?.listDescription}</ListDescription>
      </ListNameContainer>
      {listUsers?.length > 0 && (
        <TaskListMembers
          members={listUsers}
          list={list}
          refreshMembers={refreshView}
        />
      )}
    </ListDetailsHeader>
  );
};

export default TaskListHeader;

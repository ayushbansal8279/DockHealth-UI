import React, { useEffect, useState } from 'react';
import * as TaskListApi from 'api/tasklist-api';

const MembersForList = ({ component: Component, ...props }) => {
  const {
    task: { taskList },
  } = props;
  const listId = taskList?.taskListIdentifier;
  const [listMembers, setListMembers] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);
    TaskListApi.getMembersByTaskListId(listId, 'ALL')
      .then(data => {
        setListMembers(data);
        setIsFetching(false);
      })
      .catch(error => {
        setIsFetching(false);
        throw error;
      });
  }, [listId]);

  return (
    <Component
      {...props}
      members={listMembers}
      isFetchingMembers={isFetching}
    />
  );
};

export default MembersForList;

import React from 'react';
import { useSelector } from 'react-redux';
import {
  workflowDrawerTasksSelector,
  isFetchingWorkflowDetailsSelector,
} from 'selectors/workflow-drawer-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import DrawerSection from 'components/drawer-common/DrawerSection/DrawerSection';
import DrawerTaskLoader from 'components/drawer-common/DrawerTaskLoader/DrawerTaskLoader';
import DrawerTask from 'components/drawer-common/DrawerTask/DrawerTask';

const TasksSection = () => {
  const tasks = useSelector(workflowDrawerTasksSelector);
  const isFetching = useSelector(isFetchingWorkflowDetailsSelector);
  const currentUser = useSelector(userProfileSelector);

  return (
    <DrawerSection title="Tasks">
      {!tasks && isFetching ? (
        <>
          <DrawerTaskLoader />
          <DrawerTaskLoader />
          <DrawerTaskLoader />
        </>
      ) : (
        <>
          {tasks?.map(t => (
            <DrawerTask key={t.identifier} task={t} currentUser={currentUser} />
          ))}
        </>
      )}
    </DrawerSection>
  );
};

export default TasksSection;

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { userProfileSelector } from 'selectors/user-selectors';
import { updateTasksLink } from 'actions/task-actions';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import DrawerTask from 'components/drawer-common/DrawerTask/DrawerTask';
import DrawerTaskLoader from 'components/drawer-common/DrawerTaskLoader/DrawerTaskLoader';
import { Container, Title, TaskContainer, DeleteButton } from './styled';
import DependenciesAutocomplete from '../DependenciesAutocomplete/DependenciesAutocomplete';

const DependenciesSection = () => {
  const selectedTask = useSelector(selectedTaskSelector) || {};
  const { taskDependencies, dependencyTasksCount } = selectedTask;
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);

  const removeHardDependency = dependencyIdentifier => {
    dispatch(
      updateTasksLink({
        sourceTaskIdentifier: dependencyIdentifier,
        targetTaskIdentifier: selectedTask.identifier,
        isDependent: false,
      }),
    );
  };

  return (
    <Container>
      <Title>Dependencies</Title>
      {dependencyTasksCount > 0 &&
      (!taskDependencies || taskDependencies.length === 0) ? (
        <DrawerTaskLoader rows={dependencyTasksCount || 4} />
      ) : (
        <>
          {taskDependencies?.map(task => (
            <TaskContainer key={task.taskIdentifier}>
              <DeleteButton
                type="button"
                onClick={() => removeHardDependency(task.identifier)}
              >
                <CloseIcon />
              </DeleteButton>
              <DrawerTask task={task} currentUser={currentUser} />
            </TaskContainer>
          ))}
        </>
      )}
      <DependenciesAutocomplete taskIdentifier={selectedTask.identifier} />
    </Container>
  );
};

export default DependenciesSection;

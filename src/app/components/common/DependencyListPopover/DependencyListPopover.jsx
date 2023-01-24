/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState, useCallback } from 'react';
import { Popper } from '@material-ui/core';
import { bool, instanceOf, string, number, shape } from 'prop-types';
import { getTaskDependencies } from 'api/task-api';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import dependencyIcon from 'img/dependency-icon.svg';
import { useDispatch } from 'react-redux';
import { openTaskDrawerWithContent } from 'actions/task-drawer-actions';
import { trunc } from 'helpers/utility-functions';
import {
  DependencyListContainer,
  Header,
  ListWrapper,
  DependencyIconWrapper,
  ListElement,
  DependencyDescription,
} from './styled';

const DependencyListPopover = ({
  anchorEl,
  open,
  task,
  dependencyTasksCount,
}) => {
  const { taskIdentifier } = task;
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const getDependenciesList = () => {
    if (open) {
      setLoading(true);
      getTaskDependencies(taskIdentifier)
        .then(data => {
          setList(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  useEffect(getDependenciesList, [taskIdentifier, open]);

  const onClickTaskItem = useCallback(
    (dependencyTask, event) => {
      event.stopPropagation();
      dispatch(openTaskDrawerWithContent(dependencyTask));
    },
    [dispatch],
  );

  return (
    <Popper
      anchorEl={anchorEl}
      placement="bottom-start"
      open={open}
      style={{ zIndex: 100000 }}
      taskIdentifier={taskIdentifier}
    >
      <DependencyListContainer>
        <Header>Waiting on these tasks to be completed</Header>
        <ListWrapper>
          {!loading ? (
            <>
              {list
                .filter(t => t.status === 'INCOMPLETE')
                .map(dependencyTask => (
                  <ListElement key={dependencyTask.taskIdentifier}>
                    <DependencyIconWrapper>
                      <img src={dependencyIcon} alt="dependency icon" />
                    </DependencyIconWrapper>
                    <DependencyDescription
                      onClick={event => onClickTaskItem(dependencyTask, event)}
                    >
                      {trunc(dependencyTask.description, 35)}
                    </DependencyDescription>
                  </ListElement>
                ))}
            </>
          ) : (
            <TasksSkeletonLoader rows={dependencyTasksCount} />
          )}
        </ListWrapper>
      </DependencyListContainer>
    </Popper>
  );
};

DependencyListPopover.propTypes = {
  anchorEl: instanceOf(Element).isRequired,
  open: bool.isRequired,
  task: shape({
    taskIdentifier: string,
  }).isRequired,
  dependencyTasksCount: number,
};

DependencyListPopover.defaultProps = {
  dependencyTasksCount: 2,
};

export default DependencyListPopover;

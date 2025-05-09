import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import Spacing from 'components/common/Spacing';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { openModal } from 'modal/actions';
import { getTaskListForUser } from 'api/task-list-api';
import ModalNote from '@/app/modal/components/ModalNote/ModalNote';

const EmptyListContainer = styled.div`
  margin: ${spacing.huge} 0;
  text-align: center;
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
`;

const BulkEditCreateTask = ({
  context: Context,
  createTaskAction,
  iconColorActive
}) => {
  const dispatch = useDispatch();

  const contextValue = useContext(Context);
  const { selectableUsers, unselectAllUser, selectedOptionsHandler } = contextValue;
  const { turnOffAllOptions } = selectedOptionsHandler;

  const quickAddTask = useCallback(
    ({ description }) => {
      const assignedEntities = selectableUsers?.filter(item => item.isSelected).map(item => item.identifier);

      dispatch(
        openModal('SelectDestination', {
          fetchMethod: getTaskListForUser,
          confirm: ({ taskListIdentifier, taskGroupIdentifier }) =>
            dispatch(
              createTaskAction({
                description,
                taskListIdentifier,
                taskGroupIdentifier,
                assignedTo: assignedEntities,
              }),
            ),
          renderDescription: () => (
            <ModalNote>
              Task will only be assigned to users who are part of the selected list.
            </ModalNote>
          )
        })
      );

      unselectAllUser();
      turnOffAllOptions();
    },
    [dispatch, selectableUsers, createTaskAction]
  );

  return (
    <EmptyListContainer>
      <QuickAddTaskInput
        quickAddTask={quickAddTask}
        validator={(value) => {
          if ([...value]?.filter((char) => char !== ' ').length < 2)
            return 'The task description is too short (min. 2 characters)';
          return null;
        }}
        iconColorActive={iconColorActive}
      />
      <Spacing vertical={5} />
    </EmptyListContainer>
  );
};

export default BulkEditCreateTask;
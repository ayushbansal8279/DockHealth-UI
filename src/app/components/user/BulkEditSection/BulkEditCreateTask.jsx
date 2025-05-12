import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import Spacing from 'components/common/Spacing';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { openModal } from 'modal/actions';
import { getTaskListForUser } from 'api/task-list-api';
import ModalMessage from '@/app/modal/components/ModalMessage/ModalMessage';

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
            <ModalMessage type="warning">
              This action will fail if any selected user is not part of the selected list. 
              Please ensure all selected users are in the list.
            </ModalMessage>
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
import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';

import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import Spacing from 'components/common/Spacing';
import { openModal } from 'modal/actions';
import { getTaskListForUser } from 'api/task-list-api';
import { addTask } from 'actions/task-actions';

import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import { PatientEditContext } from '../../PatientsView';

const EmptyListContainer = styled.div`
  margin: ${spacing.huge} 0;
  text-align: center;
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
`;

const BulkEditCreateTask = () => {
  const patientContext = useContext(PatientEditContext);
  const dispatch = useDispatch();

  const { selectedPatients } = patientContext;

  const quickAddTask = useCallback(
    ({ description }) => {
      const assignedPatients = selectedPatients?.map(patient => {
        return { identifier: patient.patientIdentifier };
      });

      dispatch(
        openModal('ListPicker', {
          fetchMethod: getTaskListForUser,
          confirm: listId =>
            dispatch(
              addTask({
                description,
                taskListIdentifier: listId,
                assignedToUsers: assignedPatients,
              }),
            ),
        }),
      );
    },
    [dispatch, selectedPatients],
  );

  return (
    <EmptyListContainer>
      <QuickAddTaskInput
        quickAddTask={quickAddTask}
        validator={value => {
          if ([...value]?.filter(char => char !== ' ').length < 2)
            return 'The task description is too short (min. 2 characters)';
          return null;
        }}
      />
      <Spacing vertical={5} />
    </EmptyListContainer>
  );
};

export default BulkEditCreateTask;

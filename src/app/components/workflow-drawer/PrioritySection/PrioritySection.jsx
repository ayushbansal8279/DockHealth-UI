/* eslint-disable unicorn/consistent-function-scoping */
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'components/common/Select/Select';
import PriorityFlag from 'img/priority-flag';
import { getPriorityColor, TaskPriority } from 'helpers/task-helpers';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { PriorityFieldContainer, PriorityFlagContainer } from './styled';
import { PRIORITY_OPTIONS } from './helpers';

const PrioritySection = ({ disabled }) => {
  const dispatch = useDispatch();
  const selectedWorkflow = useSelector(workflowSelector);
  const { priority } = selectedWorkflow || {};
  const inputReference = useRef(null);
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);

  useEffect(() => {
    if (
      inputReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.PRIORITY
    ) {
      inputReference.current.scrollIntoView(true);
      inputReference.current.focus();
    }
  }, [autoFocusFieldName]);

  const handleOptionChange = (event) => {
    const { value } = event.target;
    dispatch(
      updatePartialWorkflow(selectedWorkflow?.identifier, {
        priority: value,
      }),
    );
  };

  return (
    <PriorityFieldContainer>
      <PriorityFlagContainer>
        <PriorityFlag color={getPriorityColor(priority)} />
      </PriorityFlagContainer>
      <Select
        inputRef={inputReference}
        label="Priority"
        name="priority"
        value={priority || TaskPriority.NONE}
        onChange={handleOptionChange}
        options={PRIORITY_OPTIONS}
        disabled={disabled}
      />
    </PriorityFieldContainer>
  );
};

export default PrioritySection;

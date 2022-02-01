import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Input from 'components/common/Input/Input';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import {
  DescriptionTextContainer,
  DescriptionError,
  DescriptionLabelContainer,
  DescriptionLabel,
} from './styled';

const NameSection = () => {
  const selectedWorkflow = useSelector(workflowSelector);
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);
  const { name = '' } = selectedWorkflow || {};
  const dispatch = useDispatch();
  const descriptionInputReference = useRef(null);
  const [value, setValue] = useState(name);
  const [descriptionErrorState, setDescriptionErrorState] = useState(false);

  useEffect(() => {
    if (
      descriptionInputReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.NAME
    ) {
      descriptionInputReference.current.scrollIntoView(true);
      descriptionInputReference.current.focus();
    }
  }, [autoFocusFieldName]);

  const handleBlur = useCallback(() => {
    if (selectedWorkflow?.identifier) {
      if (value.trim().length === 0) {
        setDescriptionErrorState(true);
      } else if (value.trim() !== name) {
        dispatch(
          updatePartialWorkflow(selectedWorkflow?.identifier, {
            name: value,
          }),
        );
      }
    }
  }, [dispatch, name, selectedWorkflow, value]);

  const handleChange = useCallback(
    event => {
      const text = event.target.value;
      setValue(text);
      if (descriptionErrorState) setDescriptionErrorState(false);
    },
    [descriptionErrorState],
  );

  return (
    <Grid item xs={12}>
      <div>
        <DescriptionTextContainer>
          <DescriptionLabelContainer>
            <DescriptionLabel>Workflow name</DescriptionLabel>
          </DescriptionLabelContainer>
          <Input
            fullWidth
            inputRef={descriptionInputReference}
            onChange={handleChange}
            value={value}
            name="workflowName"
            onBlur={handleBlur}
          />
        </DescriptionTextContainer>
        {descriptionErrorState && (
          <DescriptionError>Workflow description is required</DescriptionError>
        )}
      </div>
    </Grid>
  );
};

export default NameSection;

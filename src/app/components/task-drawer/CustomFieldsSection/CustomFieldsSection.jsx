/* eslint-disable no-unused-expressions */
import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import { getTaskCustomFields } from 'actions/task-drawer-actions';
import CustomField from 'components/common/CustomField/CustomField';
import { useBoolean } from 'hooks/useBoolean';
import { useFormContext } from 'react-hook-form';
import { compose } from 'ramda';
import CategoryOptions from 'components/common/CategoryOptions/CategoryOptions';
import { partialUpdateTask } from 'actions/task-actions';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import {
  CustomFieldsSectionContainer,
  HidableContainer,
  Title,
  styleFullRow,
} from './styled';
import { formatMetaDataOutput } from './helpers';

const CustomFieldsSection = ({
  task,
  taskCustomFields: { templates },
  taskDrawerFocusField,
  taskCustomReference,
}) => {
  const dispatch = useDispatch();
  const { 0: emptyVisible, 3: toggleEmptyVisible } = useBoolean(false);
  useEffect(() => {
    if (task) {
      const { identifier, taskList } = task;
      const taskListIdentifier = taskList?.taskListIdentifier;
      dispatch(getTaskCustomFields(identifier, taskListIdentifier));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, task?.identifier]);

  const onBlur = useCallback(
    newTask => {
      dispatch(partialUpdateTask(task?.identifier, newTask));
      dispatch(showGlobalAlert(AlertMessages.UPDATED));
    },
    [dispatch, task],
  );

  const { handleSubmit, setValue, getValues } = useFormContext();

  useEffect(() => {
    if (task?.taskMetaData) {
      templates?.forEach(template => {
        const cf = task?.taskMetaData?.find(
          ({ customFieldIdentifier }) =>
            customFieldIdentifier === template.identifier,
        );
        const fieldName = `taskMetaData.${template.identifier}`;
        if (cf?.value) {
          setValue(fieldName, cf.value);
        } else {
          setValue(fieldName, null);
        }
      });
    }
  }, [setValue, task, templates]);

  const renderCustomField = useCallback(
    field => {
      const isFocused = taskDrawerFocusField === field.identifier;
      const hasValue = !!getValues()[`taskMetaData.${field.identifier}`];
      const visible = isFocused || emptyVisible || hasValue;
      return (
        <HidableContainer key={field.identifier} visibility={!visible}>
          <Grid item xs={12} style={styleFullRow}>
            <CustomField
              scrollToRef={taskCustomReference}
              readOnly={false}
              field={field}
              onBlur={handleSubmit(compose(onBlur, formatMetaDataOutput))}
              fieldsGroupKey="taskMetaData"
              isFocused={isFocused}
            />
          </Grid>
        </HidableContainer>
      );
    },
    [
      emptyVisible,
      getValues,
      handleSubmit,
      onBlur,
      taskCustomReference,
      taskDrawerFocusField,
    ],
  );
  if (templates.length === 0) return null;
  return (
    <CustomFieldsSectionContainer>
      <>
        <Title>Custom fields</Title>
        {templates?.map((field, index) => {
          return renderCustomField(field, index);
        })}
        <CategoryOptions
          visibility={emptyVisible}
          onToggle={toggleEmptyVisible}
        />
      </>
    </CustomFieldsSectionContainer>
  );
};

export default CustomFieldsSection;

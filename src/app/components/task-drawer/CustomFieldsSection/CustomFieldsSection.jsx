/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { getTaskCustomFields } from 'actions/task-drawer-actions';
import CustomField from 'components/common/CustomField/CustomField';
import { useBoolean } from 'hooks/useBoolean';
import { useForm, FormProvider } from 'react-hook-form';
import { compose } from 'ramda';
import CategoryOptions from 'components/common/CategoryOptions/CategoryOptions';
import { partialUpdateTask } from 'actions/task-actions';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { TaskItemType } from 'helpers/task-helpers';
import {
  selectedTaskSelector,
  taskCustomFieldsSelector,
  taskDrawerFocusFieldSelector,
} from 'selectors/task-drawer-selectors';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import { FieldType } from 'helpers/field-type-helpers';
import { formatMetaDataOutput } from './helpers';
import {
  CustomFieldsSectionContainer,
  HidableContainer,
  Title,
  styleFullRow,
} from './styled';

const CustomFieldsSection = () => {
  const dispatch = useDispatch();
  const selectedTask = useSelector(selectedTaskSelector);
  const selectedWorkflow = useSelector(workflowSelector);
  const task = selectedTask || selectedWorkflow || {};
  const isWorkflow =
    task.itemType === TaskItemType.BUNDLE ||
    task.itemType === TaskItemType.TEMPLATE;
  const taskDrawerFocusField = useSelector(
    isWorkflow ? workflowAutofocusFieldSelector : taskDrawerFocusFieldSelector,
  );
  const { templates } = useSelector(taskCustomFieldsSelector);
  const { 0: emptyVisible, 3: toggleEmptyVisible } = useBoolean(false);
  useEffect(() => {
    if (task) {
      const { identifier, taskList } = task;
      const taskListIdentifier = taskList?.taskListIdentifier;
      dispatch(getTaskCustomFields(identifier, taskListIdentifier));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, task?.identifier]);

  const updateCustomFields = useCallback(
    ({ taskMetaData }) => {
      if (taskMetaData.length > 0) {
        isWorkflow
          ? dispatch(updatePartialWorkflow(task?.identifier, { taskMetaData }))
          : dispatch(partialUpdateTask(task?.identifier, { taskMetaData }));
      }
    },
    [dispatch, isWorkflow, task],
  );

  const formMethods = useForm();
  const { handleSubmit, setValue, getValues } = formMethods;

  useEffect(() => {
    if (task?.taskMetaData) {
      templates?.forEach(template => {
        const cf = task?.taskMetaData?.find(
          field => field?.customFieldIdentifier === template.identifier,
        );
        const fieldName = `taskMetaData.${template.identifier}`;
        if (cf?.value) {
          setValue(fieldName, cf.value);
        } else if (cf?.values) {
          setValue(fieldName, cf.values);
        } else {
          setValue(fieldName, null);
        }
      });
    }
  }, [setValue, task, templates]);

  const handleBlur = useCallback(
    (data, wasChanged = false, fieldType) => {
      if (wasChanged) {
        if (fieldType === FieldType.DATE) {
          const hasMissingParts = data.target?.value?.includes('_');
          if (hasMissingParts) return;
        }
        handleSubmit(compose(updateCustomFields, formatMetaDataOutput))(data);
      }
    },
    [handleSubmit, updateCustomFields],
  );

  const renderCustomField = useCallback(
    field => {
      const isFocused = taskDrawerFocusField === field.identifier;
      const hasValue = !!getValues('taskMetaData')?.[field.identifier];
      const visible = isFocused || emptyVisible || hasValue;
      return (
        <HidableContainer key={field.identifier} visible={!visible}>
          <Grid item xs={12} style={styleFullRow}>
            <CustomField
              readOnly={false}
              field={field}
              onBlur={(data, wasChanged) =>
                handleBlur(data, wasChanged, field.fieldType)
              }
              fieldsGroupKey="taskMetaData"
              isFocused={isFocused}
              taskIdentifier={task.identifier}
              task={task}
            />
          </Grid>
        </HidableContainer>
      );
    },
    [taskDrawerFocusField, getValues, emptyVisible, task, handleBlur],
  );
  if (templates.length === 0) return null;
  return (
    <FormProvider {...formMethods}>
      <CustomFieldsSectionContainer>
        <Title>Custom fields</Title>
        {templates?.map((field, index) => {
          return renderCustomField(field, index);
        })}
        <CategoryOptions
          visibility={emptyVisible}
          onToggle={toggleEmptyVisible}
        />
      </CustomFieldsSectionContainer>
    </FormProvider>
  );
};

export default CustomFieldsSection;

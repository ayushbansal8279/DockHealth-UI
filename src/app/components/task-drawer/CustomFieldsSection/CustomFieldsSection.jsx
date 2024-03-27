/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, useMediaQuery } from '@mui/material';
import CustomField from 'components/common/CustomField/CustomField';
import { useBoolean } from 'hooks/useBoolean';
import { useForm, FormProvider } from 'react-hook-form';
import compose from 'ramda/src/compose';
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
import { organizationCustomFieldsSelector } from 'selectors/organization-selectors';
import { listCustomFieldsSelector } from 'selectors/list-details-selectors';
import { FieldType } from 'helpers/field-type-helpers';
// import { log } from 'helpers/log';
import { formatMetaDataOutput } from './helpers';
import {
  CustomFieldsSectionContainer,
  CustomFieldsSectionContainerNoLine,
  HidableContainer,
  Title,
  styleFullRow,
} from './styled';

const CustomFieldsSection = ({ disabled, fieldCategoryType }) => {
  const dispatch = useDispatch();
  const selectedTask = useSelector(selectedTaskSelector);
  const selectedWorkflow = useSelector(workflowSelector);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const task = selectedTask || selectedWorkflow || {};
  const isWorkflow =
    task.itemType === TaskItemType.BUNDLE ||
    task.itemType === TaskItemType.TEMPLATE;
  const taskDrawerFocusField = useSelector(
    isWorkflow ? workflowAutofocusFieldSelector : taskDrawerFocusFieldSelector,
  );

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const organizationCustomFields = useSelector(
    organizationCustomFieldsSelector,
  );
  const listCustomFields = useSelector(listCustomFieldsSelector);
  const workflowCustomFields = organizationCustomFields
    ? organizationCustomFields.concat(listCustomFields)
    : listCustomFields;

  const { templates: taskCustomFields } = useSelector(taskCustomFieldsSelector);
  const unfilteredCustomFields = taskCustomFields?.length
    ? taskCustomFields
    : workflowCustomFields;

  const customFields = useMemo(() => {
    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const filtered = unfilteredCustomFields.filter((unfilteredCustomField) => {
      if (fieldCategoryType)
        return unfilteredCustomField?.fieldCategoryType === fieldCategoryType;
      return true;
    });

    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const filteredAndSorted = (
      filtered.filter((cf) => cf.taskListIdentifier === undefined) || []
    ).concat(
      filtered.filter((cf) => cf.taskListIdentifier !== undefined) || [],
    );

    return filteredAndSorted;
  }, [fieldCategoryType, unfilteredCustomFields]);

  const { 0: emptyVisible, 3: toggleEmptyVisible } = useBoolean(false);

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
    if (task?.taskMetaData && customFields) {
      for (const customField of customFields) {
        const cf = task?.taskMetaData?.find(
          (field) => field?.customFieldIdentifier === customField.identifier,
        );
        const fieldName = `taskMetaData.${customField.identifier}`;
        const hasValue = !!getValues('taskMetaData')?.[customField.identifier];
        if (customField.fieldType !== 'PICK_LIST' || !hasValue) {
          if (cf?.value) {
            setValue(fieldName, cf.value);
          } else if (cf?.values) {
            setValue(fieldName, cf.values);
          } else {
            setValue(fieldName, null);
          }
        }
      }
    }
  }, [getValues, setValue, task, customFields]);

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
    (field, index, alwaysVisible) => {
      const isFocused = taskDrawerFocusField === field.identifier;
      const hasValue = !!getValues('taskMetaData')?.[field.identifier];
      const isRequired = field.displayOptions.includes('TASK_REQUIRED');
      const visible =
        alwaysVisible || isFocused || emptyVisible || hasValue || isRequired;
      return (
        <HidableContainer key={field.identifier} visible={!visible}>
          <Grid item xs={12} style={styleFullRow(isMobile, alwaysVisible)}>
            <CustomField
              readOnly={disabled}
              field={field}
              selected={getValues('taskMetaData')}
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
    [
      taskDrawerFocusField,
      getValues,
      emptyVisible,
      isMobile,
      disabled,
      task,
      handleBlur,
    ],
  );

  if (customFields.length === 0) return null;
  return (
    <FormProvider {...formMethods}>
      {fieldCategoryType === 'TASK_CORE' ? (
        <CustomFieldsSectionContainerNoLine>
          <CategoryOptions
            coreTask
            visibility={emptyVisible}
            onToggle={toggleEmptyVisible}
          />
          {customFields?.map((field, index) => {
            return renderCustomField(field, index, false);
          })}
        </CustomFieldsSectionContainerNoLine>
      ) : (
        <CustomFieldsSectionContainer>
          <Title>Custom fields</Title>
          <CategoryOptions
            visibility={emptyVisible}
            onToggle={toggleEmptyVisible}
          />
          {customFields?.map((field, index) => {
            return renderCustomField(field, index, false);
          })}
        </CustomFieldsSectionContainer>
      )}
    </FormProvider>
  );
};

export default CustomFieldsSection;

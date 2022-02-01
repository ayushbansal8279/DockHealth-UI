/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { getTaskCustomFields } from 'actions/task-drawer-actions';
import CustomField from 'components/common/CustomField/CustomField';
import { useBoolean } from 'hooks/useBoolean';
import { useForm, FormContext } from 'react-hook-form';
import { compose } from 'ramda';
import CategoryOptions from 'components/common/CategoryOptions/CategoryOptions';
import { partialUpdateTask } from 'actions/task-actions';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import {
  selectedTaskSelector,
  taskCustomFieldsSelector,
  taskDrawerFocusFieldSelector,
} from 'selectors/task-drawer-selectors';
import { FieldType } from 'helpers/field-type-helpers';
import {
  CustomFieldsSectionContainer,
  HidableContainer,
  Title,
  styleFullRow,
} from './styled';
import { formatMetaDataOutput } from './helpers';

const CustomFieldsSection = () => {
  const dispatch = useDispatch();
  const task = useSelector(selectedTaskSelector) || {};
  const taskDrawerFocusField = useSelector(taskDrawerFocusFieldSelector);
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
        dispatch(partialUpdateTask(task?.identifier, { taskMetaData }));
        dispatch(showGlobalAlert(AlertMessages.UPDATED));
      }
    },
    [dispatch, task],
  );

  const formMethods = useForm();
  const { handleSubmit, setValue, getValues } = formMethods;

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
      const hasValue = !!getValues()[`taskMetaData.${field.identifier}`];
      const visible = isFocused || emptyVisible || hasValue;
      return (
        <FormContext {...formMethods}>
          <HidableContainer key={field.identifier} visibility={!visible}>
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
              />
            </Grid>
          </HidableContainer>
        </FormContext>
      );
    },
    [
      taskDrawerFocusField,
      getValues,
      emptyVisible,
      formMethods,
      task.identifier,
      handleBlur,
    ],
  );
  if (templates.length === 0) return null;
  return (
    <FormContext {...formMethods}>
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
    </FormContext>
  );
};

export default CustomFieldsSection;

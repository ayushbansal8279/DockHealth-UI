import React, { useCallback } from 'react';
import { FieldType } from 'helpers/field-type-helpers';
import TaskItemBoolean from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemBoolean/TaskItemBoolean';
import TaskItemDate from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDate';
import TaskItemDropdown from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDropdown/TaskItemDropdown';
import TaskItemText from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemText/TaskItemText';
import TaskItemLongText from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemLongText/TaskItemLongText';
import TaskItemNumber from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemNumber/TaskItemNumber';

import { updatePartialWorkflow } from 'actions/task-template-actions';
import { partialUpdateTask, storeAsCurrentTask } from 'actions/task-actions';
import { TaskItemType } from 'helpers/task-helpers';
import { openDrawer } from 'actions/task-drawer-actions';
import { useDispatch } from 'react-redux';
import { updatePatientDetails } from 'actions/patient-details-actions';
import TaskItemMultiDropdown from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemMultiDropdown/TaskItemMultiDropdown';
import {
  createMetaDataObjectToSend,
  CUSTOM_FIELD_TYPES,
} from 'helpers/custom-fields-helpers';
import { StyledHyperLink } from 'components/auth/AuthComponents.styled';
import { trunc } from 'helpers/utility-functions';

const TaskItemCustomField = ({
  readOnly,
  field,
  customFieldValue,
  task,
  onClick,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { value, values } = customFieldValue || {};
  const patientType = field.targetType === CUSTOM_FIELD_TYPES.PATIENT;
  const isWorkflow =
    task.itemType === TaskItemType.BUNDLE ||
    task.itemType === TaskItemType.TEMPLATE;

  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    if (!patientType) {
      if (typeof onClick === 'function') {
        onClick(field.identifier, task);
      } else {
        dispatch(openDrawer(field.identifier));
        dispatch(storeAsCurrentTask(task));
      }
    }
  }, [dispatch, field.identifier, onClick, patientType, task]);

  const handleChange = async newValue => {
    if (patientType) {
      if (task?.patient) {
        const patientMetaData = (task?.patient?.patientMetaData || [])
          ?.filter(tmd => tmd.customFieldIdentifier !== field.identifier)
          ?.map(tmd => createMetaDataObjectToSend(tmd));
        if (Array.isArray(newValue)) {
          patientMetaData.push({
            customFieldIdentifier: field.identifier,
            values: newValue,
          });
        } else {
          patientMetaData.push({
            customFieldIdentifier: field.identifier,
            value: newValue,
          });
        }
        const patientIdentifier = task?.patient?.patientIdentifier;
        dispatch(updatePatientDetails(patientIdentifier, { patientMetaData }));
      }
    } else {
      const taskMetaData =
        task.taskMetaData
          ?.filter(tmd => tmd.customFieldIdentifier !== field.identifier)
          ?.map(tmd => createMetaDataObjectToSend(tmd)) ?? [];
      if (Array.isArray(newValue)) {
        taskMetaData.push({
          customFieldIdentifier: field.identifier,
          values: newValue,
        });
      } else {
        taskMetaData.push({
          customFieldIdentifier: field.identifier,
          value: newValue,
        });
      }

      if (isWorkflow) {
        dispatch(updatePartialWorkflow(task?.identifier, { taskMetaData }));
      } else {
        dispatch(partialUpdateTask(task?.identifier, { taskMetaData }));
      }
    }
  };
  switch (field.fieldType) {
    case FieldType.BOOL:
      return (
        <TaskItemBoolean
          readOnly={readOnly}
          value={value}
          onChange={handleChange}
          field={field}
        />
      );
    case FieldType.DATE:
      return (
        <TaskItemDate
          value={value}
          onChange={handleChange}
          field={field}
          readOnly={readOnly}
        />
      );
    case FieldType.DROPDOWN_MULTI: {
      return (
        <TaskItemMultiDropdown
          readOnly={readOnly}
          value={values || []}
          onChange={handleChange}
          field={field}
        />
      );
    }
    case FieldType.DROPDOWN: {
      return (
        <TaskItemDropdown
          readOnly={readOnly}
          value={value}
          onChange={handleChange}
          field={field}
        />
      );
    }
    case FieldType.TEXT:
      return (
        <TaskItemText
          readOnly={readOnly}
          value={value}
          onChange={handleChange}
          field={field}
        />
      );
    case FieldType.LONG_TEXT:
      return (
        <TaskItemLongText
          readOnly={readOnly}
          value={value}
          onChange={handleChange}
          openDrawer={!patientType ? handleClick : undefined}
          field={field}
        />
      );
    case FieldType.NUMBER:
      return (
        <TaskItemNumber
          readOnly={readOnly}
          value={value}
          onChange={handleChange}
          field={field}
        />
      );
    case FieldType.HYPERLINK:
      return (
        <StyledHyperLink
          href={value?.startsWith('http') ? value : `//${value}`}
          target="_blank"
        >
          {trunc(value, 15)}
        </StyledHyperLink>
      );
    default:
      return <div>{field.name}</div>;
  }
};

export default TaskItemCustomField;

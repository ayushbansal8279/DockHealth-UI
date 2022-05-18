import React, { useCallback } from 'react';
import { Box } from '@material-ui/core';
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
import { pick } from 'ramda';
import { updatePatientDetails } from 'actions/patient-details-actions';

const TaskItemCustomField = ({
  readOnly,
  field,
  customFieldValue,
  task,
  onClick,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { value } = customFieldValue || {};
  const patientType = field.targetType === 'PATIENT';
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
          ?.map(pick(['customFieldIdentifier', 'value']));
        patientMetaData.push({
          customFieldIdentifier: field.identifier,
          value: newValue,
        });
        const patientIdentifier = task?.patient?.patientIdentifier;
        dispatch(updatePatientDetails(patientIdentifier, { patientMetaData }));
      }
    } else {
      const taskMetaData = task.taskMetaData
        ?.filter(tmd => tmd.customFieldIdentifier !== field.identifier)
        ?.map(pick(['customFieldIdentifier', 'value']));
      taskMetaData.push({
        customFieldIdentifier: field.identifier,
        value: newValue,
      });
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
        <TaskItemDate value={value} onChange={handleChange} field={field} />
      );
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
        <Box
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          onClick={handleClick}
        >
          <TaskItemLongText
            readOnly={readOnly}
            value={value}
            onChange={handleChange}
            field={field}
          />
        </Box>
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
    default:
      return <div>{field.name}</div>;
  }
};

export default TaskItemCustomField;

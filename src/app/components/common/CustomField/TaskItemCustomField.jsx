import React, { useCallback } from 'react';
import { Box } from '@material-ui/core';
import { FieldType } from 'helpers/field-type-helpers';
import TaskItemBoolean from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemBoolean/TaskItemBoolean';
import TaskItemDate from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDate';
import TaskItemDropdown from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDropdown/TaskItemDropdown';
import TaskItemText from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemText/TaskItemText';
import TaskItemLongText from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemLongText/TaskItemLongText';
import TaskItemNumber from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemNumber/TaskItemNumber';
import { updatePartialWorkflow } from 'api/task-template-api';
import { partialUpdateTask, storeAsCurrentTask } from 'actions/task-actions';
import { TaskItemType } from 'helpers/task-helpers';
import { openDrawer } from 'actions/task-drawer-actions';
import { useDispatch } from 'react-redux';
import { pick } from 'ramda';

const TaskItemCustomField = ({
  readOnly,
  field,
  customFieldValue,
  task,
  isHovered,
}) => {
  const { value } = customFieldValue || {};

  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(openDrawer(field.identifier));
    dispatch(storeAsCurrentTask(task));
  }, [dispatch, field.identifier, task]);
  const handleChange = newValue => {
    const taskMetaData = (task.taskMetaData || task.displayOptions)
      ?.filter(tmd => tmd.customFieldIdentifier !== field.identifier)
      ?.map(pick(['customFieldIdentifier', 'value']));
    taskMetaData.push({
      customFieldIdentifier: field.identifier,
      value: newValue,
    });
    // eslint-disable-next-line no-unused-expressions
    task.itemType === TaskItemType.BUNDLE
      ? dispatch(updatePartialWorkflow(task?.identifier, { taskMetaData }))
      : dispatch(partialUpdateTask(task?.identifier, { taskMetaData }));
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
          isHovered={isHovered}
        />
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
          isHovered={isHovered}
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

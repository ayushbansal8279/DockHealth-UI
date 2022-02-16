import React, { useCallback } from 'react';
import { Box } from '@material-ui/core';
import { FieldType } from 'helpers/field-type-helpers';
import TaskItemBoolean from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemBoolean';
import TaskItemDate from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDate';
import TaskItemDropdown from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDropdown';
import TaskItemText from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemText';
import TaskItemLongText from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemLongText';
import TaskItemNumber from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemNumber';
import { useDispatch } from 'react-redux';
import { openDrawer } from 'actions/task-drawer-actions';
import { storeAsCurrentTask } from 'actions/task-actions';

const TaskItemCustomField = ({
  readOnly,
  field,
  customFieldValue,
  onChange,
  task,
}) => {
  const { value } = customFieldValue || {};
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(openDrawer(field.identifier));
    dispatch(storeAsCurrentTask(task));
  }, [dispatch, field.identifier, task]);

  const renderField = () => {
    switch (field.fieldType) {
      case FieldType.BOOL:
        return (
          <TaskItemBoolean
            readOnly={readOnly}
            value={value}
            onChange={onChange}
            field={field}
          />
        );
      case FieldType.DATE:
        return (
          <TaskItemDate
            readOnly={readOnly}
            value={value}
            onChange={onChange}
            field={field}
          />
        );
      case FieldType.DROPDOWN: {
        return (
          <TaskItemDropdown
            readOnly={readOnly}
            value={value}
            onChange={onChange}
            field={field}
          />
        );
      }
      case FieldType.TEXT:
        return (
          <TaskItemText
            readOnly={readOnly}
            value={value}
            onChange={onChange}
            field={field}
          />
        );
      case FieldType.LONG_TEXT:
        return (
          <TaskItemLongText
            readOnly={readOnly}
            value={value}
            onChange={onChange}
            field={field}
          />
        );
      case FieldType.NUMBER:
        return (
          <TaskItemNumber
            readOnly={readOnly}
            value={value}
            onChange={onChange}
            field={field}
          />
        );
      default:
        return <div>{field.name}</div>;
    }
  };

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      overflow="hidden"
      onClick={handleClick}
    >
      {renderField()}
    </Box>
  );
};

export default TaskItemCustomField;

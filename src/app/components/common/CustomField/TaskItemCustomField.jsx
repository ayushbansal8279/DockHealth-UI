import React from 'react';
import { FieldType } from 'helpers/field-type-helpers';
import TaskItemBoolean from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemBoolean';
import TaskItemDate from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDate';
import TaskItemDropdown from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDropdown';
import TaskItemText from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemText';
import TaskItemLongText from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemLongText';
import TaskItemNumber from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemNumber';

const TaskItemCustomField = ({
  readOnly,
  field,
  customFieldValue,
  onChange,
}) => {
  const { value } = customFieldValue || {};

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

export default TaskItemCustomField;

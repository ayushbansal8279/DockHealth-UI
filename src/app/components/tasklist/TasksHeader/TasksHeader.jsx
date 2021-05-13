import React, { useMemo } from 'react';
import Checkbox from 'components/common/Checkbox/Checkbox';
import ColumnSortHeader from 'components/tasklist/ColumnSortHeader/ColumnSortHeader';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
import {
  TaskItemColumn,
  TASK_ITEM_BASE_COLUMN_CONFIG,
} from 'helpers/task-helpers';
import { BulkContainer } from './styled';

const TasksHeader = ({
  bulkEditEnabled,
  sort,
  onSortChange,
  isGroupSelected,
  onGroupSelect,
  groupHasMultipleAssignees,
  taskItemConfig = {},
}) => {
  const mergedConfig = useMemo(
    () => ({
      ...TASK_ITEM_BASE_COLUMN_CONFIG,
      ...taskItemConfig,
    }),
    [taskItemConfig],
  );

  return (
    <SortHeaderRow>
      {bulkEditEnabled && (
        <BulkContainer>
          <Checkbox isChecked={isGroupSelected} onClick={onGroupSelect} />
        </BulkContainer>
      )}
      <ColumnSortHeader width={35} />
      {mergedConfig[TaskItemColumn.DESCRIPTION] && (
        <ColumnSortHeader
          id={TaskItemColumn.DESCRIPTION}
          label="Tasks"
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskItemColumn.SUBTASKS_COUNT] && (
        <ColumnSortHeader
          id={TaskItemColumn.SUBTASKS_COUNT}
          label="Sub"
          width={60}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskItemColumn.PATIENT] && (
        <ColumnSortHeader
          id={TaskItemColumn.PATIENT}
          label="Patient"
          width={164}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskItemColumn.WORKFLOW_STATUS] && (
        <ColumnSortHeader
          id={TaskItemColumn.WORKFLOW_STATUS}
          label="Status"
          width={120}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskItemColumn.ACTIVITY] && (
        <ColumnSortHeader width={150} />
      )}
      {mergedConfig[TaskItemColumn.DUE_DATE] && (
        <ColumnSortHeader
          id={TaskItemColumn.DUE_DATE}
          label="Date"
          width={78}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskItemColumn.ASSIGNED] && (
        <ColumnSortHeader
          id={TaskItemColumn.ASSIGNED}
          label={groupHasMultipleAssignees ? 'Assign' : 'Asgn'}
          width={groupHasMultipleAssignees ? 90 : 60}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskItemColumn.LIST_NAME] && (
        <ColumnSortHeader
          id={TaskItemColumn.LIST_NAME}
          label="List"
          width={168}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
    </SortHeaderRow>
  );
};

export default TasksHeader;

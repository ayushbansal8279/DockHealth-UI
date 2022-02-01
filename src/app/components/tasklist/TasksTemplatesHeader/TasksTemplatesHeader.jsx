import React, { useMemo } from 'react';
import ColumnSortHeader from 'components/tasklist/ColumnSortHeader/ColumnSortHeader';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
import {
  TaskTemplateItemColumn,
  TASK_TEMPLATE_ITEM_BASE_COLUMN_CONFIG,
} from 'helpers/workflow-helpers';

const TasksTemplatesHeader = ({ sort, onSortChange, taskItemConfig = {} }) => {
  const mergedConfig = useMemo(
    () => ({
      ...TASK_TEMPLATE_ITEM_BASE_COLUMN_CONFIG,
      ...taskItemConfig,
    }),
    [taskItemConfig],
  );

  return (
    <SortHeaderRow>
      <ColumnSortHeader width={30} />
      {mergedConfig[TaskTemplateItemColumn.NAME] && (
        <ColumnSortHeader
          id={TaskTemplateItemColumn.NAME}
          label="Name"
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskTemplateItemColumn.CREATED_BY] && (
        <ColumnSortHeader
          id={TaskTemplateItemColumn.CREATED_BY}
          label="Created by"
          width={150}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskTemplateItemColumn.CREATED] && (
        <ColumnSortHeader
          id={TaskTemplateItemColumn.CREATED}
          label="Created"
          width={200}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskTemplateItemColumn.PERMISSIONS] && (
        <ColumnSortHeader
          id={TaskTemplateItemColumn.PERMISSIONS}
          label="Permissions"
          width={200}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
    </SortHeaderRow>
  );
};

export default TasksTemplatesHeader;

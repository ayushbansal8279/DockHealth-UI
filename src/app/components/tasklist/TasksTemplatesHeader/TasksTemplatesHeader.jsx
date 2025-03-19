import React, { useMemo } from 'react';
import ColumnSortHeader from 'components/tasklist/ColumnSortHeader/ColumnSortHeader';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
import {
  TaskTemplateItemColumn,
  TASK_TEMPLATE_ITEM_BASE_COLUMN_CONFIG,
} from 'helpers/workflow-helpers';

const TasksTemplatesHeader = ({
  sort,
  onSortChange,
  taskItemConfig = {},
  tasksHeaderTextTransform,
  tasksHeaderTextColor,
  shareTaskWorkflowAvailable,
}) => {
  const mergedConfig = useMemo(
    () => ({
      ...TASK_TEMPLATE_ITEM_BASE_COLUMN_CONFIG,
      ...taskItemConfig,
    }),
    [taskItemConfig],
  );

  if (!shareTaskWorkflowAvailable) {
    mergedConfig.remove(TaskTemplateItemColumn.SHARED_BY);
    mergedConfig.remove(TaskTemplateItemColumn.SHARED_WITH);
  }

  return (
    <SortHeaderRow>
      <ColumnSortHeader
        width={30}
        tasksHeaderTextTransform={tasksHeaderTextTransform}
        tasksHeaderTextColor={tasksHeaderTextColor}
      />
      {mergedConfig[TaskTemplateItemColumn.NAME] && (
        <ColumnSortHeader
          flex={1}
          id={TaskTemplateItemColumn.NAME}
          label="Name"
          sort={sort}
          onSortChange={onSortChange}
          tasksHeaderTextTransform={tasksHeaderTextTransform}
          tasksHeaderTextColor={tasksHeaderTextColor}
        />
      )}
      {mergedConfig[TaskTemplateItemColumn.SHARED_BY] && (
        <ColumnSortHeader
          id={TaskTemplateItemColumn.SHARED_BY}
          label="Shared by"
          width={150}
          tasksHeaderTextTransform={tasksHeaderTextTransform}
          tasksHeaderTextColor={tasksHeaderTextColor}
        />
      )}
      {mergedConfig[TaskTemplateItemColumn.SHARED_WITH] && (
        <ColumnSortHeader
          id={TaskTemplateItemColumn.SHARED_WITH}
          label="Shared with"
          width={150}
          tasksHeaderTextTransform={tasksHeaderTextTransform}
          tasksHeaderTextColor={tasksHeaderTextColor}
        />
      )}
      {mergedConfig[TaskTemplateItemColumn.CREATED_BY] && (
        <ColumnSortHeader
          id={TaskTemplateItemColumn.CREATED_BY}
          label="Created by"
          width={150}
          sort={sort}
          onSortChange={onSortChange}
          tasksHeaderTextTransform={tasksHeaderTextTransform}
          tasksHeaderTextColor={tasksHeaderTextColor}
        />
      )}
      {mergedConfig[TaskTemplateItemColumn.CREATED] && (
        <ColumnSortHeader
          id={TaskTemplateItemColumn.CREATED}
          label="Created"
          width={150}
          sort={sort}
          onSortChange={onSortChange}
          tasksHeaderTextTransform={tasksHeaderTextTransform}
          tasksHeaderTextColor={tasksHeaderTextColor}
        />
      )}
      {mergedConfig[TaskTemplateItemColumn.PERMISSIONS] && (
        <ColumnSortHeader
          id={TaskTemplateItemColumn.PERMISSIONS}
          label="Permissions"
          width={200}
          sort={sort}
          onSortChange={onSortChange}
          tasksHeaderTextTransform={tasksHeaderTextTransform}
          tasksHeaderTextColor={tasksHeaderTextColor}
        />
      )}
    </SortHeaderRow>
  );
};

export default TasksTemplatesHeader;

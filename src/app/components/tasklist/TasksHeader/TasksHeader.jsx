import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Checkbox from 'components/common/Checkbox/Checkbox';
import ColumnSortHeader from 'components/tasklist/ColumnSortHeader/ColumnSortHeader';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
import { TaskItemColumn, TaskItemColumnWidth } from 'helpers/task-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import { useColumnsConfig } from 'context-api/ColumnsConfigContext';
import { CustomFieldWidthConfig } from 'helpers/field-type-helpers';
import { BulkContainer, StickyColumnContainer } from './styled';

const TasksHeader = ({
  bulkEditEnabled,
  sort,
  onSortChange,
  isGroupSelected,
  onGroupSelect,
  groupHasMultipleAssignees,
  pageBackground,
}) => {
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const { columnsConfig, customColumnsConfig } = useColumnsConfig();
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  const mergedConfig = useMemo(
    () => ({
      ...columnsConfig,
    }),
    [columnsConfig],
  );

  return (
    <SortHeaderRow>
      <StickyColumnContainer backgroundColor={pageBackground}>
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
      </StickyColumnContainer>
      {mergedConfig[TaskItemColumn.SUBTASKS_COUNT] && (
        <ColumnSortHeader
          id={TaskItemColumn.SUBTASKS_COUNT}
          label="Sub"
          width={TaskItemColumnWidth[TaskItemColumn.SUBTASKS_COUNT]}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskItemColumn.PATIENT] && (
        <ColumnSortHeader
          id={TaskItemColumn.PATIENT}
          label={customerTypeLabelCapitalized}
          width={TaskItemColumnWidth[TaskItemColumn.PATIENT]}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskItemColumn.WORKFLOW_STATUS] && (
        <ColumnSortHeader
          id={TaskItemColumn.WORKFLOW_STATUS}
          label="Status"
          width={TaskItemColumnWidth[TaskItemColumn.WORKFLOW_STATUS]}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskItemColumn.ACTIVITY] && (
        <ColumnSortHeader
          width={TaskItemColumnWidth[TaskItemColumn.ACTIVITY]}
        />
      )}
      {mergedConfig[TaskItemColumn.START_DATE] && (
        <ColumnSortHeader
          id={TaskItemColumn.START_DATE}
          label="Start"
          width={TaskItemColumnWidth[TaskItemColumn.START_DATE]}
        />
      )}
      {mergedConfig[TaskItemColumn.DUE_DATE] && (
        <ColumnSortHeader
          id={TaskItemColumn.DUE_DATE}
          label="Due"
          width={TaskItemColumnWidth[TaskItemColumn.DUE_DATE]}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskItemColumn.ASSIGNED] && (
        <ColumnSortHeader
          id={TaskItemColumn.ASSIGNED}
          label={groupHasMultipleAssignees ? 'Assign' : 'Asgn'}
          width={TaskItemColumnWidth[TaskItemColumn.ASSIGNED].WIDE}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskItemColumn.LIST_NAME] && (
        <ColumnSortHeader
          id={TaskItemColumn.LIST_NAME}
          label="List"
          width={TaskItemColumnWidth[TaskItemColumn.LIST_NAME]}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {customColumnsConfig
        .filter(f => f.isChecked)
        .map(f => (
          <ColumnSortHeader
            truncateEnabled
            id={f.id}
            label={f.name}
            width={CustomFieldWidthConfig[f.fieldType]}
          />
        ))}
    </SortHeaderRow>
  );
};

export default TasksHeader;

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Checkbox from 'components/common/Checkbox/Checkbox';
import ColumnSortHeader from 'components/tasklist/ColumnSortHeader/ColumnSortHeader';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
import { TaskItemColumn } from 'helpers/task-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import { useColumnsConfig } from 'context-api/ColumnsConfigContext';
import { CustomFieldWidthConfig } from 'helpers/field-type-helpers';
import { trunc } from 'helpers/utility-functions';
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
          width={60}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {mergedConfig[TaskItemColumn.PATIENT] && (
        <ColumnSortHeader
          id={TaskItemColumn.PATIENT}
          label={customerTypeLabelCapitalized}
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
      {customColumnsConfig
        .filter(f => f.isChecked)
        .map(f => (
          <ColumnSortHeader
            id={f.id}
            label={trunc(
              f.name,
              CustomFieldWidthConfig[f.fieldType] / 12 || 10,
            )}
            width={CustomFieldWidthConfig[f.fieldType]}
          />
        ))}
    </SortHeaderRow>
  );
};

export default TasksHeader;

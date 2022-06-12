import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Checkbox from 'components/common/Checkbox/Checkbox';
import ColumnSortHeader from 'components/tasklist/ColumnSortHeader/ColumnSortHeader';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
import { TaskItemColumn } from 'helpers/task-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import { useColumnsConfig } from 'context-api/columns-config-context';
import { CustomFieldWidthConfig } from 'helpers/field-type-helpers';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  SINGLE_TASK_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import { sortAlphabetical } from 'helpers/custom-fields-helpers';
import { isNotEmptyArray } from 'helpers/utils-helpers';
import { BulkContainer, StickyColumnContainer } from './styled';
import { getTaskHeaderOptions, reorderColumns } from './helpers';
import { isNotEmptyArray } from 'helpers/utils-helpers';

const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const TasksHeader = ({
  bulkEditEnabled,
  sort,
  onSortChange,
  onOrderChange,
  isGroupSelected,
  onGroupSelect,
  groupHasMultipleAssignees,
  pageBackground,
}) => {
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const {
    columnsConfig,
    customColumnsConfig,
    patientCustomColumnsConfig,
    columnsOrder,
    setColumnsOrder,
  } = useColumnsConfig();
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  const alphabeticalSortedAllTypeCustomFields = useMemo(
    () =>
      sortAlphabetical([...customColumnsConfig, ...patientCustomColumnsConfig]),
    [customColumnsConfig, patientCustomColumnsConfig],
  );

  const restrictions =
    SINGLE_TASK_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];

  const regularFieldsList = useMemo(
    () =>
      getTaskHeaderOptions(
        customerTypeLabelCapitalized,
        groupHasMultipleAssignees,
        columnsConfig,
        restrictions,
      ),
    [
      customerTypeLabelCapitalized,
      groupHasMultipleAssignees,
      columnsConfig,
      restrictions,
    ],
  );

  const mergedFields = useMemo(() => {
    const allFields = [
      ...regularFieldsList.filter(f => f.shouldBeDisplayed),
      ...(restrictions?.customFields !== DISABLED
        ? alphabeticalSortedAllTypeCustomFields.filter(f => f.isChecked)
        : []),
    ];

    if (columnsOrder?.length > 0) {
      const fieldsWithOrder = allFields
        .filter(f => columnsOrder?.indexOf(f.identifier || f.id) >= 0)
        .sort((a, b) => {
          return (
            columnsOrder?.indexOf(a.identifier || a.id) -
            columnsOrder?.indexOf(b.identifier || b.id)
          );
        });
      const fieldsWithoutOrder = allFields.filter(
        f => columnsOrder?.indexOf(f.identifier || f.id) < 0,
      );
      return [...fieldsWithOrder, ...fieldsWithoutOrder];
    }

    return allFields;
  }, [
    alphabeticalSortedAllTypeCustomFields,
    columnsOrder,
    regularFieldsList,
    restrictions,
  ]);

  const onDragEnd = useCallback(
    column => {
      if (!column.destination) {
        return;
      }
      const newOrder = reorderColumns(
        mergedFields.map(f => f.id || f.identifier),
        column.source.index,
        column.destination.index,
      );

      if (newOrder) {
        onOrderChange(newOrder);
        setColumnsOrder(newOrder);
      }
    },
    [mergedFields, onOrderChange, setColumnsOrder],
  );

  const getColumnOrder = useCallback(
    TaskItemColumnType => {
      if (isNotEmptyArray(columnsOrder)) {
        const existingOrder = columnsOrder?.indexOf(TaskItemColumnType);
        if (existingOrder >= 0) return existingOrder;
        return 999;
      }
      return 'initial';
    },
    [columnsOrder],
  );

  const renderColumn = useCallback(
    (f, index, snapshot) => {
      if (f.contextType === 'CUSTOM') {
        return (
          <ColumnSortHeader
            key={f.identifier}
            draggable
            index={index}
            isDraggingOver={snapshot.isDraggingOver}
            disabled={f.targetType === 'PATIENT'}
            truncateEnabled
            id={f.identifier}
            label={f.name}
            width={CustomFieldWidthConfig[f.fieldType]}
            snapshot={snapshot}
          />
        );
      }

      return (
        <ColumnSortHeader
          key={f.id}
          index={index}
          draggable
          isDraggingOver={snapshot.isDraggingOver}
          id={f.id}
          label={f.label}
          width={f.width}
          sort={sort}
          truncateEnabled
          onSortChange={onSortChange}
          snapshot={snapshot}
          printWidth={f.printWidth}
        />
      );
    },
    [onSortChange, sort],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppableHeader" direction="horizontal">
        {(provided, snapshot) => (
          <SortHeaderRow ref={provided.innerRef} {...provided.droppableProps}>
            <StickyColumnContainer
              backgroundColor={pageBackground}
              order={getColumnOrder(TaskItemColumn.DESCRIPTION)}
            >
              {bulkEditEnabled && (
                <BulkContainer>
                  <Checkbox
                    isChecked={isGroupSelected}
                    onClick={onGroupSelect}
                  />
                </BulkContainer>
              )}
              <ColumnSortHeader width={35} />
              {columnsConfig[TaskItemColumn.DESCRIPTION] && (
                <ColumnSortHeader
                  id={TaskItemColumn.DESCRIPTION}
                  label="Tasks"
                  sort={sort}
                  onSortChange={onSortChange}
                />
              )}
            </StickyColumnContainer>
            {mergedFields
              .filter(f => f.id !== 'TASK_DESCRIPTION')
              .map((c, index) => renderColumn(c, index, snapshot))}
            {provided.placeholder}
          </SortHeaderRow>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TasksHeader;

/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Checkbox from 'components/common/Checkbox/Checkbox';
import ColumnSortHeader from 'components/tasklist/ColumnSortHeader/ColumnSortHeader';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
import { TaskItemColumn, TaskItemColumnWidth } from 'helpers/task-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { useColumnsConfig } from 'context-api/columns-config-context';
import { CustomFieldWidthConfig } from 'helpers/field-type-helpers';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { SINGLE_TASK_RESTRICTIONS_PROFILES } from 'restrictions/task-restrictions';
import { CUSTOM_FIELD_TYPES } from 'helpers/custom-fields-helpers';
import { BulkContainer, StickyColumnContainer } from './styled';
import { getTaskHeaderOptions, reorderColumns } from './helpers';

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
  const { columns, setColumns } = useColumnsConfig();
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  const restrictions =
    SINGLE_TASK_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];

  const onDragEnd = useCallback(
    column => {
      if (!column.destination) {
        return;
      }
      const newOrder = reorderColumns(
        columns.filter(f => f.isChecked),
        column.source.index,
        column.destination.index,
      );
      if (newOrder) {
        setColumns([
          ...newOrder,
          ...columns.filter(({ isChecked }) => !isChecked),
        ]);
      }
    },
    [columns, setColumns],
  );

  const renderColumn = useCallback(
    (f, index, snapshot) => {
      if (f._customFieldType === CUSTOM_FIELD_TYPES.REGULAR) {
        return (
          <ColumnSortHeader
            key={f.identifier}
            index={index}
            draggable
            isDraggingOver={snapshot.isDraggingOver}
            id={f.identifier}
            label={f.label}
            width={f.width}
            sort={sort}
            truncateEnabled
            onSortChange={onSortChange}
            snapshot={snapshot}
            printWidth={CustomFieldWidthConfig[f.fieldType]}
          />
        );
      }
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
          width={+CustomFieldWidthConfig[f.fieldType]}
          snapshot={snapshot}
          printWidth={
            f.id === TaskItemColumn.ASSIGNED
              ? TaskItemColumnWidth[TaskItemColumn.ASSIGNED].PRINT
              : undefined
          }
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
            <StickyColumnContainer backgroundColor={pageBackground}>
              {bulkEditEnabled && (
                <BulkContainer>
                  <Checkbox
                    isChecked={isGroupSelected}
                    onClick={onGroupSelect}
                  />
                </BulkContainer>
              )}
              <ColumnSortHeader width={35} />
              <ColumnSortHeader
                id={TaskItemColumn.DESCRIPTION}
                label="Tasks"
                sort={sort}
                onSortChange={onSortChange}
                printWidth={300}
              />
            </StickyColumnContainer>
            {columns
              .filter(
                f => f.identifier !== TaskItemColumn.DESCRIPTION && f.isChecked,
              )
              .map(c =>
                c._customFieldType === CUSTOM_FIELD_TYPES.REGULAR
                  ? getTaskHeaderOptions(
                      customerTypeLabel,
                      groupHasMultipleAssignees,
                      c,
                      restrictions,
                    )
                  : c,
              )
              .map((c, index) => renderColumn(c, index, snapshot))}
            {provided.placeholder}
          </SortHeaderRow>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TasksHeader;

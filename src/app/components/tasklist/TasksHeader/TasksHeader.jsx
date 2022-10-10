/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
import { TaskItemColumn, TaskItemColumnWidth } from 'helpers/task-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { useColumnsConfig } from 'context-api/columns-config-context';
import { CustomFieldWidthConfig } from 'helpers/field-type-helpers';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { SINGLE_TASK_RESTRICTIONS_PROFILES } from 'restrictions/task-restrictions';
import { CUSTOM_FIELD_TYPES } from 'helpers/custom-fields-helpers';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { isMemberAdmin } from 'helpers/list-members-helper';
import { BulkContainer, StickyColumnContainer } from './styled';
import {
  getTaskHeaderOptions,
  reorderColumns,
  TaskHeaderColumn,
} from './helpers';
import ColumnSortHeader from '../ColumnSortHeader/ColumnSortHeader';

const TasksHeader = ({
  bulkEditEnabled,
  sort,
  onSortChange,
  isGroupSelected,
  onGroupSelect,
  pageBackground,
}) => {
  const taskList = useSelector(currentTaskListSelector);
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const { columns, setColumns, setColumnWidth } = useColumnsConfig();
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const currentUserMember = taskList?.listUsers.find(
    u => u.identifier === currentUser?.identifier,
  );
  const isListAdmin = isMemberAdmin(currentUserMember);
  const restrictions =
    SINGLE_TASK_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const restrictCustomizationFeatures =
    taskList?.restrictCustomization && !isListAdmin;

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

  const handleResizeColumn = useCallback(
    (identifier, _, { size }) => {
      const { width } = size;
      if (typeof setColumnWidth === 'function') {
        setColumnWidth({
          columnIdentifier: identifier,
          columnWidth: width,
        });
      }
    },
    [setColumnWidth],
  );

  const renderColumn = useCallback(
    (f, index, snapshot) => {
      if (f._customFieldType === CUSTOM_FIELD_TYPES.REGULAR) {
        return (
          <ColumnSortHeader
            onResize={
              typeof setColumnWidth === 'function' ? handleResizeColumn : null
            }
            key={f.identifier}
            index={index}
            draggable={
              !restrictCustomizationFeatures &&
              ![TaskHeaderColumn.SUBTASKS_COUNT].includes(f.identifier)
            }
            disabled={[
              TaskHeaderColumn.ACTIVITY,
              TaskHeaderColumn.START_DATE,
              TaskHeaderColumn.ANCHOR_DATE,
            ].includes(f.identifier)}
            isDraggingOver={snapshot.isDraggingOver}
            id={f.identifier}
            label={f.label}
            width={f.columnWidth}
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
          onResize={
            typeof setColumnWidth === 'function' ? handleResizeColumn : null
          }
          key={f.identifier}
          index={index}
          draggable={!restrictCustomizationFeatures}
          isDraggingOver={snapshot.isDraggingOver}
          disabled={false}
          truncateEnabled
          id={f.identifier}
          label={f.name}
          sort={sort}
          onSortChange={onSortChange}
          width={+f.columnWidth}
          snapshot={snapshot}
          printWidth={
            f.id === TaskItemColumn.ASSIGNED
              ? TaskItemColumnWidth[TaskItemColumn.ASSIGNED].PRINT
              : undefined
          }
        />
      );
    },
    [
      handleResizeColumn,
      onSortChange,
      restrictCustomizationFeatures,
      setColumnWidth,
      sort,
    ],
  );

  const handleGroupSelect = useCallback(
    event => {
      event.stopPropagation();
      onGroupSelect(event);
    },
    [onGroupSelect],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        isDropDisabled={restrictCustomizationFeatures}
        droppableId="droppableHeader"
        direction="horizontal"
      >
        {(provided, snapshot) => (
          <SortHeaderRow ref={provided.innerRef} {...provided.droppableProps}>
            <StickyColumnContainer
              backgroundColor={pageBackground}
              customWidthExists
            >
              <ColumnSortHeader
                id={TaskItemColumn.DESCRIPTION}
                label="Tasks"
                sort={sort}
                onSortChange={onSortChange}
                width={
                  columns?.find(
                    ({ identifier }) =>
                      identifier === TaskItemColumn.DESCRIPTION,
                  )?.columnWidth
                }
                printWidth={
                  TaskItemColumnWidth[TaskItemColumn.DESCRIPTION].PRINT
                }
                onResize={
                  typeof setColumnWidth === 'function'
                    ? handleResizeColumn
                    : null
                }
              >
                {bulkEditEnabled && (
                  <BulkContainer>
                    <Checkbox
                      isChecked={isGroupSelected}
                      onClick={handleGroupSelect}
                    />
                  </BulkContainer>
                )}
              </ColumnSortHeader>
            </StickyColumnContainer>
            <ColumnSortHeader
              id={TaskItemColumn.SUBTASKS_COUNT}
              label="Sub"
              width={
                columns?.find(
                  ({ identifier }) =>
                    identifier === TaskItemColumn.SUBTASKS_COUNT,
                )?.columnWidth
              }
              onResize={
                typeof setColumnWidth === 'function' ? handleResizeColumn : null
              }
            />
            {columns
              .filter(
                f =>
                  f.identifier !== TaskItemColumn.DESCRIPTION &&
                  f.identifier !== TaskItemColumn.SUBTASKS_COUNT &&
                  f.isChecked,
              )
              .map(c =>
                c._customFieldType === CUSTOM_FIELD_TYPES.REGULAR
                  ? getTaskHeaderOptions(customerTypeLabel, c, restrictions)
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

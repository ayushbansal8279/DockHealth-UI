/* eslint-disable sonarjs/cognitive-complexity */
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
  const { columns, setColumns, setColumnWidth = () => {} } = useColumnsConfig();
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const currentUserMember = taskList?.listUsers.find(
    u => u.identifier === currentUser?.identifier,
  );
  const isListAdmin = isMemberAdmin(currentUserMember);
  const restrictions =
    SINGLE_TASK_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const restrictCustomizationFeatures =
    taskList?.restrictCustomization && !isListAdmin;

  const handleClickCheckbox = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();
      onGroupSelect(event);
    },
    [onGroupSelect],
  );

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
    (identifier, { size }) => {
      const { width } = size;
      setColumnWidth({
        columnIdentifier: identifier,
        columnWidth: width,
      });
    },
    [setColumnWidth],
  );

  const renderColumn = useCallback(
    (f, index, snapshot) => {
      const isRegular = f._customFieldType === CUSTOM_FIELD_TYPES.REGULAR;
      const customFieldDefaultPrintWidth = CustomFieldWidthConfig[f.fieldType];
      const regularFieldDefaultPrintWidth =
        typeof TaskItemColumnWidth[f.identifier] === 'object'
          ? TaskItemColumnWidth[f.identifier].PRINT ||
            TaskItemColumnWidth[f.identifier].DEFAULT
          : TaskItemColumnWidth[f.identifier];
      const customPrintWidth =
        customFieldDefaultPrintWidth || regularFieldDefaultPrintWidth;

      return (
        <ColumnSortHeader
          onResize={(id, _, size) => handleResizeColumn(id, { ...size, index })}
          key={f.identifier}
          index={index}
          draggable={
            !restrictCustomizationFeatures &&
            ![TaskHeaderColumn.SUBTASKS_COUNT].includes(f.identifier)
          }
          isDraggingOver={snapshot.isDraggingOver}
          disabled={
            isRegular
              ? [
                  TaskHeaderColumn.ACTIVITY,
                  TaskHeaderColumn.START_DATE,
                  TaskHeaderColumn.ANCHOR_DATE,
                ].includes(f.identifier)
              : f.targetType === 'PATIENT'
          }
          truncateEnabled
          id={f.identifier}
          label={isRegular ? f.label : f.name}
          width={f.columnWidth}
          snapshot={snapshot}
          sort={isRegular ? sort : null}
          onSortChange={isRegular ? onSortChange : null}
          printWidth={+customPrintWidth}
        />
      );
    },
    [handleResizeColumn, onSortChange, restrictCustomizationFeatures, sort],
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
              {bulkEditEnabled && (
                <BulkContainer>
                  <Checkbox
                    isChecked={isGroupSelected}
                    onClick={handleClickCheckbox}
                  />
                </BulkContainer>
              )}
              {renderColumn(
                getTaskHeaderOptions(
                  customerTypeLabel,
                  columns.filter(f => f.isChecked)?.[0],
                  restrictions,
                ),
                0,
                snapshot,
              )}
            </StickyColumnContainer>
            {columns
              .filter(f => f.isChecked)
              .filter((_, index) => index !== 0)
              .map(c =>
                c._customFieldType === CUSTOM_FIELD_TYPES.REGULAR
                  ? getTaskHeaderOptions(customerTypeLabel, c, restrictions)
                  : c,
              )
              .map((c, index) => renderColumn(c, index + 1, snapshot))}
            {provided.placeholder}
          </SortHeaderRow>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TasksHeader;

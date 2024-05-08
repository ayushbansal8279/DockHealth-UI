/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
import { TaskItemColumnWidth } from 'helpers/task-helpers';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDShortLabel,
} from 'helpers/customer-type-helper';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import { CustomFieldWidthConfig } from 'helpers/field-type-helpers';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { SINGLE_TASK_RESTRICTIONS_PROFILES } from 'restrictions/task-restrictions';
import { CUSTOM_FIELD_TYPES } from 'helpers/custom-fields-helpers';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import {
  selectedUserOrganizationSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { isMemberAdmin } from 'helpers/list-members-helper';
import { BulkContainer, StickyColumnContainer } from './styled';
import {
  getTaskHeaderOptions,
  reorderColumns,
  TaskHeaderColumn,
} from './helpers';
import ColumnSortHeader from '../ColumnSortHeader/ColumnSortHeader';
import { TaskScrollVericleLine } from '../../task/styled';

const TasksHeader = ({
  bulkEditEnabled,
  sort,
  onSortChange,
  isGroupSelected,
  onGroupSelect,
  pageBackground,
  listPageGroupHeader,
  isWidthGreaterThanHundredPercent,
  origin,
}) => {
  const taskList = useSelector(currentTaskListSelector);
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const {
    columns,
    setColumns,
    setColumnWidth = () => {},
  } = useTaskListColumnsConfig();
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const currentUserMember = taskList?.listUsers.find(
    (u) => u.identifier === currentUser?.identifier,
  );
  const isListAdmin = isMemberAdmin(currentUserMember);
  const restrictions =
    SINGLE_TASK_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const restrictCustomizationFeatures =
    taskList?.restrictCustomization && !isListAdmin;

  const uniqueIdentifierLabel = getCustomerUniqueIDShortLabel(
    currentUser,
    currentOrganization,
  );

  const tasksHeaderTextTransformItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'tasks.header.textTransform',
    ) || {};
  const tasksHeaderTextColorItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'tasks.header.textColor',
    ) || {};

  const handleClickCheckbox = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onGroupSelect(event);
    },
    [onGroupSelect],
  );

  const onDragEnd = useCallback(
    (column) => {
      if (!column.destination) {
        return;
      }
      const newOrder = reorderColumns(
        columns.filter((f) => f.isChecked),
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
      const regularFieldMinimumWidth =
        typeof TaskItemColumnWidth[f.identifier] === 'object'
          ? TaskItemColumnWidth[f.identifier].MINIMUM || 0
          : 0;
      const customPrintWidth =
        customFieldDefaultPrintWidth || regularFieldDefaultPrintWidth;

      const columnWidth = Math.max(f.columnWidth, regularFieldMinimumWidth);

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
          disabled={false}
          truncateEnabled
          id={f.identifier}
          label={isRegular ? f.label : f.name}
          width={
            index === 0
              ? +columnWidth - (origin === 'LIST' ? 1 : 1.5)
              : index === 1
              ? +columnWidth - (origin === 'LIST' ? 1 : 1.1)
              : +columnWidth
          }
          snapshot={snapshot}
          sort={sort}
          onSortChange={onSortChange}
          printWidth={+customPrintWidth}
          tasksHeaderTextTransform={tasksHeaderTextTransformItem?.value}
          tasksHeaderTextColor={tasksHeaderTextColorItem?.value}
        />
      );
    },
    [
      handleResizeColumn,
      onSortChange,
      restrictCustomizationFeatures,
      sort,
      tasksHeaderTextTransformItem,
      tasksHeaderTextColorItem,
    ],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        isDropDisabled={restrictCustomizationFeatures}
        droppableId="droppableHeader"
        direction="horizontal"
      >
        {(provided, snapshot) => (
          <SortHeaderRow
            origin={origin}
            listPageGroupHeader={listPageGroupHeader}
            isWidthGreaterThanHundredPercent={isWidthGreaterThanHundredPercent}
            ref={provided.innerRef}
            {...provided.droppableProps}
            $width={
              !window.disabledVirtualTaskList
                ? columns
                    .filter((f) => f.isChecked)
                    .reduce(
                      (accumulator, column) => accumulator + column.columnWidth,
                      0,
                    )
                : null
            }
          >
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
              {!bulkEditEnabled && (
                <BulkContainer style={{ width: '65px' }}>&nbsp;</BulkContainer>
              )}
              {renderColumn(
                getTaskHeaderOptions(
                  customerTypeLabel,
                  uniqueIdentifierLabel,
                  columns.find((f) => f.isChecked),
                  restrictions,
                ),
                0,
                snapshot,
              )}
              <TaskScrollVericleLine>&nbsp;</TaskScrollVericleLine>
            </StickyColumnContainer>
            {columns
              .filter((f) => f.isChecked)
              .filter((_, index) => index !== 0)
              .map((c) =>
                c._customFieldType === CUSTOM_FIELD_TYPES.REGULAR
                  ? getTaskHeaderOptions(
                      customerTypeLabel,
                      uniqueIdentifierLabel,
                      c,
                      restrictions,
                    )
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

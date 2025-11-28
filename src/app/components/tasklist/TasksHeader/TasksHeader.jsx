/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
import { TaskItemColumnWidth, limitColumnsForView } from 'helpers/task-helpers';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDShortLabel,
} from 'helpers/customer-type-helper';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import { CustomFieldWidthConfig } from 'helpers/field-type-helpers';
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
  getColumnType,
} from './helpers';
import ColumnSortHeader from '../ColumnSortHeader/ColumnSortHeader';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { TaskScrollVericleLine } from '../../task/styled';
import { snapCenterToCursor } from '@dnd-kit/modifiers';

const TasksHeader = React.memo(
  ({
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
    const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
      useSensor(KeyboardSensor),
      useSensor(TouchSensor),
    );
    const taskList = useSelector(currentTaskListSelector);
    const currentUser = useSelector(userProfileSelector);
    const currentOrganization = useSelector(selectedUserOrganizationSelector);
    const [activeTaskHeader, setActiveTaskHeader] = useState(null);
    const [dragDropDisabled, setDragDropDisabled] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
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

    const onDragStart = useCallback((column) => {
      setActiveTaskHeader(column.active?.data);
    }, []);

    const onDragMove = useCallback((column) => {
      setHoveredIndex(column.over?.data?.current?.index);
    }, []);

    const onDragEnd = useCallback(
      (column) => {
        setActiveTaskHeader(null);
        setHoveredIndex(null);
        const activeIndex = column.active?.data?.current?.index;
        const overIndex = column.over?.data?.current?.index;
        if (
          !column.over ||
          !column.over?.data?.current ||
          activeIndex === overIndex
        ) {
          return;
        }
        const newOrder = reorderColumns(
          columns.filter((f) => f.isChecked),
          activeIndex,
          overIndex,
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
        const customFieldDefaultPrintWidth =
          CustomFieldWidthConfig[f.fieldType];
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
        const columnType = getColumnType(f);

        return (
          <ColumnSortHeader
            onResize={(id, _, size) =>
              handleResizeColumn(id, { ...size, index })
            }
            key={f.identifier}
            index={index}
            draggable={
              !restrictCustomizationFeatures &&
              ![TaskHeaderColumn.SUBTASKS_COUNT].includes(f.identifier)
            }
            // isDraggingOver={snapshot?.isDraggingOver}
            disabled={f.sortDisabled}
            truncateEnabled
            id={f.identifier}
            label={isRegular ? f.label : f.name}
            width={
              index === 0
                ? +columnWidth - (origin === 'LIST' ? 1 : 1.1)
                : index === 1
                ? +columnWidth - (origin === 'LIST' ? 3 : 0.5)
                : +columnWidth
            }
            snapshot={snapshot}
            sort={sort}
            onSortChange={onSortChange}
            printWidth={+customPrintWidth}
            tasksHeaderTextTransform={tasksHeaderTextTransformItem?.value}
            tasksHeaderTextColor={tasksHeaderTextColorItem?.value}
            dragDropDisabled={dragDropDisabled}
            setDragDropDisabled={setDragDropDisabled}
            hoveredIndex={hoveredIndex}
            activeIndex={activeTaskHeader?.current?.index}
            columnType={columnType}
          />
        );
      },
      [
        restrictCustomizationFeatures,
        origin,
        sort,
        onSortChange,
        tasksHeaderTextTransformItem?.value,
        tasksHeaderTextColorItem?.value,
        handleResizeColumn,
        dragDropDisabled,
        setDragDropDisabled,
        hoveredIndex,
        activeTaskHeader,
      ],
    );

    const filteredColumns = useMemo(() => {
      return limitColumnsForView(currentOrganization, columns, origin);
    }, [currentOrganization, columns, origin]);

    return (
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={onDragMove}
      >
        <SortHeaderRow
          origin={origin}
          listPageGroupHeader={listPageGroupHeader}
          isWidthGreaterThanHundredPercent={isWidthGreaterThanHundredPercent}
          $width={
            !window.disabledVirtualTaskList
              ? filteredColumns
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
            )}
            <Box ml="1px" />
            <TaskScrollVericleLine
              highlightFirstColumnRightBorder={
                activeTaskHeader?.current?.index > hoveredIndex &&
                hoveredIndex === 1
              }
              style={{ marginLeft: '-1.0px' }}
            >
              &nbsp;
            </TaskScrollVericleLine>
          </StickyColumnContainer>
          {filteredColumns
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
            .map((c, index) => renderColumn(c, index + 1))}
        </SortHeaderRow>
        <DragOverlay modifiers={[snapCenterToCursor]}>
          {activeTaskHeader && (
            <ColumnSortHeader
              label={activeTaskHeader?.current?.label}
              width={activeTaskHeader?.current?.width}
              tasksHeaderTextTransform={
                activeTaskHeader?.current?.tasksHeaderTextTransform
              }
              isDragPreview
              dragDropDisabled={dragDropDisabled}
              setDragDropDisabled={setDragDropDisabled}
              hoveredIndex={hoveredIndex}
              activeIndex={activeTaskHeader?.current?.index}
              columnType={activeTaskHeader?.current?.columnType}
            />
          )}
        </DragOverlay>
      </DndContext>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for better performance
    return (
      prevProps.bulkEditEnabled === nextProps.bulkEditEnabled &&
      prevProps.isGroupSelected === nextProps.isGroupSelected &&
      prevProps.pageBackground === nextProps.pageBackground &&
      prevProps.listPageGroupHeader === nextProps.listPageGroupHeader &&
      prevProps.isWidthGreaterThanHundredPercent ===
        nextProps.isWidthGreaterThanHundredPercent &&
      prevProps.origin === nextProps.origin &&
      prevProps.sort?.key === nextProps.sort?.key &&
      prevProps.sort?.direction === nextProps.sort?.direction
    );
  },
);

export default TasksHeader;

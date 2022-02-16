/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useState,
  useMemo,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { Box } from '@material-ui/core';
import { checkIfAllTasksSelected } from 'helpers/bulk-edit-helpers';
import { pluck } from 'ramda';
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import { useDispatch, useSelector } from 'react-redux';
import ThreeDotsIcon from 'img/three-dots';
import { MoreVert } from '@material-ui/icons';
import * as ModalActions from 'modal/actions';
import * as WorkflowActions from 'actions/workflow-actions';
import * as TaskActions from 'actions/task-actions';
import * as TemplateBundleActions from 'actions/template-bundle-actions';
import { useBoolean } from 'hooks/useBoolean';
import {
  TaskItemColumn,
  TaskItemColumnWidth,
  TaskStatus,
} from 'helpers/task-helpers';
import Checkbox from 'components/common/Checkbox/Checkbox';
import ProgressBar from 'components/common/ProgressBar/ProgressBar';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import Spacing from 'components/common/Spacing';
import { useColumnsConfig } from 'context-api/ColumnsConfigContext';
import StickyMainTaskItemCell from 'components/task/StickyMainTaskItemCell/StickyMainTaskItemCell';
import TaskItemCell from 'components/task/TaskItemCell/TaskItemCell';
import TaskTemplateDueDate from 'components/task-template/TaskTemplateDueDate/TaskTemplateDueDate';
import { CustomFieldWidthConfig } from 'helpers/field-type-helpers';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { compose } from 'redux';
import TemplateHeaderName from '../TaskTemplateName/TaskTemplateName';
import TaskHeaderPatient from '../TaskTemplatePatient/TaskTemplatePatient';
import TemplateItemWorkflowStatus from '../TaskTemplateWorkflowStatus/TaskTemplateWorkflowStatus';
import TaskTemplateMembers from '../TaskTemplateMembers/TaskTemplateMembers';
import {
  TaskTemplateGroupHeaderContainer,
  TaskTemplateProgressCircle,
  TemplateHandle,
  TaskTemplateOptionsContainer,
} from './styled';
import TaskTemplateStartDate from '../TaskTemplateStartDate/TaskTemplateStartDate';

const TaskTemplateGroupHeader = ({
  templateGroup = {},
  groupHasMultipleAssignees,
  draggableProvided = {},
  groupDragAndDropDisabled,
  disablePatientAssignment,
  isCompletedTab = false,
  viewSetup,
  setIsAddingTask,
  highlightedValue,
  pageBackground,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { name, tasks, identifier } = templateGroup;
  const { SHOW_WORKFLOW_DETAILS, SHOW_WORKFLOW_COMPLETED_TASKS } = viewSetup;
  const { dragHandleProps } = draggableProvided;
  const [isHovered, setIsHovered, unsetIsHovered] = useBoolean(false);
  const [isOpen, setOpen] = useState(true);
  const { bulkEditIsActive } = useContext(BulkEditContext);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(name);
  const [nameInputError, setNameInputError] = useState(false);
  const nameInputReference = useRef(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [showIncompleteTasks, setShowIncompleteTasks] = useState(
    !isCompletedTab,
  );
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const dispatch = useDispatch();
  const { columnsConfig, customColumnsConfig } = useColumnsConfig();

  useEffect(() => {
    setOpen(SHOW_WORKFLOW_DETAILS);
    if (isCompletedTab) {
      setShowIncompleteTasks(SHOW_WORKFLOW_COMPLETED_TASKS);
      setShowCompletedTasks(true);
    } else {
      setShowIncompleteTasks(true);
      setShowCompletedTasks(SHOW_WORKFLOW_COMPLETED_TASKS);
    }
  }, [SHOW_WORKFLOW_DETAILS, SHOW_WORKFLOW_COMPLETED_TASKS, isCompletedTab]);

  useEffect(() => {
    setNameInputValue(name);
  }, [name]);

  const [completedTasksAmount, allTasksAmount] = useMemo(
    () =>
      tasks.reduce(
        (accumulator, currentTask) => {
          if (currentTask.status === TaskStatus.COMPLETE) {
            accumulator[0] += 1;
          }

          accumulator[0] += currentTask?.subTasksCompletedCount;
          accumulator[1] =
            accumulator[1] + (currentTask?.subTasksCount || 0) + 1;

          return accumulator;
        },
        [0, 0],
      ),
    [tasks],
  );

  const toggleTasksVisibility = useCallback(() => {
    return isCompletedTab
      ? setShowIncompleteTasks(!showIncompleteTasks)
      : setShowCompletedTasks(!showCompletedTasks);
  }, [
    isCompletedTab,
    setShowIncompleteTasks,
    setShowCompletedTasks,
    showCompletedTasks,
    showIncompleteTasks,
  ]);

  const menuOptions = useMemo(() => {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    let opts = [
      {
        name: 'Add Task',
        onClick: () => {
          setIsAddingTask(true);
        },
      },
      {
        name: 'Edit Name',
        onClick: () => {
          setIsEditing(true);
          setTimeout(() => {
            // eslint-disable-next-line no-unused-expressions
            nameInputReference.current?.focus();
          }, 0);
        },
      },
      {
        name: 'Duplicate',
        onClick: () =>
          dispatch(
            ModalActions.openModal('AttachmentsDuplicate', {
              confirm: () => {
                dispatch(WorkflowActions.duplicateWorkflow(identifier, true));
              },
              skip: () => {
                dispatch(WorkflowActions.duplicateWorkflow(identifier, false));
              },
            }),
          ),
      },
      {
        name: 'Move',
        onClick: () =>
          dispatch(
            ModalActions.openModal('SelectDestination', {
              confirmText: 'Move',
              confirm: ({
                taskListIdentifier: listIdentifier,
                taskGroupIdentifier,
              }) => {
                dispatch(
                  TemplateBundleActions.moveWorkflowToList(
                    identifier,
                    listIdentifier,
                    taskGroupIdentifier,
                  ),
                );
              },
            }),
          ),
      },
    ];

    if (isCompletedTab ? !showIncompleteTasks : !showCompletedTasks) {
      opts = [
        ...opts,
        {
          name: isCompletedTab
            ? 'Show incomplete tasks'
            : 'Show completed tasks',
          onClick: toggleTasksVisibility,
        },
      ];
    }

    if (isCompletedTab ? showIncompleteTasks : showCompletedTasks) {
      opts = [
        ...opts,
        {
          name: isCompletedTab
            ? 'Hide incomplete tasks'
            : 'Hide completed tasks',
          onClick: toggleTasksVisibility,
        },
      ];
    }

    return [
      ...opts,
      {
        name: 'Delete',
        onClick: () =>
          dispatch(
            ModalActions.openModal('DeleteConfirmation', {
              title: 'Delete workflow',
              description:
                'Are you sure you want to delete this workflow? This action cannot be undone.',
              confirm: () => {
                dispatch(WorkflowActions.deleteWorkflow(identifier));
                dispatch(ModalActions.closeModal());
              },
            }),
          ),
      },
    ];
  }, [
    isCompletedTab,
    showIncompleteTasks,
    showCompletedTasks,
    setIsAddingTask,
    dispatch,
    identifier,
    toggleTasksVisibility,
  ]);

  const handleNameInputKeyDown = useCallback(
    event => {
      const { key } = event;
      if (key === 'Enter') {
        setIsEditing(false);
        const { value } = event.target;
        if (value?.length > 1) {
          setNameInputError(false);
          dispatch(
            TemplateBundleActions.updateTemplateBundle({
              bundle: templateGroup,
              dataToUpdate: {
                name: event.target?.value,
              },
            }),
          );
          // eslint-disable-next-line no-unused-expressions
          nameInputReference.current?.blur();
        } else {
          setNameInputError(true);
        }
      } else if (key === 'Escape') {
        setNameInputError(false);
        // eslint-disable-next-line no-unused-expressions
        nameInputReference.current?.blur();
      }
    },
    [dispatch, templateGroup],
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter(
        isCompletedTab
          ? task => showIncompleteTasks || task.status === TaskStatus.COMPLETE
          : task => showCompletedTasks || task.status !== TaskStatus.COMPLETE,
      ),
    [showCompletedTasks, showIncompleteTasks, tasks, isCompletedTab],
  );

  const isBundleSelected = useMemo(
    () => checkIfAllTasksSelected(filteredTasks),
    [filteredTasks],
  );

  const handleBundleSelect = useCallback(() => {
    const { parentTasks, subtasks } = extractTasksAndSubtasks(filteredTasks);

    const allTasks = [...parentTasks, ...subtasks];
    dispatch(
      TaskActions.changeTasksSelectedState(
        !isBundleSelected,
        pluck('identifier', allTasks),
      ),
    );
  }, [dispatch, isBundleSelected, filteredTasks]);

  return (
    <TaskTemplateGroupHeaderContainer
      onMouseEnter={setIsHovered}
      onMouseLeave={unsetIsHovered}
    >
      {columnsConfig[TaskItemColumn.DESCRIPTION] && (
        <StickyMainTaskItemCell
          backgroundColor={pageBackground}
          isSelected={isBundleSelected}
          isEditingDescription={isEditing}
        >
          {!groupDragAndDropDisabled && !bulkEditIsActive && (
            <TemplateHandle
              src={ThreeDotsIcon}
              alt="Handle"
              {...dragHandleProps}
            />
          )}
          <Checkbox isChecked={isBundleSelected} onClick={handleBundleSelect} />
          <Box m={1} />
          <RotatableChevron rotated={isOpen} onClick={() => setOpen(!isOpen)} />
          <Spacing horizontal={2} />
          <OptionsMenu options={menuOptions}>
            <MoreVert color="primary" />
          </OptionsMenu>
          <TemplateHeaderName
            templateGroup={templateGroup}
            isEditing={isEditing}
            nameInputError={nameInputError}
            setNameInputValue={setNameInputValue}
            setNameInputError={setNameInputError}
            setIsEditing={setIsEditing}
            handleNameInputKeyDown={handleNameInputKeyDown}
            nameInputValue={nameInputValue}
          />
          <TaskTemplateOptionsContainer
            groupHasMultipleAssignees={groupHasMultipleAssignees}
          >
            <TaskTemplateProgressCircle>
              <ProgressBar
                width={80}
                progress={(completedTasksAmount / allTasksAmount) * 100}
                label={`${completedTasksAmount}/${allTasksAmount}`}
              />
            </TaskTemplateProgressCircle>
          </TaskTemplateOptionsContainer>
        </StickyMainTaskItemCell>
      )}
      {columnsConfig[TaskItemColumn.SUBTASKS_COUNT] && (
        <TaskItemCell
          width={TaskItemColumnWidth[TaskItemColumn.SUBTASKS_COUNT]}
        />
      )}
      {columnsConfig[TaskItemColumn.PATIENT] && (
        <TaskItemCell
          width={TaskItemColumnWidth[TaskItemColumn.PATIENT]}
          alignItems="flex-start"
        >
          {!disablePatientAssignment && (
            <TaskHeaderPatient
              highlightedValue={highlightedValue}
              workflow={templateGroup}
              onWorkflowUpdate={compose(dispatch, updatePartialWorkflow)}
              currentUser={currentUser}
            />
          )}
        </TaskItemCell>
      )}
      {columnsConfig[TaskItemColumn.WORKFLOW_STATUS] && (
        <TaskItemCell
          width={TaskItemColumnWidth[TaskItemColumn.WORKFLOW_STATUS]}
          paddingLeft="smallPlus"
          paddingRight="tiny"
          onContextMenu={event => {
            event.stopPropagation();
          }}
        >
          <TemplateItemWorkflowStatus
            workflow={templateGroup}
            onWorkflowUpdate={compose(dispatch, updatePartialWorkflow)}
            highlightedValue={highlightedValue}
          />
        </TaskItemCell>
      )}
      {columnsConfig[TaskItemColumn.ACTIVITY] && (
        <TaskItemCell width={TaskItemColumnWidth[TaskItemColumn.ACTIVITY]} />
      )}
      {columnsConfig[TaskItemColumn.START_DATE] && (
        <TaskItemCell
          width={TaskItemColumnWidth[TaskItemColumn.START_DATE]}
          justify="center"
        >
          <TaskTemplateStartDate
            workflow={templateGroup}
            isHovered={isHovered}
          />
        </TaskItemCell>
      )}
      {columnsConfig[TaskItemColumn.DUE_DATE] && (
        <TaskItemCell
          width={TaskItemColumnWidth[TaskItemColumn.DUE_DATE]}
          justify="center"
        >
          <TaskTemplateDueDate workflow={templateGroup} isHovered={isHovered} />
        </TaskItemCell>
      )}
      {columnsConfig[TaskItemColumn.ASSIGNED] && (
        <TaskItemCell
          width={
            groupHasMultipleAssignees
              ? TaskItemColumnWidth[TaskItemColumn.ASSIGNED].WIDE
              : TaskItemColumnWidth[TaskItemColumn.ASSIGNED].NARROW
          }
          justify={groupHasMultipleAssignees ? 'flex-start' : 'center'}
          paddingLeft="small"
          paddingRight="small"
          onContextMenu={event => {
            event.stopPropagation();
          }}
        >
          <TaskTemplateMembers
            currentUser={currentUser}
            multipleAssigneesContext={groupHasMultipleAssignees}
            workflow={templateGroup}
            onWorkflowUpdate={compose(dispatch, updatePartialWorkflow)}
          />
        </TaskItemCell>
      )}
      {columnsConfig[TaskItemColumn.LIST_NAME] && (
        <TaskItemCell width={TaskItemColumnWidth[TaskItemColumn.LIST_NAME]} />
      )}
      {customColumnsConfig
        .filter(f => f.isChecked)
        .map(field => (
          <TaskItemCell width={CustomFieldWidthConfig[field.fieldType]} />
        ))}
    </TaskTemplateGroupHeaderContainer>
  );
};

export default TaskTemplateGroupHeader;

/* eslint-disable @typescript-eslint/no-unused-vars */
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
import * as TaskTemplateApi from 'api/task-template-api';
import { useBoolean } from 'hooks/useBoolean';
import {
  TaskItemColumn,
  TaskItemColumnWidth,
  TaskStatus,
} from 'helpers/task-helpers';
import { workflowSelector } from 'selectors/workflow-drawer-selectors';
import Checkbox from 'components/common/Checkbox/Checkbox';
import ProgressBar from 'components/common/ProgressBar/ProgressBar';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import TaskItemCustomField from 'components/common/CustomField/TaskItemCustomField';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import Spacing from 'components/common/Spacing';
import { useColumnsConfig } from 'context-api/ColumnsConfigContext';
import StickyMainTaskItemCell from 'components/task/StickyMainTaskItemCell/StickyMainTaskItemCell';
import TaskItemCell from 'components/task/TaskItemCell/TaskItemCell';
import TaskTemplateDueDate from 'components/task-template/TaskTemplateDueDate/TaskTemplateDueDate';
import { CustomFieldWidthConfig } from 'helpers/field-type-helpers';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { compose } from 'redux';
import { openModal } from 'modal/actions';
import {
  getTasksGroupsList,
  moveWorkflowToGroup,
} from 'actions/list-details-actions';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import TemplateHeaderName from '../TaskTemplateName/TaskTemplateName';
import TaskHeaderPatient from '../TaskTemplatePatient/TaskTemplatePatient';
import TemplateItemWorkflowStatus from '../TaskTemplateWorkflowStatus/TaskTemplateWorkflowStatus';
import TaskTemplateMembers from '../TaskTemplateMembers/TaskTemplateMembers';
import TaskTemplateStartDate from '../TaskTemplateStartDate/TaskTemplateStartDate';
import {
  TaskTemplateGroupHeaderContainer,
  TaskTemplateProgressCircle,
  TemplateHandle,
  TaskTemplateOptionsContainer,
} from './styled';

const TaskTemplateGroupHeader = ({
  templateGroup = {},
  groupHasMultipleAssignees,
  draggableProvided = {},
  groupDragAndDropDisabled,
  disablePatientAssignment,
  isCompletedTab = false,
  setIsAddingTask,
  highlightedValue,
  pageBackground,
  isOpen,
  setOpen,
  showCompletedTasks,
  setShowCompletedTasks,
  showIncompleteTasks,
  setShowIncompleteTasks,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const {
    name,
    tasks,
    identifier,
    tasksCount,
    tasksCompletedCount,
    taskListIdentifier,
  } = templateGroup;
  const { dragHandleProps } = draggableProvided;
  const [isHovered, setIsHovered, unsetIsHovered] = useBoolean(false);
  const { bulkEditIsActive } = useContext(BulkEditContext);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(name);
  const [nameInputError, setNameInputError] = useState(false);
  const nameInputReference = useRef(null);
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const currentList = useSelector(currentTaskListSelector);
  const dispatch = useDispatch();
  const { columnsConfig, customColumnsConfig } = useColumnsConfig();
  useEffect(() => {
    setNameInputValue(name);
  }, [name]);
  const [workFlowData, setWorkFlowData] = useState(undefined);
  const selectedWorkflow = useSelector(workflowSelector);

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

  const completedTasksAmountFinal = tasksCompletedCount || completedTasksAmount;
  const allTasksAmountFinal = tasksCount || allTasksAmount;

  const toggleTasksVisibility = useCallback(() => {
    if (!showCompletedTasks && completedTasksAmount === 0) {
      dispatch(TemplateBundleActions.getTasksForWorkflow(identifier));
    }
    return isCompletedTab
      ? setShowIncompleteTasks(!showIncompleteTasks)
      : setShowCompletedTasks(!showCompletedTasks);
  }, [
    isCompletedTab,
    setShowIncompleteTasks,
    setShowCompletedTasks,
    showCompletedTasks,
    showIncompleteTasks,
    completedTasksAmount,
    dispatch,
    identifier,
  ]);

  const handleMoveGroupTask = useCallback(() => {
    const handleAddGroupTask = () => {
      dispatch(getTasksGroupsList());
    };

    dispatch(
      openModal('SelectDestinationGroup', {
        confirm: group => {
          dispatch(
            moveWorkflowToGroup(
              templateGroup.identifier,
              group.taskGroupIdentifier,
              templateGroup,
            ),
          );
        },
        selectedList: currentList,
        onCreateGroup: handleAddGroupTask,
      }),
    );
  }, [currentList, dispatch, templateGroup]);

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
      {
        name: 'Move to group',
        onClick: handleMoveGroupTask,
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
    handleMoveGroupTask,
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

  const getWorkflowData = useCallback(async id => {
    setWorkFlowData(await TaskTemplateApi.getTemplate(id));
  }, []);

  useEffect(() => {
    !selectedWorkflow ? getWorkflowData(identifier) : setWorkFlowData(null);
  }, [identifier, selectedWorkflow]);

  return (
    <TaskTemplateGroupHeaderContainer
      onMouseEnter={setIsHovered}
      isSelected={isBundleSelected}
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
                progress={
                  (completedTasksAmountFinal / allTasksAmountFinal) * 100
                }
                label={`${completedTasksAmountFinal}/${allTasksAmountFinal}`}
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
          width={TaskItemColumnWidth[TaskItemColumn.ASSIGNED].WIDE}
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
      {customColumnsConfig &&
        workFlowData &&
        customColumnsConfig
          .filter(f => f.isChecked)
          .map(field => (
            <TaskItemCell width={CustomFieldWidthConfig[field.fieldType]}>
              <TaskItemCustomField
                field={field}
                readOnly
                customFieldValue={workFlowData?.taskMetaData?.find(
                  f => f.customFieldIdentifier === field.identifier,
                )}
                task={workFlowData}
                isHovered={isHovered}
              />
            </TaskItemCell>
          ))}
    </TaskTemplateGroupHeaderContainer>
  );
};

export default TaskTemplateGroupHeader;

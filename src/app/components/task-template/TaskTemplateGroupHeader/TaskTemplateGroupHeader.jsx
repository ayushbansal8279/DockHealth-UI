/* eslint-disable no-underscore-dangle */
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
import pluck from 'ramda/src/pluck';
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import { useDispatch, useSelector } from 'react-redux';
import ThreeDotsIcon from 'img/three-dots';
import { MoreVert } from '@material-ui/icons';
import * as ModalActions from 'modal/actions';
import * as WorkflowActions from 'actions/workflow-actions';
import * as TaskActions from 'actions/task-actions';
import * as TemplateBundleActions from 'actions/template-bundle-actions';
import {
  isColumnChecked,
  TaskItemColumn,
  TaskItemColumnWidth,
  TaskStatus,
} from 'helpers/task-helpers';
import * as TaskTemplateApi from 'api/task-template-api';
import { workflowSelector } from 'selectors/workflow-drawer-selectors';
import Checkbox from 'components/common/Checkbox/Checkbox';
import ProgressBar from 'components/common/ProgressBar/ProgressBar';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import TaskItemCustomField from 'components/common/CustomField/TaskItemCustomField';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import Spacing from 'components/common/Spacing';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import StickyMainTaskItemCell from 'components/task/StickyMainTaskItemCell/StickyMainTaskItemCell';
import TaskItemCell from 'components/task/TaskItemCell/TaskItemCell';
import TaskTemplateDueDate from 'components/task-template/TaskTemplateDueDate/TaskTemplateDueDate';
// import { CustomFieldWidthConfig } from 'helpers/field-type-helpers';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { compose } from 'redux';
import { openModal } from 'modal/actions';
import {
  getTasksGroupsList,
  moveWorkflowToGroup,
} from 'actions/list-details-actions';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { openDrawer } from 'actions/workflow-drawer-actions';
import { CUSTOM_FIELD_TYPES } from 'helpers/custom-fields-helpers';
import {
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import TemplateHeaderName from '../TaskTemplateName/TaskTemplateName';
import TaskHeaderPatient from '../TaskTemplatePatient/TaskTemplatePatient';
import TemplateItemWorkflowStatus from '../TaskTemplateWorkflowStatus/TaskTemplateWorkflowStatus';
import TaskTemplateMembers from '../TaskTemplateMembers/TaskTemplateMembers';
import TaskTemplateStartDate from '../TaskTemplateStartDate/TaskTemplateStartDate';
import TaskTemplateAnchorDate from '../TaskTemplateAnchorDate/TaskTemplateAnchorDate';
import TaskTemplateIcons from '../TaskTemplateIcons/TaskTemplateIcons';
import {
  TaskTemplateGroupHeaderContainer,
  TaskTemplateProgressCircle,
  TemplateHandle,
  TaskTemplateOptionsContainer,
  ActionIconsContainer,
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
  // isFetchingTasks,
  showTasksWithGroup = true,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const {
    name,
    tasks,
    identifier,
    tasksCount,
    tasksCompletedCount,
    selected,
  } = templateGroup;

  const { dragHandleProps } = draggableProvided;
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
  const { columns } = useTaskListColumnsConfig();
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
        name: 'Add task',
        onClick: () => {
          setIsAddingTask(true);
        },
      },
      {
        name: 'Edit name',
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
        name: 'Move to list',
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
    if (filteredTasks.length > 0 && isOpen) {
      const { parentTasks, subtasks } = extractTasksAndSubtasks(filteredTasks);
      const allTasks = [...parentTasks, ...subtasks];
      dispatch(
        TaskActions.changeTasksSelectedState(
          !isBundleSelected,
          pluck('identifier', allTasks),
        ),
      );
      dispatch(
        TaskActions.changeWorkflowSelectedState(!isBundleSelected, identifier),
      );
    } else {
      dispatch(TaskActions.changeWorkflowSelectedState(!selected, identifier));
    }
  }, [filteredTasks, isOpen, dispatch, isBundleSelected, identifier, selected]);

  // useEffect(() => {
  //   if (selected && isOpen && filteredTasks?.length > 0) {
  //     const { parentTasks, subtasks } = extractTasksAndSubtasks(filteredTasks);
  //     const allTasks = [...parentTasks, ...subtasks];
  //     dispatch(
  //       TaskActions.changeWorkflowSelectedState(!isBundleSelected, identifier),
  //     );
  //     dispatch(
  //       TaskActions.changeTasksSelectedState(
  //         !isBundleSelected,
  //         pluck('identifier', allTasks),
  //       ),
  //     );
  //   }
  // }, [
  //   dispatch,
  //   filteredTasks,
  //   identifier,
  //   isBundleSelected,
  //   isFetchingTasks,
  //   isOpen,
  //   selected,
  // ]);

  // useEffect(() => {
  //   if (!isOpen && isBundleSelected && !selected) {
  //     const { parentTasks, subtasks } = extractTasksAndSubtasks(filteredTasks);
  //     const allTasks = [...parentTasks, ...subtasks];
  //     dispatch(
  //       TaskActions.changeTasksSelectedState(
  //         !isBundleSelected,
  //         pluck('identifier', allTasks),
  //       ),
  //     );
  //     dispatch(
  //       TaskActions.changeWorkflowSelectedState(!isBundleSelected, identifier),
  //     );
  //   }
  // }, [
  //   dispatch,
  //   filteredTasks,
  //   identifier,
  //   isBundleSelected,
  //   isFetchingTasks,
  //   isOpen,
  //   selected,
  // ]);

  const getColumnOrder = useCallback(
    TaskItemColumnType =>
      columns?.findIndex(c => c.identifier === TaskItemColumnType),
    [columns],
  );

  const getWorkflowData = useCallback(async id => {
    setWorkFlowData(await TaskTemplateApi.getTemplateBasicDetails(id));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    !selectedWorkflow ? getWorkflowData(identifier) : setWorkFlowData(null);
  }, [getWorkflowData, identifier, selectedWorkflow]);

  const restrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;

  const randerFirstColumnCoverIfNecessary = useCallback(
    (content, order, width) => {
      if (order !== 0) return content;
      return (
        <StickyMainTaskItemCell
          customWidthExists
          backgroundColor={pageBackground}
          isSelected={isBundleSelected}
          isEditingDescription={isEditing}
          order={0}
          width={+width + 26 + 54}
        >
          {!groupDragAndDropDisabled &&
            !bulkEditIsActive &&
            restrictions?.createTask !== DISABLED && (
              <TemplateHandle
                src={ThreeDotsIcon}
                alt="Handle"
                {...dragHandleProps}
              />
            )}
          <ActionIconsContainer>
            {restrictions?.createTask !== DISABLED && (
              <Checkbox
                isChecked={selected || isBundleSelected}
                onClick={handleBundleSelect}
              />
            )}
            <Box m={1} />
            {showTasksWithGroup && (
              <RotatableChevron
                rotated={isOpen}
                onClick={() => setOpen(!isOpen)}
              />
            )}
            {restrictions?.createTask !== DISABLED && (
              <>
                <Spacing horizontal={2} />
                <OptionsMenu options={menuOptions}>
                  <MoreVert color="primary" />
                </OptionsMenu>
              </>
            )}
          </ActionIconsContainer>

          {content}
        </StickyMainTaskItemCell>
      );
    },
    [
      DISABLED,
      bulkEditIsActive,
      dragHandleProps,
      groupDragAndDropDisabled,
      handleBundleSelect,
      isBundleSelected,
      isEditing,
      isOpen,
      menuOptions,
      pageBackground,
      restrictions,
      selected,
      setOpen,
      showTasksWithGroup,
    ],
  );

  return (
    <TaskTemplateGroupHeaderContainer isSelected={isBundleSelected}>
      {randerFirstColumnCoverIfNecessary(
        <>
          <TaskItemCell
            key={`task_description_${identifier}`}
            width={
              columns?.find(
                ({ identifier: id }) => id === TaskItemColumn.DESCRIPTION,
              )?.columnWidth
            }
            paddingLeft="smallPlus"
            paddingRight="tiny"
            onContextMenu={event => {
              event.stopPropagation();
            }}
            order={getColumnOrder(TaskItemColumn.DESCRIPTION)}
          >
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
          </TaskItemCell>
        </>,
        getColumnOrder(TaskItemColumn.DESCRIPTION),
        columns?.find(({ identifier: id }) => id === TaskItemColumn.DESCRIPTION)
          ?.columnWidth,
      )}
      {randerFirstColumnCoverIfNecessary(
        <TaskItemCell
          justify="center"
          paddingLeft="tiny"
          paddingRight="tiny"
          key={`subtask_count_${identifier}`}
          width={
            columns?.find(
              ({ identifier: id }) => id === TaskItemColumn.SUBTASKS_COUNT,
            )?.columnWidth
          }
          order={getColumnOrder(TaskItemColumn.SUBTASKS_COUNT)}
        />,
        getColumnOrder(TaskItemColumn.SUBTASKS_COUNT),
        columns?.find(
          ({ identifier: id }) => id === TaskItemColumn.SUBTASKS_COUNT,
        )?.columnWidth,
      )}

      {isColumnChecked(columns, TaskItemColumn.PATIENT) && (
        <>
          {randerFirstColumnCoverIfNecessary(
            <TaskItemCell
              key={`patient_${identifier}`}
              width={
                columns?.find(
                  ({ identifier: id }) => id === TaskItemColumn.PATIENT,
                ).columnWidth
              }
              alignItems="flex-start"
              order={getColumnOrder(TaskItemColumn.PATIENT)}
            >
              {!disablePatientAssignment && (
                <TaskHeaderPatient
                  highlightedValue={highlightedValue}
                  workflow={templateGroup}
                  onWorkflowUpdate={compose(dispatch, updatePartialWorkflow)}
                  currentUser={currentUser}
                />
              )}
            </TaskItemCell>,
            getColumnOrder(TaskItemColumn.PATIENT),
            columns?.find(({ identifier: id }) => id === TaskItemColumn.PATIENT)
              .columnWidth,
          )}
        </>
      )}
      {isColumnChecked(columns, TaskItemColumn.WORKFLOW_STATUS) && (
        <>
          {randerFirstColumnCoverIfNecessary(
            <TaskItemCell
              key={`task_status_${identifier}`}
              width={
                columns?.find(
                  ({ identifier: id }) => id === TaskItemColumn.WORKFLOW_STATUS,
                )?.columnWidth
              }
              paddingLeft="smallPlus"
              paddingRight="tiny"
              onContextMenu={event => {
                event.stopPropagation();
              }}
              order={getColumnOrder(TaskItemColumn.WORKFLOW_STATUS)}
            >
              <TemplateItemWorkflowStatus
                workflow={templateGroup}
                onWorkflowUpdate={compose(dispatch, updatePartialWorkflow)}
                highlightedValue={highlightedValue}
              />
            </TaskItemCell>,
            getColumnOrder(TaskItemColumn.WORKFLOW_STATUS),
            columns?.find(
              ({ identifier: id }) => id === TaskItemColumn.WORKFLOW_STATUS,
            )?.columnWidth,
          )}
        </>
      )}

      {isColumnChecked(columns, TaskItemColumn.ACTIVITY) && (
        <>
          {randerFirstColumnCoverIfNecessary(
            <TaskItemCell
              key={`activity_${identifier}`}
              width={
                columns?.find(
                  ({ identifier: id }) => id === TaskItemColumn.ACTIVITY,
                )?.columnWidth
              }
              order={getColumnOrder(TaskItemColumn.ACTIVITY)}
            >
              <TaskTemplateIcons
                workflow={
                  templateGroup.comments || !workFlowData
                    ? templateGroup
                    : workFlowData
                }
                dispatch={dispatch}
              />
            </TaskItemCell>,
            getColumnOrder(TaskItemColumn.ACTIVITY),
            columns?.find(
              ({ identifier: id }) => id === TaskItemColumn.ACTIVITY,
            )?.columnWidth,
          )}
        </>
      )}
      {isColumnChecked(columns, TaskItemColumn.START_DATE) && (
        <>
          {randerFirstColumnCoverIfNecessary(
            <TaskItemCell
              key={`start_date_${identifier}`}
              width={
                columns?.find(
                  ({ identifier: id }) => id === TaskItemColumn.START_DATE,
                )?.columnWidth
              }
              justify="center"
              order={getColumnOrder(TaskItemColumn.START_DATE)}
            >
              <TaskTemplateStartDate workflow={templateGroup} />
            </TaskItemCell>,
            getColumnOrder(TaskItemColumn.START_DATE),
            columns?.find(
              ({ identifier: id }) => id === TaskItemColumn.START_DATE,
            )?.columnWidth,
          )}
        </>
      )}
      {isColumnChecked(columns, TaskItemColumn.DUE_DATE) && (
        <>
          {randerFirstColumnCoverIfNecessary(
            <TaskItemCell
              key={`due_date_${identifier}`}
              width={
                columns?.find(
                  ({ identifier: id }) => id === TaskItemColumn.DUE_DATE,
                )?.columnWidth
              }
              justify="center"
              order={getColumnOrder(TaskItemColumn.DUE_DATE)}
            >
              {restrictions?.createTask !== DISABLED && (
                <TaskTemplateDueDate workflow={templateGroup} />
              )}
            </TaskItemCell>,
            getColumnOrder(TaskItemColumn.DUE_DATE),
            columns?.find(
              ({ identifier: id }) => id === TaskItemColumn.DUE_DATE,
            )?.columnWidth,
          )}
        </>
      )}
      {isColumnChecked(columns, TaskItemColumn.ANCHOR_DATE) && (
        <TaskItemCell
          key={`anchor_date_${identifier}`}
          width={
            columns?.find(
              ({ identifier: id }) => id === TaskItemColumn.ANCHOR_DATE,
            )?.columnWidth
          }
          justify="center"
          order={getColumnOrder(TaskItemColumn.ANCHOR_DATE)}
        >
          <TaskTemplateAnchorDate workflow={templateGroup} />
        </TaskItemCell>
      )}
      {isColumnChecked(columns, TaskItemColumn.ASSIGNED) && (
        <>
          {randerFirstColumnCoverIfNecessary(
            <TaskItemCell
              key={`assigned_${identifier}`}
              width={
                columns?.find(
                  ({ identifier: id }) => id === TaskItemColumn.ASSIGNED,
                )?.columnWidth
              }
              // eslint-disable-next-line sonarjs/no-all-duplicated-branches
              justify={groupHasMultipleAssignees ? 'center' : 'center'}
              paddingLeft="small"
              paddingRight="small"
              onContextMenu={event => {
                event.stopPropagation();
              }}
              order={getColumnOrder(TaskItemColumn.ASSIGNED)}
              printWidth={TaskItemColumnWidth[TaskItemColumn.ASSIGNED].PRINT}
            >
              <TaskTemplateMembers
                currentUser={currentUser}
                multipleAssigneesContext={groupHasMultipleAssignees}
                workflow={
                  templateGroup.assignedToUsers || !workFlowData
                    ? templateGroup
                    : workFlowData
                }
                onWorkflowUpdate={compose(dispatch, updatePartialWorkflow)}
              />
            </TaskItemCell>,
            getColumnOrder(TaskItemColumn.ASSIGNED),
            columns?.find(
              ({ identifier: id }) => id === TaskItemColumn.ASSIGNED,
            )?.columnWidth,
          )}
        </>
      )}
      {isColumnChecked(columns, TaskItemColumn.LIST_NAME) && (
        <>
          {randerFirstColumnCoverIfNecessary(
            <TaskItemCell
              key={`list_${identifier}`}
              width={
                columns?.find(
                  ({ identifier: id }) => id === TaskItemColumn.LIST_NAME,
                )?.columnWidth
              }
              order={getColumnOrder(TaskItemColumn.LIST_NAME)}
            />,
            getColumnOrder(TaskItemColumn.LIST_NAME),
            columns?.find(
              ({ identifier: id }) => id === TaskItemColumn.LIST_NAME,
            )?.columnWidth,
          )}
        </>
      )}
      {columns
        .filter(
          f => f.isChecked && f._customFieldType !== CUSTOM_FIELD_TYPES.REGULAR,
        )
        .map(field => {
          const workflowDetails =
            templateGroup.assignedToUsers || !workFlowData
              ? templateGroup
              : workFlowData;
          const taskCustomFieldValue = workflowDetails?.taskMetaData?.find(
            f => f.customFieldIdentifier === field.identifier,
          );
          const patientCustomFieldValue = workflowDetails?.patient?.patientMetaData?.find(
            f => f.customFieldIdentifier === field.identifier,
          );
          const customFieldValue =
            field.targetType === CUSTOM_FIELD_TYPES.PATIENT
              ? patientCustomFieldValue
              : taskCustomFieldValue;

          const hidePatientCustomFields =
            field.targetType === CUSTOM_FIELD_TYPES.PATIENT &&
            !workflowDetails?.patient?.patientIdentifier;

          return randerFirstColumnCoverIfNecessary(
            <TaskItemCell
              key={`custom_${identifier}_${field.identifier}`}
              width={field.columnWidth}
              order={getColumnOrder(field.identifier)}
            >
              {!hidePatientCustomFields && workflowDetails && (
                <TaskItemCustomField
                  customFieldValue={customFieldValue}
                  onClick={(fieldIdentifier, workflow) => {
                    if (field.targetType === CUSTOM_FIELD_TYPES.PATIENT) return;
                    dispatch(
                      openDrawer(
                        workflow.identifier,
                        workflow,
                        fieldIdentifier,
                      ),
                    );
                  }}
                  field={field}
                  readOnly
                  task={workflowDetails}
                />
              )}
            </TaskItemCell>,
            getColumnOrder(field.identifier),
            field.columnWidth,
          );
        })}
    </TaskTemplateGroupHeaderContainer>
  );
};

export default TaskTemplateGroupHeader;

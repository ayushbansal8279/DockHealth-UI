/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import pluck from 'ramda/src/pluck';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as ListDetailsActions from 'actions/list-details-actions';
import { isTaskSelectedSelector } from 'selectors/task-drawer-selectors';
import {
  listCustomFieldsSelector,
  searchTermSelector,
  taskDetailsSortSelector,
} from 'selectors/list-details-selectors';
import { isTaskItemSelectedSelector } from 'selectors/task-items-selectors';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { organizationCustomFieldsSelector } from 'selectors/organization-selectors';
import { openTaskDrawerWithContent } from 'actions/task-drawer-actions';
import { useParams } from 'react-router-dom';
import * as ModalActions from 'modal/actions';
import * as TaskActions from 'actions/task-actions';
import useActions from 'hooks/use-actions';
import {
  selectTask,
  storeAsCurrentTask,
  chooseTaskDecisionOutcome,
} from 'actions/task-actions';
// eslint-disable-next-line import/no-cycle
import TaskTemplateGroup from 'components/task-template/TaskTemplateGroup/TaskTemplateGroup';
import Circle from 'img/circle.svg';
import CircleCompleted from 'img/circle-completed.svg';
import CircleCompletedHover from 'img/circle-completed-hover.svg';
import ThreeDotsIcon from 'img/three-dots.svg';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
  userHasMultiOrgViewFeatureSelector,
} from 'selectors/user-selectors';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import {
  onTaskAssigned,
  onTaskCompleted,
  onSubtaskCompleted,
  onTaskReActivated,
  onSubtaskReActivated,
  onTaskStatusChanged,
} from 'helpers/ga-event-helper';
import {
  checkIfTemplateTask,
  TaskItemColumn,
  TaskPriority,
  getPriorityColor,
  getPriorityHighlighColor,
  TaskItemColumnWidth,
  isColumnChecked,
  TaskItemType,
  TaskStatus,
  findIncompleteRequiredFields,
  PatientTaskItemColumn,
  TaskOrigin,
} from 'helpers/task-helpers';
import { isMemberAdmin } from 'helpers/list-members-helper';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import DependencyIcon from 'img/dependency-icon.svg';
import DependencyListPopover from 'components/common/DependencyListPopover/DependencyListPopover';
import useBooleanWithTimeout from 'hooks/use-boolean-with-timeout';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import TaskItemCustomField from 'components/common/CustomField/TaskItemCustomField';
import StickyMainTaskItemCell from 'components/task/StickyMainTaskItemCell/StickyMainTaskItemCell';
import TaskItemCell from 'components/task/TaskItemCell/TaskItemCell';
import {
  SINGLE_TASK_RESTRICTIONS_PROFILES,
  SINGLE_TASK_FEATURES,
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import { CUSTOM_FIELD_TYPES } from 'helpers/custom-fields-helpers';
import { Box } from '@mui/material';
import { taskLookupSelector } from 'selectors/task-details-selectors';
import { closeModal, openModal } from 'modal/actions';
import { updatePatientDetails } from 'actions/patient-details-actions';
import { formatPhoneNumber } from 'helpers/utility-functions';
import Tooltip from 'components/common/Tooltip/Tooltip';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getSubtaskStylingLink } from './helpers';
import TaskItemContextMenu from '../TaskItemContextMenu/TaskItemContextMenu';
import TaskItemBulkEdit from './TaskItemComponents/TaskItemBulkEdit';
import TaskItemDescription from './TaskItemComponents/TaskItemDescription';
import TaskItemPatient from './TaskItemComponents/TaskItemPatient';
import TaskItemStartDate from './TaskItemComponents/TaskItemStartDate';
import TaskItemDueDate from './TaskItemComponents/TaskItemDueDate';
import TaskItemDetails from './TaskItemComponents/TaskItemDetails';
import TaskItemCreatedDate from './TaskItemComponents/TaskItemCreatedDate';
import TaskItemCompletedDate from './TaskItemComponents/TaskItemCompletedDate';
import TaskItemElapsedTime from './TaskItemComponents/TaskItemElapsedTime';
import TaskItemSubtasks from './TaskItemComponents/TaskItemSubtasks';
import TaskItemIcons from './TaskItemComponents/TaskItemIcons';
import TaskItemMembers from './TaskItemComponents/TaskItemMembers';
import TaskItemSharedMembers from './TaskItemComponents/TaskItemSharedMembers';
import TaskItemList from './TaskItemComponents/TaskItemList';
import TaskItemOrganization from './TaskItemComponents/TaskItemOrganization';
import TaskItemWorkflowStatus from './TaskItemComponents/TaskItemWorkflowStatus';
import TaskItemDecision from './TaskItemComponents/TaskItemDecision';
import {
  CircleIcon,
  MainStandardTaskItemCell,
  StandardTaskItemContainer,
  StandardTaskItemPanel,
  StandardTaskThreeDots,
  PriorityIndicator,
  DependencyIconContainer,
  DetailsButton,
  DecisionCellContainer,
  ActionIconsContainer,
  PatientMRNAnchor,
  TaskScrollVericleLine,
  TootipCompletedBy,
  TootipCompletedByDate,
  TootipCompletedByName,
} from '../styled';
import TaskItemText from './customFieldsTaskItemComponents/TaskItemText/TaskItemText';
import TaskItemDropdown from './customFieldsTaskItemComponents/TaskItemDropdown/TaskItemDropdown';
import TaskItemDate from './customFieldsTaskItemComponents/TaskItemDate';

import TaskItemComments from './TaskItemComponents/TaskItemComments';
import { megaFilterSelector } from '@/app/selectors/mega-filter-selectors';

const { DISABLED, READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const STANDARD_TASK_HEIGHT = 35;
const EXTENDED_TASK_HEIGHT = 50;

const DotsContainer = ({ showDraggableDots, dragHandleProps }) => {
  if (showDraggableDots)
    return <StandardTaskThreeDots src={ThreeDotsIcon} {...dragHandleProps} />;

  return null;
};
const TaskItem = React.memo(
  ({
    isOpen,
    switchOpen,
    taskItemIdentifier,
    // toggleCompleteTask,
    taskGroupIdentifier,
    dragHandleProps,
    isDragging,
    isCompletedGroup,
    onTaskUpdate,
    updateWorkflowStatus,
    dragAndDropDisabled,
    parentHasPatient,
    highlightedValue,
    isDraggable,
    isLast,
    showSubtaskStylingLink,
    isNestedTask = false,
    subtasksDisabled,
    highlightTasksOfTheSameParent,
    multipleAssigneesContext,
    isDashboardTask,
    openPatientPopover,
    templateBundleIdentifier,
    parentTaskGroupIdentifier,
    isSelectedByHighlighted,
    pageBackground,
    newlyCreated,
    parentContainerReference,
    patient: parentPatient,
    iconColorActive,
    origin,
    viewSetup,
    isTaskTemplate,
    isWorkflowSubtask,
    isLastChild,
  }) => {
    const task = useSelector((state) => {
      return taskLookupSelector(state, origin, taskItemIdentifier);
    });

    const taskWorkflow = templateBundleIdentifier
      ? useSelector((state) => {
          return taskLookupSelector(state, origin, templateBundleIdentifier);
        })
      : null;

    const {
      taskIdentifier,
      assignedToUsers,
      sharedWithUsers,
      creator,
      completedBy,
      completedDt,
      attachments,
      comments,
      labels,
      patient: taskPatient,
      workflowStatus,
      taskList = {},
      organization = {},
      parentTaskIdentifier,
      searchMetaData = {},
      parentTask,
      subtaskQuickAddOpen,
      // selected,
      subTasksCount,
      dependencyTasksCompletedCount,
      dependencyTasksCount,
      hasEscalations,
      priority,
    } = task || {};

    const patient = parentPatient ?? taskPatient ?? parentTask?.patient;

    const { columns } = useTaskListColumnsConfig();
    const { listName, taskListIdentifier } = taskList || {};
    const isTemplateTask = checkIfTemplateTask(task);
    const isSubtask = !!parentTaskIdentifier;
    const isDecisionTask = task?.intentType === 'DECISION';
    const isDecisionSelected = task?.taskOutcomes?.reduce(
      (accumulator, currentValue) => accumulator || currentValue.isSelected,
      false,
    );

    const [isCompleted, setIsCompleted] = useState(false);
    useEffect(() => {
      if (task?.status === 'COMPLETE') {
        setIsCompleted(true);
      }
    }, [task]);

    const actions = useActions(TaskActions);
    const modalActions = useActions(ModalActions);

    const isTaskStatusTogglingDisabled =
      isTemplateTask ||
      (isSubtask && isCompletedGroup) ||
      (isDecisionTask && !isDecisionSelected);

    const isDependencyEmptyOrCompleted =
      dependencyTasksCount === dependencyTasksCompletedCount;

    const userHasMultiOrgViewAvailable = useSelector(
      userHasMultiOrgViewFeatureSelector,
    );

    const {
      matchAssignedTo,
      matchAttachments,
      matchComments,
      matchLabels,
      matchPatient,
      matchPatientMRN,
      matchWorkflowStatus,
    } = searchMetaData;

    const searchValue = useSelector(searchTermSelector);
    const megaFilter = useSelector(megaFilterSelector);
    const { selectedFilters } = megaFilter || {};
    const currentUser = useSelector(userProfileSelector);
    let restrictions =
      SINGLE_TASK_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
    let taskListRestrictions =
      TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];

    const isTaskBulkSelected = useSelector(
      isTaskItemSelectedSelector(taskIdentifier),
    );
    const isSelected =
      useSelector((state) => isTaskSelectedSelector(state, taskIdentifier)) ||
      isSelectedByHighlighted ||
      isTaskBulkSelected;

    const [taskDecisionError, setTaskDecisionError] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const dispatch = useDispatch();
    const dependencyIconReference = useRef(null);
    const [isEditingDescription, setEditingDescription] = useState(false);
    const [
      dependencyPopoverOpen,
      openDependencyPopover,
      closeDependencyPopover,
    ] = useBooleanWithTimeout(false);
    const [isCellHover, setCellHover] = useState({
      dueDate: false,
      startDate: false,
      assignee: false,
      comment: false,
      label: false,
      file: false,
      share: false,
      task: false,
    });
    const { move, duplicate, subtasks, delete: del } = SINGLE_TASK_FEATURES;
    const organizationCustomFields = useSelector(
      organizationCustomFieldsSelector,
    );
    const listCustomFields = useSelector(listCustomFieldsSelector);
    const taskCustomFields = organizationCustomFields
      ? organizationCustomFields.concat(listCustomFields)
      : listCustomFields;

    const showContextMenu = [move, duplicate, subtasks, del].reduce(
      (accumulator, element) => {
        if (accumulator) return accumulator;
        return !(
          restrictions?.[element] === DISABLED ||
          restrictions?.[element] === READ_ONLY
        );
      },
      false,
    );

    const { bulkEditEnabled } = useContext(BulkEditContext);

    const selectedOrganization = useSelector(selectedUserOrganizationSelector);
    const currentTasklist = useSelector(currentTaskListSelector);
    const sort = useSelector(taskDetailsSortSelector);
    const emrPatientLink = selectedOrganization?.emrPatientLink;

    const customHighlightColor = useMemo(() => {
      const customHighlightItem =
        selectedOrganization?.themeSettings?.find(
          ({ name }) =>
            name === `list.taskgroup.highlight.color-${taskGroupIdentifier}`,
        ) || {};
      return customHighlightItem?.value || '';
    }, [selectedOrganization, taskGroupIdentifier]);

    const hasPriorityHighlight = useMemo(() => {
      const hasPriorityHighlightItem =
        selectedOrganization?.themeSettings?.find(
          ({ name }) => name === 'list.tasks.priority.highlighting.enabled',
        ) || {};
      return (
        hasPriorityHighlightItem && hasPriorityHighlightItem?.value === 'true'
      );
    }, [selectedOrganization]);

    const isListAdmin = useMemo(() => {
      const currentUserMember = currentTasklist?.listUsers?.find(
        (u) => u.identifier === currentUser?.identifier,
      );
      const isOwnerOrAdmin = checkIfUserIsOrganizationAdmin(currentUser);
      return isMemberAdmin(currentUserMember) || isOwnerOrAdmin;
    }, [currentUser, currentTasklist]);

    const isCreator = useMemo(() => {
      return (
        (!templateBundleIdentifier || templateBundleIdentifier === '') &&
        creator?.identifier === currentUser?.identifier
      );
    }, [templateBundleIdentifier, creator, currentUser]);

    if (!restrictions) {
      restrictions = {};
    }
    if (!taskListRestrictions) {
      taskListRestrictions = {};
    }
    const setConfig = (
      themeSettingName,
      restrictionsConfig,
      configName,
      configValue,
    ) => {
      const enabledItem =
        selectedOrganization?.themeSettings?.find(
          ({ name }) => name === themeSettingName,
        ) || {};
      const enabledValue =
        enabledItem &&
        enabledItem?.value === 'false' &&
        !isListAdmin &&
        !isCreator;

      if (enabledValue) {
        // eslint-disable-next-line no-param-reassign
        restrictionsConfig[configName] = configValue;
      }
    };
    setConfig(
      'list.tasks.member.delete.enabled',
      restrictions,
      'delete',
      DISABLED,
    );
    setConfig(
      'list.tasks.member.move.list.enabled',
      restrictions,
      'move',
      DISABLED,
    );
    setConfig(
      'list.tasks.member.duplicate.enabled',
      restrictions,
      'duplicate',
      DISABLED,
    );
    setConfig(
      'list.tasks.member.edit.assignment.enabled',
      restrictions,
      'assigment',
      READ_ONLY,
    );
    setConfig(
      'list.tasks.member.edit.duedate.enabled',
      restrictions,
      'dueDate',
      DISABLED,
    );
    setConfig(
      'list.tasks.member.edit.description.enabled',
      restrictions,
      'description',
      DISABLED,
    );
    setConfig(
      'list.tasks.member.edit.patient.enabled',
      restrictions,
      'patient',
      DISABLED,
    );
    setConfig(
      'list.tasks.member.edit.status.enabled',
      restrictions,
      'status',
      DISABLED,
    );
    setConfig(
      'list.tasks.member.edit.priority.enabled',
      restrictions,
      'priority',
      DISABLED,
    );
    setConfig(
      'list.tasks.member.edit.labels.enabled',
      restrictions,
      'labels',
      DISABLED,
    );
    setConfig(
      'list.tasks.member.edit.subtasks.enabled',
      restrictions,
      'subtasks',
      DISABLED,
    );

    const nonAssigneeCompleteDisabled = useMemo(() => {
      const nonAssigneeCompleteDisabledItem =
        selectedOrganization?.themeSettings?.find(
          ({ name }) => name === 'list.tasks.non-assignee.complete.enabled',
        ) || {};
      return (
        nonAssigneeCompleteDisabledItem &&
        nonAssigneeCompleteDisabledItem?.value === 'false' &&
        assignedToUsers?.filter((user) =>
          user.itemType === 'USER'
            ? user.identifier === currentUser.identifier
            : user?.users?.filter(
                (u) => u.identifier === currentUser.identifier,
              ).length !== 0,
        ).length === 0 &&
        !isListAdmin &&
        !isCreator
      );
    }, [
      assignedToUsers,
      currentUser,
      selectedOrganization,
      isListAdmin,
      isCreator,
    ]);
    if (nonAssigneeCompleteDisabled) {
      taskListRestrictions.completeTask = DISABLED;
    }

    const customHighlight =
      // eslint-disable-next-line unicorn/no-negated-condition
      customHighlightColor !== ''
        ? customHighlightColor
        : // eslint-disable-next-line unicorn/no-nested-ternary
        hasPriorityHighlight
        ? getPriorityHighlighColor(priority)
        : undefined;

    const onSubtaskLabelClick = useCallback(
      (event) => {
        event.stopPropagation();
        if (origin !== TaskOrigin.DASHBOARD) {
          if (subtasksDisabled) {
            highlightTasksOfTheSameParent(
              task?.parentTaskIdentifier || task?.taskIdentifier,
            );
          } else if (isOpen) {
            // eslint-disable-next-line sonarjs/no-gratuitous-expressions
            switchOpen(!isOpen);
          } else {
            switchOpen(true);
          }
        }
      },
      [
        subtasksDisabled,
        isOpen,
        switchOpen,
        highlightTasksOfTheSameParent,
        task?.parentTaskIdentifier,
        task?.taskIdentifier,
      ],
    );

    const [isPatientDataReadOnly] = useState(true);

    const handlePatientUpdate = useCallback(
      (field) => (value) => {
        if (patient) {
          const patientIdentifier = patient?.patientIdentifier;
          dispatch(updatePatientDetails(patientIdentifier, { [field]: value }));
        }
      },
      [dispatch, patient],
    );

    const handleTaskItemRightClick = useCallback(
      (event) => {
        event.preventDefault();
        if (showContextMenu) {
          setContextMenu({ x: event.pageX, y: event.pageY });
          dispatch(storeAsCurrentTask(task));
        }
      },
      [dispatch, showContextMenu, task],
    );

    useEffect(() => {
      if (parentContainerReference?.current && newlyCreated) {
        parentContainerReference.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start',
        });
      }
    }, [newlyCreated, parentContainerReference]);

    const onClickTaskItem = useCallback(
      () =>
        dispatch(
          openTaskDrawerWithContent(
            templateBundleIdentifier
              ? {
                  ...task,
                  taskGroupIdentifier: parentTaskGroupIdentifier,
                  templateBundleIdentifier,
                }
              : task,
          ),
        ),
      [dispatch, parentTaskGroupIdentifier, task, templateBundleIdentifier],
    );

    const refreshTab = useCallback(
      (withLoader = false) => {
        dispatch(ListDetailsActions.getCurrentTaskListFilterOptions());
        dispatch(
          ListDetailsActions.getListDetailsTaskCounters(taskListIdentifier),
        );
        dispatch(ListDetailsActions.refreshListDetailsGroupedTasks(withLoader));
      },
      [dispatch, taskListIdentifier],
    );

    const invokeToggleCompleteAction = useCallback(
      // eslint-disable-next-line no-shadow
      (task) => {
        actions
          .toggleCompleteTask(task, currentUser)
          .then(() => {
            setTimeout(() => {
              dispatch(
                ListDetailsActions.getListDetailsTaskCounters(
                  taskListIdentifier,
                ),
              );
              dispatch(ListDetailsActions.getTasksGroupsList());
            }, TASK_DISAPPEAR_DELAY);
          })
          .catch(() => refreshTab());
      },
      [actions, currentUser, dispatch, taskListIdentifier, refreshTab],
    );

    const toggleCompleteTask = useCallback(
      // eslint-disable-next-line no-shadow
      (task) => {
        const incompleteRequiredFields = findIncompleteRequiredFields(
          taskCustomFields,
          task,
        );
        const isRequiredFieldsAreIncomplete =
          incompleteRequiredFields?.length > 0;

        if (isRequiredFieldsAreIncomplete) {
          const modalProps = {
            incompleteFields: incompleteRequiredFields,
          };
          modalActions.openModal('CompleteAllFields', modalProps);
          return;
        }

        const hasIncompletedSubtasks =
          task?.subtasks?.length > 0
            ? task?.subtasks.find((subtask) => subtask.status === 'INCOMPLETE')
            : task?.subTasksCount - task?.subTasksCompletedCount > 0;

        if (task?.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
          const modalProps = {
            confirm: () => {
              modalActions.closeModal();
              invokeToggleCompleteAction(task);
            },
          };
          modalActions.openModal('CompleteAllTasks', modalProps);
        } else {
          setIsCompleted(!isCompleted);
          invokeToggleCompleteAction(task);
        }
      },
      [invokeToggleCompleteAction, isCompleted, modalActions, taskCustomFields],
    );
    const handlePriorityChange = useCallback(
      (taskPriority) => {
        onTaskUpdate(taskIdentifier, {
          priority: taskPriority?.toUpperCase() || TaskPriority.LOW,
        });
      },
      [onTaskUpdate, taskIdentifier],
    );

    const onCircleClick = useCallback(
      (event) => {
        if (!isTaskStatusTogglingDisabled && isDependencyEmptyOrCompleted) {
          setTaskDecisionError(false);
          toggleCompleteTask({ ...task, templateBundleIdentifier });
          if (isSubtask) {
            (isCompleted ? onSubtaskReActivated : onSubtaskCompleted)();
          } else {
            (isCompleted ? onTaskReActivated : onTaskCompleted)();
          }
        } else if (!isDecisionSelected) {
          setTaskDecisionError(true);
        }

        event.stopPropagation();
      },
      [
        templateBundleIdentifier,
        isTaskStatusTogglingDisabled,
        isSubtask,
        isCompleted,
        toggleCompleteTask,
        task,
        isDependencyEmptyOrCompleted,
        isDecisionSelected,
      ],
    );

    const handleReasignTask = useCallback(
      (selectedMembers) => {
        onTaskUpdate(taskIdentifier, {
          assignedToUsers: selectedMembers,
          assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
        });
        onTaskAssigned();
      },
      [onTaskUpdate, taskIdentifier],
    );

    const handleSharingTask = useCallback(
      (selectedMembers) => {
        const userIdentifiers = pluck('userIdentifier', selectedMembers);
        dispatch(TaskActions.shareTask(taskIdentifier, userIdentifiers));
      },
      [dispatch, taskIdentifier],
    );

    const handleUpdateWorkflowStatus = useCallback(
      (value) => {
        updateWorkflowStatus(task, value);
        onTaskStatusChanged(value);
      },
      [updateWorkflowStatus, task],
    );

    const showPriority = task?.priority && task?.priority !== TaskPriority.NONE;
    const showDecisionRow = task?.intentType === 'DECISION' && !isTemplateTask;
    const hasParentTaskLabel = isSubtask && !isNestedTask && !!parentTask;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onClickBulkEdit = () =>
      dispatch(selectTask(taskIdentifier, !isTaskBulkSelected));
    const onCloseContextMenu = () => {
      setContextMenu(null);
      dispatch(storeAsCurrentTask(null));
    };

    const getColumnOrder = useCallback(
      (TaskItemColumnType) =>
        columns?.findIndex((c) => c.identifier === TaskItemColumnType),
      [columns],
    );

    const handleDecisionOutcomeSelection = useCallback(
      (targetValue, taskItem, templateBundleIdentifierItem, onSuccess) => {
        const incompleteRequiredFields = findIncompleteRequiredFields(
          taskCustomFields,
          task,
        );
        const isRequiredFieldsAreIncomplete =
          incompleteRequiredFields.length > 0;

        if (isRequiredFieldsAreIncomplete) {
          const modalProps = {
            incompleteFields: incompleteRequiredFields,
          };
          dispatch(openModal('CompleteAllFields', modalProps));
          return;
        }

        if (taskItem.subTasksCompletedCount === taskItem.subTasksCount) {
          dispatch(
            chooseTaskDecisionOutcome(
              targetValue,
              taskItem,
              templateBundleIdentifierItem,
            ),
          );
          onSuccess();
        } else {
          dispatch(
            openModal('CompleteAllTasks', {
              confirm: () => {
                dispatch(closeModal());
                dispatch(
                  chooseTaskDecisionOutcome(
                    targetValue,
                    taskItem,
                    templateBundleIdentifierItem,
                  ),
                );
                onSuccess();
              },
            }),
          );
        }
      },
      [dispatch, task, taskCustomFields],
    );

    const [showCircleIconOnHover, setShowCircleIconOnHover] = useState(false);
    const [tooltipsOpen, setTooltipsOpen] = useState(false);

    const handleTooltipClose = () => {
      setTooltipsOpen(false);
    };

    const handleTooltipOpen = () => {
      setTooltipsOpen(true);
    };

    const randerFirstColumnCoverIfNecessary = useCallback(
      (content, order) => {
        if (order !== 0) return content;
        return (
          <StickyMainTaskItemCell
            isLastChild={isLastChild}
            isWorkflowtask={isTaskTemplate}
            customWidthExists
            order={0}
            isSubtask={
              origin === TaskOrigin.PATIENT ? showSubtaskStylingLink : isSubtask
            }
            newlyCreated={newlyCreated}
            backgroundColor={pageBackground}
            isSelected={isSelected}
            hasEscalations={hasEscalations}
            customHighlight={customHighlight}
            isEditingDescription={isEditingDescription}
            isWorkflowSubtask={isWorkflowSubtask}
            origin={origin}
            searchValue={!!searchValue}
            isFilterApply={
              !!selectedFilters
                ? Object.keys(selectedFilters).length > 0
                : !!selectedFilters
            }
            isSortApplied={!!sort.key}
          >
            {taskListRestrictions?.createTask !== DISABLED && (
              <DotsContainer
                showDraggableDots={true}
                dragHandleProps={dragHandleProps}
              />
            )}
            {showPriority && (
              <PriorityIndicator color={getPriorityColor(task?.priority)} />
            )}
            {showSubtaskStylingLink && getSubtaskStylingLink(isLast)}
            <ActionIconsContainer>
              {taskListRestrictions?.createTask !== DISABLED &&
                bulkEditEnabled && (
                  <TaskItemBulkEdit
                    isChecked={isSelected}
                    onClick={onClickBulkEdit}
                  />
                )}
              <Box ml="10px" />
              <Tooltip
                placement={isCompleted ? 'bottom' : 'top'}
                title={
                  isCompleted ? (
                    <>
                      <TootipCompletedBy>Completed by</TootipCompletedBy>
                      <TootipCompletedByName>
                        {`${task?.completedBy?.firstName} ${task?.completedBy?.lastName}`}
                      </TootipCompletedByName>
                      <TootipCompletedByDate>
                        {`${new Date(task.completedDt).toLocaleString('en-US', {
                          weekday: 'long',
                        })}, ${moment(task.completedDt).format(
                          'MMM DD, YYYY',
                        )} @${new Date(task.completedDt)
                          .toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })
                          .toLowerCase()}`}
                      </TootipCompletedByDate>
                    </>
                  ) : (
                    'Complete task'
                  )
                }
                open={tooltipsOpen}
                onClose={() => handleTooltipClose()}
              >
                <CircleIcon
                  src={
                    isCompleted
                      ? CircleCompleted
                      : showCircleIconOnHover
                      ? CircleCompletedHover
                      : Circle
                  }
                  onMouseEnter={() => {
                    setShowCircleIconOnHover(true);
                    handleTooltipOpen();
                  }}
                  onMouseLeave={() => {
                    setShowCircleIconOnHover(false);
                    handleTooltipClose();
                  }}
                  isClickable={
                    !isTaskStatusTogglingDisabled &&
                    isDependencyEmptyOrCompleted &&
                    taskListRestrictions?.completeTask !== DISABLED
                  }
                  isCompleted={isCompleted}
                  onClick={
                    // eslint-disable-next-line unicorn/no-negated-condition
                    taskListRestrictions?.completeTask !== DISABLED
                      ? onCircleClick
                      : () => {}
                  }
                />
              </Tooltip>
              {/* </Tooltip> */}
            </ActionIconsContainer>
            {content}
            <TaskScrollVericleLine>&nbsp;</TaskScrollVericleLine>
          </StickyMainTaskItemCell>
        );
      },
      [
        showSubtaskStylingLink,
        newlyCreated,
        pageBackground,
        isSelected,
        hasEscalations,
        customHighlight,
        isEditingDescription,
        taskListRestrictions?.createTask,
        taskListRestrictions?.completeTask,
        dragHandleProps,
        showPriority,
        task?.priority,
        isLast,
        bulkEditEnabled,
        onClickBulkEdit,
        isCompleted,
        isTaskStatusTogglingDisabled,
        isDependencyEmptyOrCompleted,
        onCircleClick,
      ],
    );

    const descriptionColumnOrder = getColumnOrder(TaskItemColumn.DESCRIPTION);
    const { tabName } = useParams();
    const isCompletedView = tabName?.toUpperCase() === TaskStatus.COMPLETE;

    const iconColorActiveItem = useMemo(
      () =>
        selectedOrganization?.themeSettings?.find(
          ({ name }) => name === 'icon.active.color',
        ) || {},
      [selectedOrganization?.themeSettings],
    );

    if (task?.itemType !== TaskItemType.TASK) {
      const taskGroup = task;
      return (
        <TaskTemplateGroup
          isCompletedTab={isCompletedView}
          viewSetup={viewSetup}
          // isStartedDnD={draggedId === taskGroup?.identifier}
          isStartedDnD={false}
          dragHandleProps={dragHandleProps}
          templateGroup={taskGroup}
          groupHasMultipleAssignees={false}
          isFullView={false}
          dragAndDropDisabled={isCompletedGroup || dragAndDropDisabled}
          iconColorActive={iconColorActiveItem?.value}
          origin={origin}
          highlightedValue={highlightedValue}
          pageBackground={pageBackground}
        />
      );
    }

    return (
      <>
        <StandardTaskItemPanel
          onContextMenu={handleTaskItemRightClick}
          isDragging={isDragging}
          isWorkflowtask={isTaskTemplate}
          isWorkflowSubtask={isWorkflowSubtask}
        >
          <StandardTaskItemContainer
            isTaskTemplate={isTaskTemplate}
            isLastChild={isLastChild}
            newlyCreated={newlyCreated}
            isSelected={isSelected}
            hasEscalations={hasEscalations}
            customHighlight={customHighlight}
            height={
              hasParentTaskLabel || isCompletedGroup
                ? EXTENDED_TASK_HEIGHT
                : STANDARD_TASK_HEIGHT
            }
            isAddingTask={false}
            iconColorActive={iconColorActive}
            taskIdentifier={task?.identifier}
            origin={origin}
          >
            {randerFirstColumnCoverIfNecessary(
              <>
                <MainStandardTaskItemCell
                  width={
                    columns?.find(
                      ({ identifier }) =>
                        identifier === TaskItemColumn.DESCRIPTION,
                    )?.columnWidth -
                    (isSubtask &&
                    (origin === 'LIST' &&
                    ((!!selectedFilters
                      ? Object.keys(selectedFilters).length > 0
                      : !!selectedFilters) ||
                      !!searchValue ||
                      !!sort.key)
                      ? hasParentTaskLabel
                      : !hasParentTaskLabel) &&
                    descriptionColumnOrder === 0
                      ? 36
                      : 0)
                  }
                  order={getColumnOrder(TaskItemColumn.DESCRIPTION)}
                  bolded
                  paddingLeft="smallPlus"
                  paddingRight="small"
                  onClick={onClickTaskItem}
                  position="static"
                  isSubtask={isSubtask}
                  isSticky
                  printWidth={300}
                  onMouseEnter={() => setCellHover({ task: true })}
                  onMouseLeave={() => setCellHover({ task: false })}
                >
                  {!isDependencyEmptyOrCompleted && (
                    <>
                      <DependencyIconContainer
                        onMouseEnter={openDependencyPopover}
                        onMouseLeave={closeDependencyPopover}
                        ref={dependencyIconReference}
                      >
                        <img src={DependencyIcon} alt="search" />
                        {dependencyIconReference.current && (
                          <DependencyListPopover
                            anchorEl={dependencyIconReference.current}
                            open={dependencyPopoverOpen}
                            dependencyTasksCount={dependencyTasksCount}
                            task={task}
                          />
                        )}
                      </DependencyIconContainer>
                    </>
                  )}
                  <TaskItemDescription
                    isHover={isCellHover.task}
                    disableMentions={restrictions?.mentions === DISABLED}
                    disabled={restrictions?.description === READ_ONLY}
                    task={task}
                    isCompletedGroup={isCompletedGroup}
                    highlightedValue={highlightedValue}
                    isSubtask={isSubtask}
                    isEditing={isEditingDescription}
                    setEditing={setEditingDescription}
                    isEditButtonVisible
                    hasParentTaskLabel={hasParentTaskLabel}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.DESCRIPTION,
                      )?.columnWidth -
                      100 -
                      (isSubtask &&
                      !hasParentTaskLabel &&
                      descriptionColumnOrder === 0
                        ? 50
                        : 0) -
                      (isSubtask ? 0 : 50) -
                      (showDecisionRow ? 200 : 0)
                    }
                  />
                  {!isSubtask && (
                    <TaskItemSubtasks
                      isSubtask={isSubtask}
                      subtaskQuickAddOpen={subtaskQuickAddOpen}
                      subtasksDisabled={subtasksDisabled}
                      subTasksCount={subTasksCount}
                      isOpen={isOpen}
                      isNestedTask={isNestedTask}
                      onSubtaskLabelClick={onSubtaskLabelClick}
                      taskIdentifier={taskIdentifier}
                      openQuickAddSubtask={TaskActions.openQuickAddSubtask}
                      dispatch={dispatch}
                      readOnly={restrictions?.subtasks === READ_ONLY}
                      origin={origin}
                    />
                  )}
                  <Tooltip placement="top" title="Details">
                    <DetailsButton onClick={onClickTaskItem}>
                      <ChevronRightIcon />
                    </DetailsButton>
                  </Tooltip>
                  {showDecisionRow && (
                    <DecisionCellContainer
                      onClick={(event) => event.stopPropagation()}
                    >
                      <TaskItemDecision
                        outcomes={task?.taskOutcomes}
                        onSelect={handleDecisionOutcomeSelection}
                        task={task}
                        templateBundleIdentifier={templateBundleIdentifier}
                        disabled={isCompleted || !isDependencyEmptyOrCompleted}
                        error={taskDecisionError}
                        clearError={() => setTaskDecisionError(false)}
                        iconColorActive={iconColorActive}
                      />
                    </DecisionCellContainer>
                  )}
                </MainStandardTaskItemCell>
              </>,
              getColumnOrder(TaskItemColumn.DESCRIPTION),
            )}

            {isColumnChecked(columns, TaskItemColumn.PATIENT) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`patient_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.PATIENT,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.PATIENT)}
                  >
                    <TaskItemPatient
                      highlightedValue={highlightedValue}
                      taskStatus={task?.status}
                      isSubtask={isSubtask}
                      parentHasPatient={parentHasPatient}
                      hasParentTaskLabel={hasParentTaskLabel}
                      matchPatientMRN={matchPatientMRN}
                      patient={patient || parentTask?.patient || parentPatient}
                      matchPatient={matchPatient}
                      task={task}
                      openPatientPopover={openPatientPopover}
                      onTaskUpdate={onTaskUpdate}
                      currentUser={currentUser}
                      readOnly={restrictions?.patient === READ_ONLY}
                      origin={origin}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.PATIENT),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.PRIORITY) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`priority_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.PRIORITY,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.PRIORITY)}
                  >
                    <TaskItemDropdown
                      value={task?.priority}
                      onChange={handlePriorityChange}
                      field={{
                        options: [
                          { identifier: 'HIGH', name: 'High', tag: 'High' },
                          { identifier: 'LOW', name: 'No Priority', tag: '' },
                        ],
                        displayOptions: [],
                      }}
                      readOnly={false}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.PRIORITY),
                )}
              </>
            )}
            {isColumnChecked(columns, PatientTaskItemColumn.GENDER) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`gender_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === PatientTaskItemColumn.GENDER,
                      )?.columnWidth
                    }
                    order={getColumnOrder(PatientTaskItemColumn.GENDER)}
                  >
                    <TaskItemDropdown
                      readOnly={isPatientDataReadOnly}
                      value={patient?.gender}
                      onChange={handlePatientUpdate('gender')}
                      field={{
                        options: [
                          {
                            identifier: 'male',
                            name: 'male',
                            color: '#00A2E5',
                          },
                          {
                            identifier: 'female',
                            name: 'female',
                            color: '#00A2E5',
                          },
                        ],
                        displayOptions: ['TASK_REQUIRED'],
                      }}
                    />
                  </TaskItemCell>,
                  getColumnOrder(PatientTaskItemColumn.GENDER),
                )}
              </>
            )}
            {isColumnChecked(columns, PatientTaskItemColumn.DOB) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`patient_dob_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === PatientTaskItemColumn.DOB,
                      )?.columnWidth
                    }
                    order={getColumnOrder(PatientTaskItemColumn.DOB)}
                  >
                    <TaskItemDate
                      value={patient?.dob}
                      onChange={handlePatientUpdate('dob')}
                      readOnly={isPatientDataReadOnly}
                    />
                  </TaskItemCell>,
                  getColumnOrder(PatientTaskItemColumn.DOB),
                )}
              </>
            )}
            {isColumnChecked(columns, PatientTaskItemColumn.EMAIL) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`patient_email_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === PatientTaskItemColumn.EMAIL,
                      )?.columnWidth
                    }
                    order={getColumnOrder(PatientTaskItemColumn.EMAIL)}
                  >
                    <TaskItemText
                      readOnly={isPatientDataReadOnly}
                      value={patient?.email}
                      onChange={handlePatientUpdate('email')}
                    />
                  </TaskItemCell>,
                  getColumnOrder(PatientTaskItemColumn.EMAIL),
                )}
              </>
            )}
            {isColumnChecked(columns, PatientTaskItemColumn.MRN) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`patient_MRN_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === PatientTaskItemColumn.MRN,
                      )?.columnWidth
                    }
                    order={getColumnOrder(PatientTaskItemColumn.MRN)}
                  >
                    {emrPatientLink && (
                      <PatientMRNAnchor
                        href={emrPatientLink?.replace('{mrn}', patient?.mrn)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {patient?.mrn}
                      </PatientMRNAnchor>
                    )}
                    {!emrPatientLink && <span>{patient?.mrn}</span>}
                  </TaskItemCell>,
                  getColumnOrder(PatientTaskItemColumn.MRN),
                )}
              </>
            )}
            {isColumnChecked(columns, PatientTaskItemColumn.MOBILE_PHONE) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`patient_mobile_phone_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === PatientTaskItemColumn.MOBILE_PHONE,
                      )?.columnWidth
                    }
                    order={getColumnOrder(PatientTaskItemColumn.MOBILE_PHONE)}
                  >
                    <TaskItemText
                      readOnly={isPatientDataReadOnly}
                      value={formatPhoneNumber(patient?.phoneMobile ?? '')}
                      onChange={handlePatientUpdate('phoneMobile')}
                    />
                  </TaskItemCell>,
                  getColumnOrder(PatientTaskItemColumn.MOBILE_PHONE),
                )}
              </>
            )}
            {isColumnChecked(columns, PatientTaskItemColumn.HOME_PHONE) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`patient_home_phone_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === PatientTaskItemColumn.HOME_PHONE,
                      )?.columnWidth
                    }
                    order={getColumnOrder(PatientTaskItemColumn.HOME_PHONE)}
                  >
                    <TaskItemText
                      readOnly={isPatientDataReadOnly}
                      value={formatPhoneNumber(patient?.phoneHome ?? '')}
                      onChange={handlePatientUpdate('phoneHome')}
                    />
                  </TaskItemCell>,
                  getColumnOrder(PatientTaskItemColumn.HOME_PHONE),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.WORKFLOW_STATUS) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    key={`task_status_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.WORKFLOW_STATUS,
                      )?.columnWidth
                    }
                    paddingLeft="smallPlus"
                    paddingRight="tiny"
                    onContextMenu={(event) => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.WORKFLOW_STATUS)}
                  >
                    <TaskItemWorkflowStatus
                      task={task}
                      updateWorkflowStatus={handleUpdateWorkflowStatus}
                      workflowStatus={workflowStatus}
                      matchWorkflowStatus={matchWorkflowStatus}
                      highlightedValue={highlightedValue}
                      showDefaultTaskStatusCompleted={
                        selectedOrganization?.showDefaultTaskStatusCompleted
                      }
                      readOnly={restrictions?.status === READ_ONLY}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.WORKFLOW_STATUS),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.COMMENTS) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`comments_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.COMMENTS,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.COMMENTS)}
                    onMouseEnter={() => setCellHover({ comment: true })}
                    onMouseLeave={() => setCellHover({ comment: false })}
                  >
                    <TaskItemComments
                      isCommentHover={isCellHover.comment}
                      matchComments={matchComments}
                      comments={comments}
                      task={task}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.COMMENTS),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.LABELS) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`labels_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.LABELS,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.LABELS)}
                    onMouseEnter={() => setCellHover({ label: true })}
                    onMouseLeave={() => setCellHover({ label: false })}
                  >
                    <TaskItemIcons
                      isHover={isCellHover}
                      restrictions={restrictions}
                      task={task}
                      matchLabels={matchLabels}
                      labels={labels}
                      dispatch={dispatch}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.LABELS),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.FILES) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`files_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) => identifier === TaskItemColumn.FILES,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.FILES)}
                    onMouseEnter={() => setCellHover({ file: true })}
                    onMouseLeave={() => setCellHover({ file: false })}
                  >
                    <TaskItemIcons
                      isHover={isCellHover}
                      restrictions={restrictions}
                      task={task}
                      matchAttachments={matchAttachments}
                      attachments={attachments}
                      dispatch={dispatch}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.FILES),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.START_DATE) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`start_date_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.START_DATE,
                      )?.columnWidth
                    }
                    paddingLeft="12px"
                    paddingRight="tiny"
                    justify="flex-start"
                    onContextMenu={(event) => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.START_DATE)}
                    onMouseEnter={() => setCellHover({ startDate: true })}
                    onMouseLeave={() => setCellHover({ startDate: false })}
                  >
                    <TaskItemStartDate
                      task={task}
                      disabled={restrictions?.startDate === DISABLED}
                      isDateHover={isCellHover.startDate}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.START_DATE),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.DUE_DATE) &&
              !isTemplateTask && (
                <>
                  {randerFirstColumnCoverIfNecessary(
                    <TaskItemCell
                      isSubtask={isSubtask}
                      key={`due_date_${taskIdentifier}`}
                      width={
                        columns?.find(
                          ({ identifier }) =>
                            identifier === TaskItemColumn.DUE_DATE,
                        )?.columnWidth
                      }
                      paddingLeft="12px"
                      paddingRight="tiny"
                      justify="flex-start"
                      onContextMenu={(event) => {
                        event.stopPropagation();
                      }}
                      order={getColumnOrder(TaskItemColumn.DUE_DATE)}
                      onMouseEnter={() => setCellHover({ dueDate: true })}
                      onMouseLeave={() => setCellHover({ dueDate: false })}
                    >
                      <TaskItemDueDate
                        task={task}
                        disabled={restrictions?.dueDate === DISABLED}
                        isDateHover={isCellHover.dueDate}
                      />
                    </TaskItemCell>,
                    getColumnOrder(TaskItemColumn.DUE_DATE),
                  )}
                </>
              )}
            {isColumnChecked(columns, TaskItemColumn.ANCHOR_DATE) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.ANCHOR_DATE,
                      )?.columnWidth
                    }
                    onContextMenu={(event) => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.ANCHOR_DATE)}
                  />,
                  getColumnOrder(TaskItemColumn.ANCHOR_DATE),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.ASSIGNED) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`assigned_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.ASSIGNED,
                      )?.columnWidth
                    }
                    // eslint-disable-next-line sonarjs/no-duplicate-string
                    paddingLeft="12px"
                    paddingRight="small"
                    onContextMenu={(event) => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.ASSIGNED)}
                    printWidth={
                      TaskItemColumnWidth[TaskItemColumn.ASSIGNED].PRINT
                    }
                    onMouseEnter={() => setCellHover({ assignee: true })}
                    onMouseLeave={() => setCellHover({ assignee: false })}
                  >
                    <TaskItemMembers
                      isAssigneeHover={isCellHover.assignee}
                      readOnly={restrictions?.assigment === READ_ONLY}
                      multipleAssigneesContext={multipleAssigneesContext}
                      task={task}
                      assignedToUsers={assignedToUsers}
                      handleReasignTask={handleReasignTask}
                      matchAssignedTo={matchAssignedTo}
                      additionalUsers={sharedWithUsers || []}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.ASSIGNED),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.SHARED) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`shared_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.SHARED,
                      )?.columnWidth
                    }
                    // eslint-disable-next-line sonarjs/no-duplicate-string
                    paddingLeft="12px"
                    paddingRight="small"
                    onContextMenu={(event) => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.SHARED)}
                    printWidth={
                      TaskItemColumnWidth[TaskItemColumn.SHARED].PRINT
                    }
                    onMouseEnter={() => setCellHover({ share: true })}
                    onMouseLeave={() => setCellHover({ share: false })}
                  >
                    <TaskItemSharedMembers
                      isHover={isCellHover.share}
                      readOnly={restrictions?.assigment === READ_ONLY}
                      multipleAssigneesContext={multipleAssigneesContext}
                      task={task}
                      sharedWithUsers={sharedWithUsers}
                      handleSharingTask={handleSharingTask}
                      matchAssignedTo={matchAssignedTo}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.SHARED),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.CREATED_BY) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`created_by_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.CREATED_BY,
                      )?.columnWidth
                    }
                    paddingLeft="12px"
                    paddingRight="small"
                    onContextMenu={(event) => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.CREATED_BY)}
                    printWidth={
                      TaskItemColumnWidth[TaskItemColumn.CREATED_BY].PRINT
                    }
                  >
                    <TaskItemMembers
                      readOnly
                      multipleAssigneesContext={multipleAssigneesContext}
                      task={task}
                      assignedToUsers={[creator]}
                      handleReasignTask={null}
                      matchAssignedTo={matchAssignedTo}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.CREATED_BY),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.CREATED_DATE) &&
              !isTemplateTask && (
                <>
                  {randerFirstColumnCoverIfNecessary(
                    <TaskItemCell
                      isSubtask={isSubtask}
                      key={`created_date_${taskIdentifier}`}
                      width={
                        columns?.find(
                          ({ identifier }) =>
                            identifier === TaskItemColumn.CREATED_DATE,
                        )?.columnWidth
                      }
                      paddingLeft="12px"
                      paddingRight="tiny"
                      onContextMenu={(event) => {
                        event.stopPropagation();
                      }}
                      order={getColumnOrder(TaskItemColumn.CREATED_DATE)}
                    >
                      <TaskItemCreatedDate
                        task={task}
                        disabled={restrictions?.createdDate === DISABLED}
                      />
                    </TaskItemCell>,
                    getColumnOrder(TaskItemColumn.CREATED_DATE),
                  )}
                </>
              )}
            {isColumnChecked(columns, TaskItemColumn.COMPLETED_DATE) &&
              !isTemplateTask && (
                <>
                  {randerFirstColumnCoverIfNecessary(
                    <TaskItemCell
                      isSubtask={isSubtask}
                      key={`completed_date_${taskIdentifier}`}
                      width={
                        columns?.find(
                          ({ identifier }) =>
                            identifier === TaskItemColumn.COMPLETED_DATE,
                        )?.columnWidth
                      }
                      paddingLeft="12px"
                      paddingRight="tiny"
                      onContextMenu={(event) => {
                        event.stopPropagation();
                      }}
                      order={getColumnOrder(TaskItemColumn.COMPLETED_DATE)}
                    >
                      <TaskItemCompletedDate
                        task={task}
                        disabled={restrictions?.completedDate === DISABLED}
                      />
                    </TaskItemCell>,
                    getColumnOrder(TaskItemColumn.COMPLETED_DATE),
                  )}
                </>
              )}
            {isColumnChecked(columns, TaskItemColumn.COMPLETED_BY) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`completed_by_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.COMPLETED_BY,
                      )?.columnWidth
                    }
                    paddingLeft="12px"
                    paddingRight="small"
                    onContextMenu={(event) => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.COMPLETED_BY)}
                    printWidth={
                      TaskItemColumnWidth[TaskItemColumn.COMPLETED_BY].PRINT
                    }
                  >
                    <>
                      {completedDt && completedBy && (
                        <TaskItemMembers
                          readOnly
                          multipleAssigneesContext={multipleAssigneesContext}
                          task={task}
                          assignedToUsers={[completedBy]}
                          handleReasignTask={null}
                          matchAssignedTo={matchAssignedTo}
                        />
                      )}
                    </>
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.COMPLETED_BY),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.ELAPSED_TIME) &&
              !isTemplateTask && (
                <>
                  {randerFirstColumnCoverIfNecessary(
                    <TaskItemCell
                      isSubtask={isSubtask}
                      key={`elapsed_time_${taskIdentifier}`}
                      width={
                        columns?.find(
                          ({ identifier }) =>
                            identifier === TaskItemColumn.ELAPSED_TIME,
                        )?.columnWidth
                      }
                      paddingLeft="12px"
                      paddingRight="tiny"
                      onContextMenu={(event) => {
                        event.stopPropagation();
                      }}
                      order={getColumnOrder(TaskItemColumn.ELAPSED_TIME)}
                    >
                      <TaskItemElapsedTime
                        task={task}
                        disabled={restrictions?.elapsedTime === DISABLED}
                      />
                    </TaskItemCell>,
                    getColumnOrder(TaskItemColumn.ELAPSED_TIME),
                  )}
                </>
              )}
            {isColumnChecked(columns, TaskItemColumn.LIST_NAME) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`list_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.LIST_NAME,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.LIST_NAME)}
                  >
                    <TaskItemList
                      listName={listName}
                      taskListIdentifier={taskListIdentifier}
                      taskStatus={task?.status}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.LIST_NAME),
                )}
              </>
            )}
            {userHasMultiOrgViewAvailable &&
              isColumnChecked(columns, TaskItemColumn.ORG_NAME) && (
                <>
                  {randerFirstColumnCoverIfNecessary(
                    <TaskItemCell
                      isSubtask={isSubtask}
                      key={`list_${taskIdentifier}`}
                      width={
                        columns?.find(
                          ({ identifier }) =>
                            identifier === TaskItemColumn.ORG_NAME,
                        )?.columnWidth
                      }
                      order={getColumnOrder(TaskItemColumn.ORG_NAME)}
                    >
                      <TaskItemOrganization
                        organizationName={organization?.organizationName}
                        organizationIdentifier={
                          organization?.organizationIdentifier
                        }
                        organizationInitials={
                          organization?.organizationInitials
                        }
                        organizationProfileColor={
                          organization?.organizationProfileColor
                        }
                      />
                    </TaskItemCell>,
                    getColumnOrder(TaskItemColumn.ORG_NAME),
                  )}
                </>
              )}
            {isColumnChecked(columns, TaskItemColumn.TASK_DETAILS) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`task_details_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.TASK_DETAILS,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.TASK_DETAILS)}
                  >
                    <TaskItemDetails
                      task={task}
                      fieldIdentifier={TaskItemColumn.TASK_DETAILS}
                      onClick={onClickTaskItem}
                      readOnly={restrictions?.description === READ_ONLY}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.TASK_DETAILS),
                )}
              </>
            )}
            <>
              {columns
                .filter(
                  (f) =>
                    f.isChecked &&
                    f._customFieldType !== CUSTOM_FIELD_TYPES.REGULAR,
                )
                .map((field) => {
                  const taskCustomFieldValue = task?.taskMetaData?.find(
                    (f) => f?.customFieldIdentifier === field.identifier,
                  );
                  const patientMetaData =
                    patient?.patientMetaData ||
                    taskWorkflow?.patient?.patientMetaData ||
                    [];
                  const patientCustomFieldValue = patientMetaData?.find(
                    (f) => f?.customFieldIdentifier === field.identifier,
                  );
                  const customFieldValue =
                    field.targetType === CUSTOM_FIELD_TYPES.PATIENT
                      ? patientCustomFieldValue
                      : taskCustomFieldValue;

                  const hidePatientCustomFields =
                    field.targetType === CUSTOM_FIELD_TYPES.PATIENT &&
                    !task?.patient?.patientIdentifier;
                  return (
                    <>
                      {randerFirstColumnCoverIfNecessary(
                        <TaskItemCell
                          isSubtask={isSubtask}
                          key={`custom_${taskIdentifier}_${field.identifier}`}
                          padding="4px"
                          width={field.columnWidth}
                          order={getColumnOrder(field.identifier)}
                        >
                          {!hidePatientCustomFields && (
                            <TaskItemCustomField
                              field={field}
                              customFieldValue={customFieldValue}
                              task={task}
                              taskWorkflow={taskWorkflow}
                              readOnly={
                                restrictions?.customFields === READ_ONLY
                              }
                            />
                          )}
                        </TaskItemCell>,
                        getColumnOrder(field.identifier),
                      )}
                    </>
                  );
                })}
            </>
          </StandardTaskItemContainer>
        </StandardTaskItemPanel>
        {showContextMenu && contextMenu && (
          <TaskItemContextMenu
            restrictions={restrictions}
            position={contextMenu}
            task={task}
            onClose={onCloseContextMenu}
            subtasksDisabled={subtasksDisabled}
            isDashboardTask={isDashboardTask}
            currentList={taskList}
          />
        )}
      </>
    );
  },
);

export default TaskItem;

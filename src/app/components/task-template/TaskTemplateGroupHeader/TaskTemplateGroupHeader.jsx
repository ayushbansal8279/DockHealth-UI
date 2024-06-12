/* eslint-disable no-underscore-dangle */
import React, {
  useState,
  useMemo,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import pluck from 'ramda/src/pluck';
import {
  isTaskItemSelectedSelector,
  isTaskItemsSelectedSelector,
} from 'selectors/task-items-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { formatPhoneNumber } from 'helpers/utility-functions';
import ThreeDotsIcon from 'img/three-dots.svg';
import * as ModalActions from 'modal/actions';
import * as WorkflowActions from 'actions/workflow-actions';
import * as TaskActions from 'actions/task-actions';
import * as TemplateBundleActions from 'actions/template-bundle-actions';
import {
  isColumnChecked,
  TaskItemColumn,
  PatientTaskItemColumn,
  TaskItemColumnWidth,
  TaskStatus,
  TaskPriority,
  getPriorityColor,
} from 'helpers/task-helpers';
import { isMemberAdmin } from 'helpers/list-members-helper';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
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
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import {
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  SINGLE_TASK_RESTRICTIONS_PROFILES,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import { updatePatientDetails } from 'actions/patient-details-actions';
import TaskItemText from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemText/TaskItemText';
import TaskItemDropdown from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDropdown/TaskItemDropdown';
import TaskItemDate from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDate';
import TaskItemList from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemList';
import TaskItemOrganization from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemOrganization';
import { CollapseContext } from 'views/list-details/VirtualTaskList/VirtualTaskList';
import { isWorkflowSelectedSelector } from 'selectors/workflow-drawer-selectors';
import TaskTemplateCreatedByMembers from '../TaskTemplateMembers/TaskTemplateCreatedBy';
import TaskTemplateCompletedByMembers from '../TaskTemplateMembers/TaskTemplateCompletedByMembers';
import TemplateHeaderName from '../TaskTemplateName/TaskTemplateName';
import TaskHeaderPatient from '../TaskTemplatePatient/TaskTemplatePatient';
import TemplateItemWorkflowStatus from '../TaskTemplateWorkflowStatus/TaskTemplateWorkflowStatus';
import TaskTemplateMembers from '../TaskTemplateMembers/TaskTemplateMembers';
import TaskTemplateStartDate from '../TaskTemplateStartDate/TaskTemplateStartDate';
import TaskTemplateAnchorDate from '../TaskTemplateAnchorDate/TaskTemplateAnchorDate';
import TaskTemplateDate from '../TaskTemplateDate/TaskTemplateDate';
import TaskTemplateElapsedTime from '../TaskTemplateElapsedTime/TaskTemplateElaspedTime';
import TaskTemplateIcons from '../TaskTemplateIcons/TaskTemplateIcons';
import {
  TaskTemplateGroupHeaderContainer,
  TaskTemplateProgressCircle,
  TemplateHandle,
  TaskTemplateOptionsContainer,
  ActionIconsContainer,
  PatientMRNAnchor,
  ChevronContainer,
} from './styled';
import TaskTemplateDetails from '../TaskTemplateDetails/TaskTemplateDetails';
import { ListPageContext } from '@/app/views/list-details/ListDetailsView';
import { VTaskContext } from '@/app/views/list-details/VirtualTaskList/VirtualSegment/VTask/VTask';
import { TaskScrollVericleLine } from '../../task/styled';
import TaskTemplateComment from '../TaskTemplateIcons/TaskTemplateComment';
import palette from '@/app/styles/palette';
import TaskTemplateContextMenu from '../TaskTemplateContextMenu/TaskTemplateContextMenu';
import { useIsVirtualizedList } from '@/app/hooks/use-is-virtualized-list';

const TaskTemplateGroupHeader = ({
  templateGroup = {},
  patient: parentPatient,
  templateTasks,
  groupHasMultipleAssignees,
  dragHandleProps = {},
  groupDragAndDropDisabled,
  disablePatientAssignment,
  isCompletedTab = false,
  setIsAddingTask,
  pageBackground,
  isOpen,
  setOpen,
  showCompletedTasks,
  setShowCompletedTasks,
  showIncompleteTasks,
  setShowIncompleteTasks,
  showTasksWithGroup = true,
  // iconColorActive,
  highlightedValue,
  origin,
  isNextVirtualTaskItemTypeBundle,
  isLastTaskOfGroup,
  isNextTaskItemTypeBundle,
  tasksStatus,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const isVirtualizedList = useIsVirtualizedList();
  const {
    name,
    tasks: taskIdentifiers,
    identifier,
    tasksCount,
    tasksCompletedCount,
    selected,
    creator,
  } = templateGroup;

  const { bulkEditIsActive } = useContext(BulkEditContext);
  const { bulkEditEnabled } = useContext(BulkEditContext);
  const { changeViewType, tasks, handleAddTask } = useContext(ListPageContext);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(name);
  const [nameInputError, setNameInputError] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const isDateHover = false;
  const [isCellHover, setCellHover] = useState({
    dueDate: false,
    startDate: false,
    assignee: false,
    comment: false,
    label: false,
    file: false,
  });
  const nameInputReference = useRef(null);
  const currentUser = useSelector(userProfileSelector);
  const currentList = useSelector(currentTaskListSelector);
  const dispatch = useDispatch();
  const { columns: listColumns } = useTaskListColumnsConfig();

  const columns = listColumns?.map((f) => ({
    ...f,
    columnWidth: Math.max(
      TaskItemColumnWidth[f.identifier]?.MINIMUM || 0,
      f.columnWidth,
    ),
  }));

  useEffect(() => {
    setNameInputValue(name);
  }, [name]);

  let restrictions =
    SINGLE_TASK_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  let taskListRestrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const { DISABLED, READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

  const selectedOrganization = useSelector(selectedUserOrganizationSelector);
  const currentTasklist = useSelector(currentTaskListSelector);
  const emrPatientLink = selectedOrganization?.emrPatientLink;

  const isListAdmin = useMemo(() => {
    const currentUserMember = currentTasklist?.listUsers?.find(
      (u) => u.identifier === currentUser?.identifier,
    );
    const isOwnerOrAdmin = checkIfUserIsOrganizationAdmin(currentUser);
    return isMemberAdmin(currentUserMember) || isOwnerOrAdmin;
  }, [currentUser, currentTasklist]);

  const isCreator = useMemo(() => {
    return creator?.identifier === currentUser?.identifier;
  }, [currentUser, creator]);

  if (!restrictions) {
    restrictions = {};
  }
  if (!taskListRestrictions) {
    taskListRestrictions = {};
  }

  const taskDeleteDisabled = useMemo(() => {
    const disabledSettingItem =
      selectedOrganization?.themeSettings?.find(
        ({ name: themeName }) =>
          themeName === 'list.tasks.member.delete.enabled',
      ) || {};
    return (
      disabledSettingItem &&
      disabledSettingItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const taskMoveListDisabled = useMemo(() => {
    const disabledSettingItem =
      selectedOrganization?.themeSettings?.find(
        ({ name: themeName }) =>
          themeName === 'list.tasks.member.move.list.enabled',
      ) || {};
    return (
      disabledSettingItem &&
      disabledSettingItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const workflowEditDisabled = useMemo(() => {
    const disabledSettingItem =
      selectedOrganization?.themeSettings?.find(
        ({ name: themeName }) =>
          themeName === 'list.tasks.member.workflow.edit.enabled',
      ) || {};
    return (
      disabledSettingItem &&
      disabledSettingItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const workflowAddTaskDisabled = useMemo(() => {
    const disabledSettingItem =
      selectedOrganization?.themeSettings?.find(
        ({ name: themeName }) =>
          themeName === 'list.tasks.member.workflow.addtask.enabled',
      ) || {};
    return (
      disabledSettingItem &&
      disabledSettingItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  if (taskDeleteDisabled) {
    restrictions.delete = DISABLED;
  }
  if (taskMoveListDisabled) {
    restrictions.move = DISABLED;
  }
  if (workflowEditDisabled) {
    restrictions.name = DISABLED;
  }
  if (workflowAddTaskDisabled) {
    taskListRestrictions.workflowAddTask = DISABLED;
  }

  const [completedTasksAmount, allTasksAmount] = useMemo(() => {
    if (templateTasks?.length === 0) {
      return [tasksCompletedCount, tasksCount];
    }
    return templateTasks?.reduce(
      (accumulator, currentTask) => {
        if (currentTask.status === 'COMPLETE') {
          accumulator[0] += 1;
        }
        if (currentTask?.subtasks?.length > 0) {
          currentTask?.subtasks?.map((subTask) => {
            if (subTask?.status === 'COMPLETE') {
              accumulator[0] += 1;
            }
          });
        }
        accumulator[1] =
          accumulator[1] + (currentTask?.subtasks?.length || 0) + 1;

        return accumulator;
      },
      [0, 0],
    );
  }, [tasksCompletedCount, tasksCount, templateTasks]);

  const completedTasksAmountFinal = completedTasksAmount;
  const allTasksAmountFinal = allTasksAmount;

  const toggleCompletedTasksVisibility = useCallback(() => {
    const updatedShowCompletedTasks = !showCompletedTasks;
    dispatch(
      TemplateBundleActions.showhideCompletedTasks(
        identifier,
        updatedShowCompletedTasks,
      ),
    );
    setShowCompletedTasks(updatedShowCompletedTasks);
  }, [showCompletedTasks, setShowCompletedTasks, dispatch, identifier]);

  const toggleIncompleteTasksVisibility = useCallback(() => {
    const updatedShowIncompleteTasks = !showIncompleteTasks;
    dispatch(
      TemplateBundleActions.showhideIncompleteTasks(
        identifier,
        updatedShowIncompleteTasks,
      ),
    );
    setShowIncompleteTasks(updatedShowIncompleteTasks);
  }, [showIncompleteTasks, setShowIncompleteTasks, dispatch, identifier]);

  const handleMoveGroupTask = useCallback(() => {
    const handleAddGroupTask = () => {
      dispatch(getTasksGroupsList());
    };

    dispatch(
      openModal('SelectDestinationGroup', {
        confirm: (group) => {
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

  const handleAddTaskToWorkflow = () => {
    if (taskListRestrictions?.workflowAddTask !== DISABLED) {
      setIsAddingTask(true);
      if (origin === 'LIST') {
        collapse.handleAddWorkflowIdentifier(identifier);
      }
    }
  };

  const handleEditName = () => {
    if (restrictions?.name !== DISABLED) {
      setIsEditing(true);
      setTimeout(() => {
        nameInputReference.current?.focus();
      }, 0);
    }
  };

  const handleMoveToList = () => {
    if (restrictions?.move !== DISABLED) {
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
      );
    }
  };

  const handleDuplicate = () => {
    if (restrictions?.duplicate !== DISABLED) {
      dispatch(
        ModalActions.openModal('AttachmentsDuplicate', {
          confirm: () => {
            dispatch(WorkflowActions.duplicateWorkflow(identifier, true));
          },
          skip: () => {
            dispatch(WorkflowActions.duplicateWorkflow(identifier, false));
          },
        }),
      );
    }
  };

  const handleDelete = () => {
    if (restrictions?.delete !== DISABLED) {
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
      );
    }
  };

  const handleTaskItemRightClick = useCallback((event) => {
    event.preventDefault();
    setContextMenu({ x: event.pageX, y: event.pageY });
  }, []);

  const onCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleNameInputKeyDown = useCallback(
    (event) => {
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
          nameInputReference.current?.blur();
        } else {
          setNameInputError(true);
        }
      } else if (key === 'Escape') {
        setNameInputError(false);
        nameInputReference.current?.blur();
      }
    },
    [dispatch, templateGroup],
  );

  const filteredTasks = useMemo(
    () =>
      templateTasks.filter(
        isCompletedTab
          ? (task) => showIncompleteTasks || task.status === TaskStatus.COMPLETE
          : (task) => showCompletedTasks || task.status !== TaskStatus.COMPLETE,
      ),
    [showCompletedTasks, showIncompleteTasks, templateTasks, isCompletedTab],
  );

  const isBundlePreSelected = useSelector(
    isTaskItemSelectedSelector(identifier),
  );

  const isBundleSelectedFromTasks = useSelector(
    isTaskItemsSelectedSelector(
      filteredTasks.length > 0
        ? pluck('identifier', filteredTasks)
        : taskIdentifiers,
    ),
  );

  const isBundleSelected =
    useSelector((state) => isWorkflowSelectedSelector(state, identifier)) ||
    isBundlePreSelected ||
    isBundleSelectedFromTasks;

  const handleBundleSelect = useCallback(async () => {
    let selectedTaskIdentifiers = [templateGroup?.identifier];
    if (filteredTasks.length > 0 && isOpen) {
      selectedTaskIdentifiers = selectedTaskIdentifiers.concat(
        pluck('identifier', filteredTasks),
      );
      dispatch(
        TaskActions.changeTasksSelectedState(
          !isBundleSelected,
          selectedTaskIdentifiers,
        ),
      );
    } else {
      if (taskIdentifiers?.length > 0) {
        selectedTaskIdentifiers =
          selectedTaskIdentifiers.concat(taskIdentifiers);
      }
      dispatch(
        TaskActions.changeTasksSelectedState(
          !isBundleSelected,
          selectedTaskIdentifiers,
        ),
      );
    }
  }, [
    filteredTasks,
    isOpen,
    dispatch,
    isBundleSelected,
    taskIdentifiers,
    templateGroup,
  ]);

  const getColumnOrder = useCallback(
    (TaskItemColumnType) =>
      columns?.findIndex((c) => c.identifier === TaskItemColumnType),
    [columns],
  );

  const taskPriority = templateGroup.priority;

  const handleUpdateTaskPriority = useCallback(
    (priority) => {
      dispatch(
        updatePartialWorkflow(identifier, {
          priority: priority?.toUpperCase() || TaskPriority.LOW,
        }),
      );
    },
    [dispatch, identifier],
  );

  const patient = parentPatient ?? templateGroup?.patient;

  const [isPatientDataReadOnly] = useState(true);
  const collapse = useContext(CollapseContext);
  const [virtualListWorkflowOpen, setVirtualListWorkflowOpen] = useState(
    !collapse.get(identifier),
  );

  const { isVirtualListWorkflowOpen } = useContext(VTaskContext);

  const handleOpen = useCallback(() => {
    setOpen(!isOpen);
    setVirtualListWorkflowOpen(!virtualListWorkflowOpen);
    collapse.set(identifier, virtualListWorkflowOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier, isOpen, setOpen, virtualListWorkflowOpen]);

  useEffect(() => {
    if (changeViewType === 'FULL_VIEW' && !tasks.includes(identifier)) {
      setVirtualListWorkflowOpen(true);
      collapse.set(identifier, false);
      handleAddTask(identifier);
    }

    if (changeViewType === 'SLIM_VIEW' && !tasks.includes(identifier)) {
      setVirtualListWorkflowOpen(false);
      collapse.set(identifier, true);
      handleAddTask(identifier);
    }
  }, [changeViewType, collapse, handleAddTask, identifier, tasks]);

  const randerFirstColumnCoverIfNecessary = useCallback(
    (content, order, width) => {
      if (order !== 0) return content;
      return (
        <StickyMainTaskItemCell
          isTamplateGroup
          isOpen={origin === 'PATIENT' ? isOpen : !isVirtualListWorkflowOpen}
          customWidthExists
          backgroundColor={pageBackground}
          isSelected={isBundleSelected}
          isEditingDescription={isEditing}
          order={0}
          width={width + 25 + 56}
          origin={origin}
        >
          {!groupDragAndDropDisabled &&
            !bulkEditIsActive &&
            taskListRestrictions?.completeTask !== DISABLED && (
              <TemplateHandle
                src={ThreeDotsIcon}
                alt="Handle"
                {...dragHandleProps}
              />
            )}
          <ActionIconsContainer isOpen={!isVirtualListWorkflowOpen}>
            {taskListRestrictions?.completeTask !== DISABLED &&
              bulkEditEnabled && (
                <Checkbox
                  isChecked={selected || isBundleSelected}
                  onClick={handleBundleSelect}
                />
              )}
            <ChevronContainer>
              {showTasksWithGroup && origin !== 'DASHBOARD' && (
                <RotatableChevron
                  rotated={
                    origin === 'PATIENT' || origin === 'DASHBOARD'
                      ? isOpen
                      : virtualListWorkflowOpen
                  }
                  onClick={handleOpen}
                  color={palette.crystalBlue}
                />
              )}
            </ChevronContainer>
            &nbsp;
          </ActionIconsContainer>
          {content}
          <TaskScrollVericleLine>&nbsp;</TaskScrollVericleLine>
        </StickyMainTaskItemCell>
      );
    },
    [
      origin,
      isOpen,
      isVirtualListWorkflowOpen,
      pageBackground,
      isBundleSelected,
      isEditing,
      groupDragAndDropDisabled,
      bulkEditIsActive,
      taskListRestrictions?.completeTask,
      DISABLED,
      dragHandleProps,
      bulkEditEnabled,
      selected,
      handleBundleSelect,
      showTasksWithGroup,
      virtualListWorkflowOpen,
      handleOpen,
    ],
  );

  const handlePatientUpdate = useCallback(
    (field) => (value) => {
      const { patientIdentifier } = patient;
      dispatch(updatePatientDetails(patientIdentifier, { [field]: value }));
    },
    [patient, dispatch],
  );

  const handleWorkflowUpdate = useCallback(
    (data) => {
      dispatch(updatePartialWorkflow(templateGroup?.identifier, data));
    },
    [dispatch, templateGroup],
  );

  return (
    <>
      <TaskTemplateGroupHeaderContainer
        onContextMenu={handleTaskItemRightClick}
        isSelected={isBundleSelected}
        $isVirtualizedList={isVirtualizedList}
        isOpen={origin === 'PATIENT' ? isOpen : virtualListWorkflowOpen}
        isNextVirtualTaskItemTypeBundle={isNextVirtualTaskItemTypeBundle}
        isLastTaskOfGroup={isLastTaskOfGroup}
        origin={origin}
        isNextTaskItemTypeBundle={isNextTaskItemTypeBundle}
      >
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
                highlightedValue={highlightedValue}
              />
              <TaskTemplateOptionsContainer
                groupHasMultipleAssignees={groupHasMultipleAssignees}
              >
                <TaskTemplateProgressCircle>
                  <ProgressBar
                    width={40}
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
          columns?.find(
            ({ identifier: id }) => id === TaskItemColumn.DESCRIPTION,
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
                    readOnly={restrictions?.patient === READ_ONLY}
                    origin={origin}
                  />
                )}
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.PATIENT),
              columns?.find(
                ({ identifier: id }) => id === TaskItemColumn.PATIENT,
              ).columnWidth,
            )}
          </>
        )}
        {isColumnChecked(columns, PatientTaskItemColumn.GENDER) && (
          <>
            {randerFirstColumnCoverIfNecessary(
              <TaskItemCell
                key={`gender_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === PatientTaskItemColumn.GENDER,
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
                isSubtask={false}
                key={`patient_dob_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === PatientTaskItemColumn.DOB,
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
                isSubtask={false}
                key={`patient_email_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === PatientTaskItemColumn.EMAIL,
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
                isSubtask={false}
                key={`patient_MRN_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === PatientTaskItemColumn.MRN,
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
                isSubtask={false}
                key={`patient_mobile_phone_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) =>
                      id === PatientTaskItemColumn.MOBILE_PHONE,
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
                isSubtask={false}
                key={`patient_home_phone_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) =>
                      id === PatientTaskItemColumn.HOME_PHONE,
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
                key={`task_status_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) =>
                      id === TaskItemColumn.WORKFLOW_STATUS,
                  )?.columnWidth
                }
                paddingLeft="smallPlus"
                paddingRight="tiny"
                onContextMenu={(event) => {
                  event.stopPropagation();
                }}
                order={getColumnOrder(TaskItemColumn.WORKFLOW_STATUS)}
              >
                <TemplateItemWorkflowStatus
                  workflowStatus={templateGroup?.workflowStatus}
                  onWorkflowUpdate={handleWorkflowUpdate}
                  highlightedValue={highlightedValue}
                  readOnly={restrictions?.status === READ_ONLY}
                />
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.WORKFLOW_STATUS),
              columns?.find(
                ({ identifier: id }) => id === TaskItemColumn.WORKFLOW_STATUS,
              )?.columnWidth,
            )}
          </>
        )}
        {isColumnChecked(columns, TaskItemColumn.PRIORITY) && (
          <>
            {randerFirstColumnCoverIfNecessary(
              <TaskItemCell
                key={`priority_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === TaskItemColumn.PRIORITY,
                  )?.columnWidth
                }
                order={getColumnOrder(TaskItemColumn.PRIORITY)}
              >
                <TaskItemDropdown
                  value={taskPriority}
                  onChange={handleUpdateTaskPriority}
                  field={{
                    options: [
                      {
                        identifier: 'HIGH',
                        name: 'High',
                        color: getPriorityColor('HIGH'),
                      },
                    ],
                    displayOptions: [],
                  }}
                  readOnly={false}
                />
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.PRIORITY),
              columns?.find(
                ({ identifier: id }) => id === TaskItemColumn.PRIORITY,
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
                  workflow={templateGroup}
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
                paddingLeft="10px"
                justify="flex-start"
                order={getColumnOrder(TaskItemColumn.START_DATE)}
                onMouseEnter={() => setCellHover({ startDate: true })}
                onMouseLeave={() => setCellHover({ startDate: false })}
              >
                <TaskTemplateStartDate
                  isHover={isCellHover.startDate}
                  workflow={templateGroup}
                  disabled={restrictions?.startDate === DISABLED}
                  isDateHover={isDateHover}
                />
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
                paddingLeft="10px"
                justify="flex-start"
                order={getColumnOrder(TaskItemColumn.DUE_DATE)}
                onMouseEnter={() => setCellHover({ dueDate: true })}
                onMouseLeave={() => setCellHover({ dueDate: false })}
              >
                <TaskTemplateDueDate
                  isHover={isCellHover.dueDate}
                  workflow={templateGroup}
                  disabled={restrictions?.dueDate === DISABLED}
                  isDateHover={isDateHover}
                />
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.DUE_DATE),
              columns?.find(
                ({ identifier: id }) => id === TaskItemColumn.DUE_DATE,
              )?.columnWidth,
            )}
          </>
        )}
        {isColumnChecked(columns, TaskItemColumn.ANCHOR_DATE) && (
          <>
            {randerFirstColumnCoverIfNecessary(
              <TaskItemCell
                key={`anchor_date_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === TaskItemColumn.ANCHOR_DATE,
                  )?.columnWidth
                }
                paddingLeft="10px"
                justify="flex-start"
                order={getColumnOrder(TaskItemColumn.ANCHOR_DATE)}
              >
                <TaskTemplateAnchorDate workflow={templateGroup} />
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.ANCHOR_DATE),
              columns?.find(
                ({ identifier: id }) => id === TaskItemColumn.ANCHOR_DATE,
              )?.columnWidth,
            )}
          </>
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
                paddingLeft="12px"
                paddingRight="small"
                padding="0"
                onContextMenu={(event) => {
                  event.stopPropagation();
                }}
                order={getColumnOrder(TaskItemColumn.ASSIGNED)}
                printWidth={TaskItemColumnWidth[TaskItemColumn.ASSIGNED].PRINT}
                onMouseEnter={() => setCellHover({ assignee: true })}
                onMouseLeave={() => setCellHover({ assignee: false })}
              >
                <TaskTemplateMembers
                  isHover={isCellHover.assignee}
                  readOnly={restrictions?.assigment === READ_ONLY}
                  currentUser={currentUser}
                  multipleAssigneesContext={groupHasMultipleAssignees}
                  workflow={templateGroup}
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
        {isColumnChecked(columns, TaskItemColumn.SHARED) && (
          <>
            {randerFirstColumnCoverIfNecessary(
              <TaskItemCell
                key={`shared_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === TaskItemColumn.SHARED,
                  )?.columnWidth
                }
                // eslint-disable-next-line sonarjs/no-all-duplicated-branches
                paddingLeft="12px"
                paddingRight="small"
                onContextMenu={(event) => {
                  event.stopPropagation();
                }}
                order={getColumnOrder(TaskItemColumn.SHARED)}
                printWidth={TaskItemColumnWidth[TaskItemColumn.SHARED].PRINT}
              >
                &nbsp;
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.SHARED),
              columns?.find(
                ({ identifier: id }) => id === TaskItemColumn.SHARED,
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
              >
                <TaskItemList
                  listName={templateGroup?.taskList?.listName}
                  taskListIdentifier={
                    templateGroup?.taskList?.taskListIdentifier
                  }
                />
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.LIST_NAME),
              columns?.find(
                ({ identifier: id }) => id === TaskItemColumn.LIST_NAME,
              )?.columnWidth,
            )}
          </>
        )}
        {isColumnChecked(columns, TaskItemColumn.ORG_NAME) && (
          <>
            {randerFirstColumnCoverIfNecessary(
              <TaskItemCell
                key={`list_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === TaskItemColumn.ORG_NAME,
                  )?.columnWidth
                }
                order={getColumnOrder(TaskItemColumn.ORG_NAME)}
              >
                <TaskItemOrganization
                  organizationName={
                    templateGroup?.organization?.organizationName
                  }
                  organizationIdentifier={
                    templateGroup?.organization?.organizationIdentifier
                  }
                  organizationInitials={
                    templateGroup?.organization?.organizationInitials
                  }
                  organizationProfileColor={
                    templateGroup?.organization?.organizationProfileColor
                  }
                />
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.ORG_NAME),
              columns?.find(
                ({ identifier: id }) => id === TaskItemColumn.ORG_NAME,
              )?.columnWidth,
            )}
          </>
        )}
        {isColumnChecked(columns, TaskItemColumn.COMMENTS) && (
          <>
            {randerFirstColumnCoverIfNecessary(
              <TaskItemCell
                isSubtask={false}
                key={`comments_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === TaskItemColumn.COMMENTS,
                  )?.columnWidth
                }
                order={getColumnOrder(TaskItemColumn.COMMENTS)}
                onMouseEnter={() => setCellHover({ comment: true })}
                onMouseLeave={() => setCellHover({ comment: false })}
              >
                <TaskTemplateComment
                  isHover={isCellHover.comment}
                  comments={templateGroup.comments}
                  matchAttachComments={templateGroup.matchComments}
                  workflow={templateGroup}
                  origin={origin}
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
                isSubtask={false}
                key={`labels_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === TaskItemColumn.LABELS,
                  )?.columnWidth
                }
                order={getColumnOrder(TaskItemColumn.LABELS)}
                onMouseEnter={() => setCellHover({ label: true })}
                onMouseLeave={() => setCellHover({ label: false })}
              >
                <TaskTemplateIcons
                  isHover={isCellHover}
                  labels={templateGroup.labels}
                  matchLabels={templateGroup.matchLabels}
                  workflow={templateGroup}
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
                isSubtask={false}
                key={`files_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === TaskItemColumn.FILES,
                  )?.columnWidth
                }
                order={getColumnOrder(TaskItemColumn.FILES)}
                onMouseEnter={() => setCellHover({ file: true })}
                onMouseLeave={() => setCellHover({ file: false })}
              >
                <TaskTemplateIcons
                  isHover={isCellHover}
                  attachments={templateGroup.attachments}
                  matchAttachments={templateGroup.matchAttachments}
                  workflow={templateGroup}
                  dispatch={dispatch}
                />
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.FILES),
            )}
          </>
        )}
        {isColumnChecked(columns, TaskItemColumn.TASK_DETAILS) && (
          <>
            {randerFirstColumnCoverIfNecessary(
              <TaskItemCell
                isSubtask={false}
                key={`task_details_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === TaskItemColumn.TASK_DETAILS,
                  )?.columnWidth
                }
                order={getColumnOrder(TaskItemColumn.TASK_DETAILS)}
              >
                <TaskTemplateDetails
                  workflow={templateGroup}
                  readOnly={restrictions?.description === READ_ONLY}
                />
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.TASK_DETAILS),
            )}
          </>
        )}
        {isColumnChecked(columns, TaskItemColumn.CREATED_BY) && (
          <>
            {randerFirstColumnCoverIfNecessary(
              <TaskItemCell
                isSubtask={false}
                key={`created_by_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === TaskItemColumn.CREATED_BY,
                  )?.columnWidth
                }
                paddingLeft="12px"
                paddingRight="small"
                padding="0"
                onContextMenu={(event) => {
                  event.stopPropagation();
                }}
                order={getColumnOrder(TaskItemColumn.CREATED_BY)}
                printWidth={
                  TaskItemColumnWidth[TaskItemColumn.CREATED_BY].PRINT
                }
              >
                <TaskTemplateCreatedByMembers workflow={templateGroup} />
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.CREATED_BY),
            )}
          </>
        )}
        {isColumnChecked(columns, TaskItemColumn.CREATED_DATE) && (
          <>
            {randerFirstColumnCoverIfNecessary(
              <TaskItemCell
                key={`created_date_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === TaskItemColumn.CREATED_DATE,
                  )?.columnWidth
                }
                paddingLeft="12px"
                paddingRight="tiny"
                onContextMenu={(event) => {
                  event.stopPropagation();
                }}
                order={getColumnOrder(TaskItemColumn.CREATED_DATE)}
              >
                <TaskTemplateDate
                  dateTime={templateGroup?.createdDateTime}
                  title="Created Date"
                  workflow={templateGroup}
                />
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.CREATED_DATE),
            )}
          </>
        )}
        {isColumnChecked(columns, TaskItemColumn.COMPLETED_DATE) && (
          <>
            {randerFirstColumnCoverIfNecessary(
              <TaskItemCell
                key={`completed_date_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) =>
                      id === TaskItemColumn.COMPLETED_DATE,
                  )?.columnWidth
                }
                paddingLeft="12px"
                paddingRight="tiny"
                onContextMenu={(event) => {
                  event.stopPropagation();
                }}
                order={getColumnOrder(TaskItemColumn.COMPLETED_DATE)}
              >
                <TaskTemplateDate
                  workflow={templateGroup}
                  title="Add Complete Date"
                  dateTime={templateGroup.completedDt}
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
                key={`completed_by_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === TaskItemColumn.COMPLETED_BY,
                  )?.columnWidth
                }
                paddingLeft="12px"
                paddingRight="small"
                padding="0"
                onContextMenu={(event) => {
                  event.stopPropagation();
                }}
                order={getColumnOrder(TaskItemColumn.COMPLETED_BY)}
                printWidth={
                  TaskItemColumnWidth[TaskItemColumn.COMPLETED_BY].PRINT
                }
              >
                <>
                  <TaskTemplateCompletedByMembers workflow={templateGroup} />
                </>
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.COMPLETED_BY),
            )}
          </>
        )}
        {isColumnChecked(columns, TaskItemColumn.ELAPSED_TIME) && (
          <>
            {randerFirstColumnCoverIfNecessary(
              <TaskItemCell
                key={`elapsed_time_${identifier}`}
                width={
                  columns?.find(
                    ({ identifier: id }) => id === TaskItemColumn.ELAPSED_TIME,
                  )?.columnWidth
                }
                paddingLeft="12px"
                paddingRight="tiny"
                onContextMenu={(event) => {
                  event.stopPropagation();
                }}
                order={getColumnOrder(TaskItemColumn.ELAPSED_TIME)}
              >
                <TaskTemplateElapsedTime workflow={templateGroup} />
              </TaskItemCell>,
              getColumnOrder(TaskItemColumn.ELAPSED_TIME),
            )}
          </>
        )}
        {columns
          .filter(
            (f) =>
              f.isChecked && f._customFieldType !== CUSTOM_FIELD_TYPES.REGULAR,
          )
          .map((field) => {
            const taskCustomFieldValue = templateGroup?.taskMetaData?.find(
              (f) => f.customFieldIdentifier === field.identifier,
            );
            const patientMetaData =
              patient?.patientMetaData ||
              templateGroup?.patient?.patientMetaData ||
              [];
            const patientCustomFieldValue = patientMetaData?.find(
              (f) => f.customFieldIdentifier === field.identifier,
            );
            const customFieldValue =
              field.targetType === CUSTOM_FIELD_TYPES.PATIENT
                ? patientCustomFieldValue
                : taskCustomFieldValue;

            const hidePatientCustomFields =
              field.targetType === CUSTOM_FIELD_TYPES.PATIENT &&
              !templateGroup?.patient?.patientIdentifier;

            return randerFirstColumnCoverIfNecessary(
              <TaskItemCell
                key={`custom_${identifier}_${field.identifier}`}
                width={field.columnWidth}
                order={getColumnOrder(field.identifier)}
              >
                {!hidePatientCustomFields && templateGroup && (
                  <TaskItemCustomField
                    customFieldValue={customFieldValue}
                    onClick={(fieldIdentifier, workflow) => {
                      if (field.targetType === CUSTOM_FIELD_TYPES.PATIENT)
                        return;
                      dispatch(
                        openDrawer(
                          workflow.identifier,
                          workflow,
                          fieldIdentifier,
                        ),
                      );
                    }}
                    field={field}
                    readOnly={taskListRestrictions?.createTask === DISABLED}
                    task={templateGroup}
                  />
                )}
              </TaskItemCell>,
              getColumnOrder(field.identifier),
              field.columnWidth,
            );
          })}
      </TaskTemplateGroupHeaderContainer>
      {contextMenu && (
        <TaskTemplateContextMenu
          identifier={identifier}
          restrictions={restrictions}
          position={contextMenu}
          onClose={onCloseContextMenu}
          handleAddTask={handleAddTaskToWorkflow}
          handleEditName={handleEditName}
          handleMoveToList={handleMoveToList}
          handleMoveGroupTask={handleMoveGroupTask}
          handleDuplicate={handleDuplicate}
          handleDelete={handleDelete}
          showCompletedTasks={showCompletedTasks}
          showIncompleteTasks={showIncompleteTasks}
          tasksStatus={tasksStatus}
          toggleCompletedTasksVisibility={toggleCompletedTasksVisibility}
          toggleIncompleteTasksVisibility={toggleIncompleteTasksVisibility}
        />
      )}
    </>
  );
};

export default TaskTemplateGroupHeader;

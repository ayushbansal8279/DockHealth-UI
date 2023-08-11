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
import { Box } from '@mui/material';
import pluck from 'ramda/src/pluck';
import {
  isTaskItemSelectedSelector,
  isTaskItemsSelectedSelector,
} from 'selectors/task-items-selectors';
import { multipleTaskLookupSelector } from 'selectors/task-details-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { formatPhoneNumber } from 'helpers/utility-functions';
import ThreeDotsIcon from 'img/three-dots.svg';
import { MoreVert } from '@mui/icons-material';
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
// import * as TaskTemplateApi from 'api/task-template-api';
// import { workflowSelector } from 'selectors/workflow-drawer-selectors';
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
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import {
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  SINGLE_TASK_RESTRICTIONS_PROFILES,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import TaskItemText from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemText/TaskItemText';
import { updatePatientDetails } from 'actions/patient-details-actions';
import TaskItemDropdown from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDropdown/TaskItemDropdown';
import TaskItemDate from 'components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDate';
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
} from './styled';
import TaskTemplateDetails from '../TaskTemplateDetails/TaskTemplateDetails';

const TaskTemplateGroupHeader = ({
  templateGroup = {},
  groupHasMultipleAssignees,
  draggableProvided = {},
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
  // isFetchingTasks,
  showTasksWithGroup = true,
  iconColorActive,
  highlightedValue,
  origin,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const {
    name,
    tasks: taskIdentifiers,
    identifier,
    tasksCount,
    tasksCompletedCount,
    selected,
    creator,
  } = templateGroup;

  const { dragHandleProps } = draggableProvided;
  const { bulkEditIsActive } = useContext(BulkEditContext);
  const { bulkEditEnabled } = useContext(BulkEditContext);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(name);
  const [nameInputError, setNameInputError] = useState(false);
  const nameInputReference = useRef(null);
  const currentUser = useSelector(userProfileSelector);
  const currentList = useSelector(currentTaskListSelector);
  const dispatch = useDispatch();
  const { columns } = useTaskListColumnsConfig();
  useEffect(() => {
    setNameInputValue(name);
  }, [name]);

  const workFlowData = undefined;
  // const [workFlowData, setWorkFlowData] = useState(undefined);
  // const selectedWorkflow = useSelector(workflowSelector);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const templateTasks = taskIdentifiers || [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const templateTasks = useSelector((state) => {
    return taskIdentifiers
      ? multipleTaskLookupSelector(state, origin, taskIdentifiers)
      : [];
  });

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

  const [completedTasksAmount, allTasksAmount] = useMemo(
    () =>
      templateTasks?.reduce(
        (accumulator, currentTask) => {
          if (currentTask.status === 'COMPLETE') {
            accumulator[0] += 1;
          }

          accumulator[0] += currentTask?.subTasksCompletedCount || 0;
          accumulator[1] =
            accumulator[1] + (currentTask?.subTasksCount || 0) + 1;

          return accumulator;
        },
        [0, 0],
      ),
    [templateTasks],
  );
  // const [completedTasksAmount, allTasksAmount] = [-1, -1];

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

  const menuOptions = useMemo(() => {
    // eslint-disable-next-line unicorn/prevent-abbreviations

    let options = [
      {
        name: 'Move to group',
        onClick: handleMoveGroupTask,
      },
    ];

    if (taskListRestrictions?.workflowAddTask !== DISABLED) {
      options = [
        ...options,
        {
          name: 'Add task',
          onClick: () => {
            setIsAddingTask(true);
          },
        },
      ];
    }

    if (restrictions?.name !== DISABLED) {
      options = [
        ...options,
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
      ];
    }

    if (restrictions?.duplicate !== DISABLED) {
      options = [
        ...options,
        {
          name: 'Duplicate',
          onClick: () =>
            dispatch(
              ModalActions.openModal('AttachmentsDuplicate', {
                confirm: () => {
                  dispatch(WorkflowActions.duplicateWorkflow(identifier, true));
                },
                skip: () => {
                  dispatch(
                    WorkflowActions.duplicateWorkflow(identifier, false),
                  );
                },
              }),
            ),
        },
      ];
    }

    options = [
      ...options,
      {
        name: 'Move to group',
        onClick: handleMoveGroupTask,
      },
    ];

    if (restrictions?.move !== DISABLED) {
      options = [
        ...options,
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
      ];
    }

    if (isCompletedTab ? !showIncompleteTasks : !showCompletedTasks) {
      options = [
        ...options,
        {
          name: isCompletedTab
            ? 'Show incomplete tasks'
            : 'Show completed tasks',
          onClick: toggleTasksVisibility,
        },
      ];
    }

    if (isCompletedTab ? showIncompleteTasks : showCompletedTasks) {
      options = [
        ...options,
        {
          name: isCompletedTab
            ? 'Hide incomplete tasks'
            : 'Hide completed tasks',
          onClick: toggleTasksVisibility,
        },
      ];
    }

    if (restrictions?.delete !== DISABLED) {
      options = [
        ...options,
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
    }

    return options;
  }, [
    handleMoveGroupTask,
    isCompletedTab,
    showIncompleteTasks,
    showCompletedTasks,
    restrictions,
    taskListRestrictions,
    DISABLED,
    setIsAddingTask,
    dispatch,
    identifier,
    toggleTasksVisibility,
  ]);

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

  const isBundleSelected = isBundlePreSelected || isBundleSelectedFromTasks;

  const handleBundleSelect = useCallback(() => {
    if (filteredTasks.length > 0 && isOpen) {
      dispatch(
        TaskActions.changeTasksSelectedState(
          !isBundleSelected,
          pluck('identifier', filteredTasks),
        ),
      );
    } else {
      dispatch(
        TaskActions.changeTasksSelectedState(
          !isBundleSelected,
          taskIdentifiers,
        ),
      );
    }
  }, [filteredTasks, isOpen, dispatch, isBundleSelected, taskIdentifiers]);

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
    (TaskItemColumnType) =>
      columns?.findIndex((c) => c.identifier === TaskItemColumnType),
    [columns],
  );

  // const getWorkflowData = useCallback(async id => {
  //   setWorkFlowData(await TaskTemplateApi.getTemplateBasicDetails(id));
  // }, []);

  // useEffect(() => {
  //   // eslint-disable-next-line no-unused-expressions
  //   !selectedWorkflow ? getWorkflowData(identifier) : setWorkFlowData(null);
  // }, [getWorkflowData, identifier, selectedWorkflow]);

  const taskPriority = (templateGroup || workFlowData).priority;

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
  const { patient } = templateGroup ?? workFlowData;

  const [isPatientDataReadOnly] = useState(true);

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
          width={+width + 25 + 54}
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
          <ActionIconsContainer>
            {taskListRestrictions?.completeTask !== DISABLED &&
              bulkEditEnabled && (
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
                color={iconColorActive}
              />
            )}
            {taskListRestrictions?.createTask !== DISABLED && (
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
      pageBackground,
      isBundleSelected,
      isEditing,
      groupDragAndDropDisabled,
      bulkEditIsActive,
      taskListRestrictions?.completeTask,
      taskListRestrictions?.createTask,
      DISABLED,
      dragHandleProps,
      bulkEditEnabled,
      selected,
      handleBundleSelect,
      showTasksWithGroup,
      isOpen,
      iconColorActive,
      menuOptions,
      setOpen,
    ],
  );

  const handlePatientUpdate = useCallback(
    (field) => (value) => {
      const { patientIdentifier } = patient;
      dispatch(updatePatientDetails(patientIdentifier, { [field]: value }));
    },
    [patient, dispatch],
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
            onContextMenu={(event) => {
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
        columns?.find(({ identifier: id }) => id === TaskItemColumn.DESCRIPTION)
          ?.columnWidth,
      )}
      {/* {randerFirstColumnCoverIfNecessary(
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
      )} */}

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
                />
              )}
            </TaskItemCell>,
            getColumnOrder(TaskItemColumn.PATIENT),
            columns?.find(({ identifier: id }) => id === TaskItemColumn.PATIENT)
              .columnWidth,
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
                  ({ identifier: id }) => id === TaskItemColumn.WORKFLOW_STATUS,
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
                workflow={templateGroup}
                onWorkflowUpdate={compose(dispatch, updatePartialWorkflow)}
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
              justify="center"
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
              <TaskTemplateStartDate
                workflow={templateGroup}
                disabled={restrictions?.startDate === DISABLED}
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
              justify="center"
              order={getColumnOrder(TaskItemColumn.DUE_DATE)}
            >
              <TaskTemplateDueDate
                workflow={templateGroup}
                disabled={restrictions?.dueDate === DISABLED}
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
              onContextMenu={(event) => {
                event.stopPropagation();
              }}
              order={getColumnOrder(TaskItemColumn.ASSIGNED)}
              printWidth={TaskItemColumnWidth[TaskItemColumn.ASSIGNED].PRINT}
            >
              <TaskTemplateMembers
                readOnly={restrictions?.assigment === READ_ONLY}
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
              justify={groupHasMultipleAssignees ? 'center' : 'center'}
              paddingLeft="small"
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
            columns?.find(({ identifier: id }) => id === TaskItemColumn.SHARED)
              ?.columnWidth,
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
            >
              <TaskTemplateIcons
                comments={
                  templateGroup.comments || !workFlowData
                    ? templateGroup.comments
                    : workFlowData.comments
                }
                matchAttachComments={
                  templateGroup.matchComments || !workFlowData
                    ? templateGroup.matchComments
                    : workFlowData.matchComments
                }
                workfkow={
                  templateGroup.comments || !workFlowData
                    ? templateGroup
                    : workFlowData
                }
                dispatch={dispatch}
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
            >
              <TaskTemplateIcons
                labels={
                  templateGroup.labels || !workFlowData
                    ? templateGroup.labels
                    : workFlowData.labels
                }
                matchLabels={
                  templateGroup.matchLabels || !workFlowData
                    ? templateGroup.matchLabels
                    : workFlowData.matchLabels
                }
                workflow={
                  templateGroup.labels || !workFlowData
                    ? templateGroup
                    : workFlowData
                }
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
            >
              <TaskTemplateIcons
                attachments={
                  templateGroup.attachments || !workFlowData
                    ? templateGroup.attachments
                    : workFlowData.attachments
                }
                matchAttachments={
                  templateGroup.matchAttachments || !workFlowData
                    ? templateGroup.matchAttachments
                    : workFlowData.matchAttachments
                }
                workflow={
                  templateGroup.attachments || !workFlowData
                    ? templateGroup
                    : workFlowData
                }
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
                workflow={
                  templateGroup.description || !workFlowData
                    ? templateGroup
                    : workFlowData
                }
                readOnly={restrictions?.taskDetails === READ_ONLY}
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
              justify="center"
              paddingLeft="small"
              paddingRight="small"
              onContextMenu={(event) => {
                event.stopPropagation();
              }}
              order={getColumnOrder(TaskItemColumn.CREATED_BY)}
              printWidth={TaskItemColumnWidth[TaskItemColumn.CREATED_BY].PRINT}
            >
              <TaskTemplateCreatedByMembers
                workflow={
                  templateGroup?.creator || !workFlowData
                    ? templateGroup
                    : workFlowData
                }
              />
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
              paddingLeft="tiny"
              paddingRight="tiny"
              justify="center"
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
                  ({ identifier: id }) => id === TaskItemColumn.COMPLETED_DATE,
                )?.columnWidth
              }
              paddingLeft="tiny"
              paddingRight="tiny"
              justify="center"
              onContextMenu={(event) => {
                event.stopPropagation();
              }}
              order={getColumnOrder(TaskItemColumn.COMPLETED_DATE)}
            >
              <TaskTemplateDate
                workflow={templateGroup}
                title="Completed On"
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
              justify="center"
              paddingLeft="small"
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
                <TaskTemplateCompletedByMembers
                  workflow={
                    templateGroup?.creator || !workFlowData
                      ? templateGroup
                      : workFlowData
                  }
                />
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
              paddingLeft="tiny"
              paddingRight="tiny"
              justify="center"
              onContextMenu={(event) => {
                event.stopPropagation();
              }}
              order={getColumnOrder(TaskItemColumn.ELAPSED_TIME)}
            >
              <TaskTemplateElapsedTime
                workflow={templateGroup ?? workFlowData}
              />
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
          const workflowDetails =
            templateGroup.assignedToUsers || !workFlowData
              ? templateGroup
              : workFlowData;
          const taskCustomFieldValue = workflowDetails?.taskMetaData?.find(
            (f) => f.customFieldIdentifier === field.identifier,
          );
          const patientCustomFieldValue =
            workflowDetails?.patient?.patientMetaData?.find(
              (f) => f.customFieldIdentifier === field.identifier,
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
                  readOnly={taskListRestrictions?.createTask === DISABLED}
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

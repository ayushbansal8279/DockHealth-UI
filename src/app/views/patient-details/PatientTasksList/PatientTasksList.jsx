/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs, Tab } from '@material-ui/core';
import { useParams, useRouteMatch, useHistory } from 'react-router-dom';
import Spacing from 'components/common/Spacing';
import TaskListDetailsDropdown from 'views/patient-details/TaskListDetailsDropdown/TaskListDetailsDropdown';
import EmptyTaskListBird from 'img/animals/bird';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as ModalActions from 'modal/actions';
import { PatientTasksSagaActions } from 'sagas/patient-details-saga';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import {
  patientTaskListsSelector,
  patientTaskListsActiveTabSelector,
  patientTaskSearchSelector,
  patientTasksSortSelector,
} from 'selectors/patient-details-selectors';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import EmptyListViewWithQuickAddTask from 'components/tasklist/EmptyListView/EmptyListViewWithQuickAddTask';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import { getTaskListForUser } from 'api/task-list-api';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import { filterTasksBySearchValue } from 'helpers/task-search-helper';
import { TaskItemColumn } from 'helpers/task-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { TasksListContainer } from './styled';

const PATIENT_VIEW_COLUMNS_CONFIG = {
  [TaskItemColumn.PATIENT]: false,
};

const searchTaskInPatientLists = (patientLists, searchValue) =>
  patientLists.reduce((accumulator, currentValue) => {
    const filteredTasks = filterTasksBySearchValue(
      currentValue.tasks,
      searchValue,
    );

    if (filteredTasks.length === 0) return accumulator;

    return [...accumulator, { ...currentValue, tasks: filteredTasks }];
  }, []);

const PatientTasksListView = ({
  activeTab,
  patientLists,
  currentUser,
  selectedTask,
  taskDrawerActions,
  taskActions,
  patientTasksSagaActions,
  modalActions,
  taskSearch,
  areFiltersApplied,
  sort,
}) => {
  const {
    patientIdentifier,
    taskListIdentifier: taskListIdentifierParameter,
  } = useParams();
  const history = useHistory();
  const { url } = useRouteMatch();
  const { openDrawer } = taskDrawerActions;
  const { storeAsCurrentTask } = taskActions;
  const {
    togglePatientTaskStatus,
    updatePatientTaskInList,
    updatePatientTaskDueDate,
    updatePatientTaskWorkflowStatus,
    quickAddPatientTask,
    refreshPatientTasks,
    sortPatientTasks,
    applyTemplateForPatient,
  } = patientTasksSagaActions;

  useEffect(() => {
    if (!taskListIdentifierParameter && patientLists?.length > 0) {
      history.push(`${url}/${patientLists[0].taskListIdentifier}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskListIdentifierParameter, patientLists]);

  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  const isListFlattened =
    areFiltersApplied ||
    !!taskSearch ||
    (!!sort?.key && !['PATIENT', 'SUBTASK_COUNT'].includes(sort.key));

  const handleQuickAddTask = ({ description }) => {
    modalActions.openModal('ListPicker', {
      fetchMethod: getTaskListForUser,
      confirm: taskListIdentifier =>
        quickAddPatientTask({ description, taskListIdentifier }),
    });
  };

  const renderEmptyListView = () => {
    if (taskSearch) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    return (
      <EmptyListViewWithQuickAddTask quickAddTask={handleQuickAddTask}>
        <EmptyListView
          title={`This ${customerTypeLabel} has no tasks`}
          description={`Add tasks for this ${customerTypeLabel} above.`}
          image={EmptyTaskListBird}
        />
      </EmptyListViewWithQuickAddTask>
    );
  };

  const handleToggleTaskStatus = task => {
    const hasIncompletedSubtasks = task.subtasks.find(
      subtask => subtask.status === 'INCOMPLETE',
    );
    if (task.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
      const modalProps = {
        confirm: () => {
          modalActions.closeModal();
          togglePatientTaskStatus(task);
        },
      };
      modalActions.openModal('CompleteAllTasks', modalProps);
    } else {
      togglePatientTaskStatus(task);
    }
  };

  const applyTemplate = useCallback(
    ({ taskListIdentifier, taskTemplateIdentifier }) => {
      applyTemplateForPatient({
        taskTemplateIdentifier,
        taskListIdentifier,
      });
    },
    [applyTemplateForPatient],
  );

  const filteredLists = taskSearch
    ? searchTaskInPatientLists(patientLists, taskSearch)
    : patientLists;

  const handleTabChange = (_, newListIdentifier) => {
    history.push(
      `/core/patient/${patientIdentifier}/tasks/${newListIdentifier}`,
    );
  };

  const activeList = useMemo(
    () =>
      filteredLists.find(
        l => l.taskListIdentifier === taskListIdentifierParameter,
      ),
    [filteredLists, taskListIdentifierParameter],
  );

  return filteredLists?.length > 0 && activeList ? (
    <>
      <TasksListContainer>
        <Tabs value={taskListIdentifierParameter} onChange={handleTabChange}>
          {patientLists.map(list => (
            <Tab value={list.taskListIdentifier} label={list.listName} />
          ))}
        </Tabs>
      </TasksListContainer>
      <Spacing vertical={5} />
      <TaskListDetailsDropdown
        key={activeList.taskListIdentifier}
        list={activeList}
        tasks={activeList.tasks}
        currentUser={currentUser}
        selectedTask={selectedTask}
        isCompleteTab={activeTab === TaskListTabName.COMPLETE}
        openDrawer={openDrawer}
        storeAsCurrentTask={storeAsCurrentTask}
        toggleTaskStatus={handleToggleTaskStatus}
        onTaskUpdate={updatePatientTaskInList}
        updateDueDate={updatePatientTaskDueDate}
        updateWorkflowStatus={updatePatientTaskWorkflowStatus}
        quickAddTask={quickAddPatientTask}
        refreshView={refreshPatientTasks}
        hideSubtasks={isListFlattened}
        sort={sort}
        onSortChange={sortPatientTasks}
        taskItemConfig={PATIENT_VIEW_COLUMNS_CONFIG}
        applyTemplate={applyTemplate}
      />
    </>
  ) : (
    renderEmptyListView()
  );
};

const mapDispatchToProps = dispatch => ({
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
  patientTasksSagaActions: bindActionCreators(
    PatientTasksSagaActions,
    dispatch,
  ),
  modalActions: bindActionCreators(ModalActions, dispatch),
});

const mapStateToProps = state => ({
  sort: patientTasksSortSelector(state),
  patientLists: patientTaskListsSelector(state),
  activeTab: patientTaskListsActiveTabSelector(state),
  currentUser: userProfileSelector(state),
  selectedTask: selectedTaskSelector(state),
  taskSearch: patientTaskSearchSelector(state),
  areFiltersApplied: hasFiltersAppliedSelector(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientTasksListView);

import React, { useEffect, createContext, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TaskStatus } from 'helpers/task-helpers';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import {
  clearTaskListState,
  initializeTaskListState,
} from 'actions/task-list-actions';
import { ViewType, getViewTypeFromQueryString } from 'helpers/view-type-helper';
import ListDetailsTableView from './ListDetailsTableView/ListDetailsTableView';
import ListDetailsCalendarView from './ListDetailsCalendarView/ListDetailsCalendarView';
import ListDetailsBoardView from './ListDetailsBoardView/ListDetailsBoardView';

export const ListPageContext = createContext({
  addNewGroup: false,
  handleAddNewGroup: {},
  changeViewType: '',
  handleSetChangeViewType: {},
  showShadow: false,
  handleScroll: {},
  tasks: [],
  handleAddTask: {},
  handleRemoveAllTasks: {},
  workflowPopoverOpen: false,
  handleWorkflowPopoverOpen: {},
});
const ListDetailsView = () => {
  const parameters = useParams();
  const { taskListIdentifier: taskListIdentifierParameter, tabName } =
    parameters;
  const { search } = useLocation();
  const viewType = getViewTypeFromQueryString(search);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initializeTaskListState(
        taskListIdentifierParameter,
        tabName?.toUpperCase() || TaskStatus.INCOMPLETE,
      ),
    );
  }, [dispatch, taskListIdentifierParameter, tabName]);

  useEffect(() => {
    return () => {
      dispatch(clearTaskListState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [addNewGroup, setAddNewGroup] = useState(false);
  const [workflowPopoverOpen, setWorkflowPopoverOpen] = useState(false);
  const [changeViewType, setChangeViewType] = useState('SLIM_VIEW');
  const [showShadow, setShowShadow] = useState(false);
  const [tasks, setTasks] = useState([]);

  const handleAddNewGroup = (value) => {
    setAddNewGroup(value);
  };

  const handleSetChangeViewType = (value) => {
    setChangeViewType(value);
  };

  const handleScroll = (event) => {
    const position = event.target.scrollTop;
    if (position > 0) {
      setShowShadow(true);
    } else {
      setShowShadow(false);
    }
  };

  const handleAddTask = (newTask) => {
    setTasks((oldTasks) => [...oldTasks, newTask]);
  };

  const handleRemoveAllTasks = () => {
    setTasks([]);
  };

  const handleWorkflowPopoverOpen = (isPopoveOpen) => {
    setWorkflowPopoverOpen(isPopoveOpen);
  };

  const ListPageContextValue = {
    addNewGroup: addNewGroup,
    handleAddNewGroup: handleAddNewGroup,
    changeViewType: changeViewType,
    handleSetChangeViewType: handleSetChangeViewType,
    showShadow: showShadow,
    handleScroll: handleScroll,
    tasks: tasks,
    handleAddTask: handleAddTask,
    handleRemoveAllTasks: handleRemoveAllTasks,
    workflowPopoverOpen: workflowPopoverOpen,
    handleWorkflowPopoverOpen: handleWorkflowPopoverOpen,
  };

  return (
    <>
      <ListPageContext.Provider value={ListPageContextValue}>
        {viewType === ViewType.LIST_VIEW && (
          <ColumnsConfigProvider>
            <ListDetailsTableView />
          </ColumnsConfigProvider>
        )}
        {viewType === ViewType.CALENDAR_VIEW && <ListDetailsCalendarView />}
        {viewType === ViewType.BOARD_VIEW && <ListDetailsBoardView />}
      </ListPageContext.Provider>
    </>
  );
};

export default ListDetailsView;

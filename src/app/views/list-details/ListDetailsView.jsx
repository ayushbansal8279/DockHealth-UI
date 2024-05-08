import React, { useEffect, createContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TaskStatus } from 'helpers/task-helpers';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import {
  clearTaskListState,
  initializeTaskListState,
} from 'actions/task-list-actions';
import { ViewType } from 'helpers/view-type-helper';
import ListDetailsTableView from './ListDetailsTableView/ListDetailsTableView';
import ListDetailsCalendarView from './ListDetailsCalendarView/ListDetailsCalendarView';
import ListDetailsBoardView from './ListDetailsBoardView/ListDetailsBoardView';
import useSearchParams from '@/app/hooks/use-search-params';

export const ListPageContext = createContext({
  addNewGroup: false,
  handleAddNewGroup: (value) => {},
  changeViewType: '',
  handleSetChangeViewType: (value) => {},
  showShadow: false,
  handleScroll: (event) => {},
  tasks: [],
  handleAddTask: (newTask) => {},
  handleRemoveAllTasks: () => {},
  workflowPopoverOpen: false,
  handleWorkflowPopoverOpen: (isPopoveOpen) => {},
  patientPopoverOpen: false,
  handlePatientPopoverOpen: (isPopoveOpen) => {},
  handleScrollToAddGroupName: () => {},
});
const ListDetailsView = () => {
  const parameters = useParams();
  const { taskListIdentifier } = parameters;
  const { viewType = ViewType.LIST_VIEW } = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeTaskListState(taskListIdentifier));
  }, [dispatch, taskListIdentifier]);

  useEffect(() => {
    return () => {
      dispatch(clearTaskListState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [addNewGroup, setAddNewGroup] = useState(false);
  const [prevListIdentifier, setPrevListIdentifier] = useState(null);
  const [workflowPopoverOpen, setWorkflowPopoverOpen] = useState(false);
  const [patientPopoverOpen, setPatientPopoverOpen] = useState(false);
  const [changeViewType, setChangeViewType] = useState('SLIM_VIEW');
  const [showShadow, setShowShadow] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const currentListIdentifier = taskListIdentifier;
    if (currentListIdentifier !== prevListIdentifier) {
      setPrevListIdentifier(currentListIdentifier);
      handleAddNewGroup(false);
    }
  }, [prevListIdentifier, taskListIdentifier]);

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

  const handlePatientPopoverOpen = (isPopoveOpen) => {
    setPatientPopoverOpen(isPopoveOpen);
  };

  const handleScrollToAddGroupName = () => {
    const scrollbar = document.querySelector(
      '[data-test-id="virtuoso-scroller"]',
    );
    if (scrollbar) {
      scrollbar.scrollTo(0, scrollbar.scrollHeight);
      setTimeout(() => {
        const updatedScrollbar = document.querySelector(
          '[data-test-id="virtuoso-scroller"]',
        );
        updatedScrollbar?.scrollTo(0, updatedScrollbar.scrollHeight);
      }, 1000);
    }
  };

  const ListPageContextValue = {
    addNewGroup,
    handleAddNewGroup,
    changeViewType,
    handleSetChangeViewType,
    showShadow,
    handleScroll,
    tasks,
    handleAddTask,
    handleRemoveAllTasks,
    workflowPopoverOpen,
    handleWorkflowPopoverOpen,
    patientPopoverOpen,
    handlePatientPopoverOpen,
    handleScrollToAddGroupName,
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

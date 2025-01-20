import React, {
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useSelector, useDispatch } from 'react-redux';
import {
  calendarTasksSelector,
  calendarMultipleTaskDetailsSelector,
} from 'selectors/calendar-tasks-selectors';
import * as CalendarTasksActions from 'actions/calendar-tasks-actions';
import {
  openDrawer,
  openTaskDrawerWithContent,
} from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import { storeAsCurrentTask, updateTaskDueDate } from 'actions/task-actions';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { openModal } from 'modal/actions';
import { getSharedTaskListsWithCurrentUser } from 'api/task-list-api';
import { userProfileSelector } from 'selectors/user-selectors';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Spacing from 'components/common/Spacing';
import { ClickAwayListener, Typography } from '@mui/material';
import {
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import ReminderIcon from 'img/reminder';
import { transformTaskToEvent } from './helpers';
import {
  CalendarContainer,
  AddEventInputContainer,
  TextEventContainer,
  CalenderTaskWrapper,
} from './styled';
import MultiAssignCalendar from './MultiAssignCalendar';
import { createMentionsFromTokenizedDescription } from '../RichTextEditor/CreateMentions';
import { openDrawer as openWorkflowDrawer } from '@/app/actions/workflow-drawer-actions';

const temporaryTaskId = 'temporaryTaskId';

const Calendar = ({ taskListIdentifier }) => {
  const { userIdentifier } = useSelector(userProfileSelector);
  const [isAddingTaskEnabled, setIsAddingTaskEnabled] = useState(true);
  const addTaskInputReference = useRef(null);
  const dispatch = useDispatch();
  const taskIdentifiers = useSelector(calendarTasksSelector);
  const allTasks = useSelector((state) => {
    return taskIdentifiers
      ? calendarMultipleTaskDetailsSelector(state, taskIdentifiers)
      : [];
  });

  const transformedTasks = useMemo(
    () => allTasks.map(transformTaskToEvent),
    [allTasks],
  );

  const currentUser = useSelector(userProfileSelector);
  const restrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;

  const handleEventClick = useCallback(
    (data) => {
      const { id } = data.event;
      if (id !== temporaryTaskId) {
        const task = allTasks.find(({ identifier }) => identifier === id);
        if (task.itemType === 'BUNDLE') {
          dispatch(openWorkflowDrawer(task?.identifier, task));
        } else {
          dispatch(openTaskDrawerWithContent(task));
        }
        // dispatch(storeAsCurrentTask(task));
      }
    },
    [dispatch, allTasks],
  );

  const handleDateSelect = useCallback(
    (selectInfo) => {
      if (isAddingTaskEnabled) {
        setIsAddingTaskEnabled(false);
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        calendarApi.addEvent({
          id: temporaryTaskId,
          start: selectInfo.startStr,
        });
      }
    },
    [isAddingTaskEnabled],
  );

  useEffect(() => {
    if (!isAddingTaskEnabled) {
      addTaskInputReference.current?.focus();
    }
  }, [isAddingTaskEnabled]);

  const onAddTaskClick = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onAddTaskInputBlur = useCallback(
    (event, eventInfo) => {
      const description = event?.target?.value;
      if (!description || description === '') {
        eventInfo.event.remove();
        setIsAddingTaskEnabled(true);

        return;
      }
      const dueDate = moment(eventInfo.event.startStr).toISOString();
      if (taskListIdentifier) {
        dispatch(
          TaskActions.addTask({
            description,
            taskListIdentifier,
            assignedToIdentifier: userIdentifier,
            dueDate,
          }),
        );
        eventInfo.event.remove();
        setIsAddingTaskEnabled(true);
      } else {
        dispatch(
          openModal('ListPicker', {
            enableSelectingGroupStep: true,
            fetchMethod: () =>
              getSharedTaskListsWithCurrentUser(userIdentifier),
            confirm: (taskListId, taskGroupIdentifier) => {
              const taskDetails = {
                description,
                taskListIdentifier: taskListId,
                taskGroupIdentifier,
                assignedToIdentifier: userIdentifier,
                dueDate,
              };
              dispatch(TaskActions.addTask(taskDetails));
            },
          }),
        );
        eventInfo.event.remove();
        setIsAddingTaskEnabled(true);
      }
    },
    [dispatch, taskListIdentifier, userIdentifier],
  );

  const handleOnKeyDown = useCallback(
    (event, eventInfo) => {
      event.stopPropagation();
      if (event.key === 'Enter') {
        if (!isAddingTaskEnabled) {
          onAddTaskInputBlur(event, eventInfo);
        }
      } else if (event.key === 'Escape') {
        eventInfo.event.remove();
        setIsAddingTaskEnabled(true);
      }
    },
    [isAddingTaskEnabled, onAddTaskInputBlur],
  );

  const renderEventContent = (eventInfo) => {
    if (eventInfo.event.id === temporaryTaskId) {
      return (
        <ClickAwayListener
          onClickAway={() => {
            eventInfo.event.remove();
            setIsAddingTaskEnabled(true);
          }}
        >
          <AddEventInputContainer>
            {restrictions?.createTask !== DISABLED && (
              <input
                name="addTaskViaCalendar"
                ref={addTaskInputReference}
                onClick={onAddTaskClick}
                placeholder="Add a task..."
                onKeyDown={(event) => handleOnKeyDown(event, eventInfo)}
              />
            )}
          </AddEventInputContainer>
        </ClickAwayListener>
      );
    }

    const task = allTasks?.find(
      ({ identifier }) => identifier === eventInfo?.event?.id,
    );

    return (
      <Tooltip key={eventInfo?.event?.id} title={eventInfo?.event?.title}>
        <CalenderTaskWrapper bundle={task?.itemType === 'BUNDLE'}>
          <TextEventContainer
            style={{
              width:"100%",
              backgroundColor: task.taskList?.color || 'white',
              opacity: 0.8,
            }}
          >
            {task && (
              <MultiAssignCalendar assignedToUsers={task.assignedToUsers} />
            )}
            {eventInfo.timeText && eventInfo?.view?.type === 'dayGridMonth' && (
              <>
                <div>
                  <ReminderIcon />
                </div>
              </>
            )}
            <Typography
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {createMentionsFromTokenizedDescription(
                task?.tokenizedDescription || task?.name,
                task?.taskMentions,
              )}
            </Typography>
          </TextEventContainer>
        </CalenderTaskWrapper>
      </Tooltip>
    );
  };

  const handleDropDown = useCallback(
    (data) => {
      const { id, start } = data.event;
      const task = allTasks.find(({ identifier }) => identifier === id);
      const dueDate = moment(start).toISOString();
      dispatch(updateTaskDueDate(task, dueDate));
    },
    [dispatch, allTasks],
  );

  const handleDateChange = ({ startStr, endStr }) => {
    const startDate = moment(startStr).subtract(1, 'days').toISOString(true);

    dispatch(
      CalendarTasksActions.changeCalendarDateRange(
        startDate.slice(0, 10),
        endStr.slice(0, 10),
      ),
    );
  };

  return (
    <CalendarContainer>
      <FullCalendar
        expandRows
        selectable
        editable
        events={transformedTasks}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        height={900}
        eventClick={handleEventClick}
        select={handleDateSelect}
        dayMaxEvents
        eventChange={handleDropDown}
        eventContent={renderEventContent}
        datesSet={handleDateChange}
      />
    </CalendarContainer>
  );
};

export default Calendar;

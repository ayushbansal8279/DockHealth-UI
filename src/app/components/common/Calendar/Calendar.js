import React, { useCallback, useRef, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useSelector, useDispatch } from 'react-redux';
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import { openDrawer } from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import { storeAsCurrentTask, updateTaskDueDate } from 'actions/task-actions';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { pipe, prop, uniqBy } from 'ramda';
import { openModal } from 'modal/actions';
import { getSharedTaskListsWithCurrentUser } from 'api/task-list-api';
import { userProfileSelector } from 'selectors/user-selectors';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Spacing from 'components/common/Spacing';
import { Typography } from '@material-ui/core';
import { transformTaskToEvent } from './helpers';
import {
  CalendarContainer,
  AddEventInputContainer,
  TextEventContainer,
} from './styled';
import MultiAssignCalendar from './MultiAssignCalendar';

const temporaryTaskId = 'temporaryTaskId';

const dedupe = pipe(uniqBy(prop('id')));

const Calendar = ({
  taskList,
  taskListIdentifier,
  showInCompleteTasksOnly,
  onAddEvent,
}) => {
  const { userIdentifier } = useSelector(userProfileSelector);
  const [isAddingTaskEnabled, setIsAddingTaskEnabled] = useState(true);
  const addTaskInputReference = useRef();
  const dispatch = useDispatch();
  const { parentTasks, subtasks } = extractTasksAndSubtasks(taskList);
  const allTasks = [...parentTasks, ...subtasks];

  const tasks = useMemo(
    () =>
      allTasks
        .filter(
          ({ dueDate, completedDt }) =>
            !!dueDate &&
            ((showInCompleteTasksOnly && !completedDt) ||
              !showInCompleteTasksOnly),
        )
        .map(transformTaskToEvent),
    [allTasks, showInCompleteTasksOnly],
  );

  const uniqueTasks = useMemo(() => dedupe(tasks), [tasks]);

  const handleEventClick = useCallback(
    data => {
      const { id } = data.event;
      if (id !== temporaryTaskId) {
        const task = allTasks.find(({ identifier }) => identifier === id);
        dispatch(openDrawer());
        dispatch(storeAsCurrentTask(task));
      }
    },
    [dispatch, allTasks],
  );

  const handleDateSelect = useCallback(
    selectInfo => {
      if (isAddingTaskEnabled) {
        setIsAddingTaskEnabled(false);
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        calendarApi.addEvent({
          id: temporaryTaskId,
          start: selectInfo.startStr,
        });
        addTaskInputReference.current.focus();
      }
    },
    [isAddingTaskEnabled],
  );

  const onAddTaskClick = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();
      if (isAddingTaskEnabled) {
        addTaskInputReference.current.focus();
      }
    },
    [isAddingTaskEnabled],
  );

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
            fetchMethod: () =>
              getSharedTaskListsWithCurrentUser(userIdentifier),
            confirm: id => {
              const taskDetails = {
                description,
                taskListIdentifier: id,
                assignedToIdentifier: userIdentifier,
                dueDate,
              };
              dispatch(TaskActions.addTask(taskDetails));
              if (typeof onAddEvent === 'function') onAddEvent(taskDetails);
            },
          }),
        );
        eventInfo.event.remove();
        setIsAddingTaskEnabled(true);
      }
    },
    [dispatch, onAddEvent, taskListIdentifier, userIdentifier],
  );

  const renderEventContent = eventInfo => {
    if (eventInfo.event.id === temporaryTaskId) {
      return (
        <AddEventInputContainer>
          <input
            name="addTaskViaCalendar"
            onBlur={event => onAddTaskInputBlur(event, eventInfo)}
            ref={addTaskInputReference}
            onClick={onAddTaskClick}
            placeholder="Add a task..."
            onKeyDown={event => {
              event.stopPropagation();
              if (event.key === 'Enter') {
                onAddTaskInputBlur(event, eventInfo);
              } else if (event.key === 'Escape') {
                eventInfo.event.remove();
                setIsAddingTaskEnabled(true);
              }
            }}
          />
        </AddEventInputContainer>
      );
    }

    const task = taskList?.find(
      ({ identifier }) => identifier === eventInfo?.event?.id,
    );

    return (
      <Tooltip
        key={eventInfo?.event?.id}
        title={eventInfo?.event?.title}
        hideTooltip={eventInfo?.event?.title.length < 17}
      >
        <TextEventContainer>
          {task && (
            <MultiAssignCalendar assignedToUsers={task.assignedToUsers} />
          )}
          <b>{eventInfo.timeText}</b>
          <Spacing horizontal={2} />
          <Typography noWrap>{eventInfo?.event?.title}</Typography>
        </TextEventContainer>
      </Tooltip>
    );
  };

  const handleDropDown = useCallback(
    data => {
      const { id, start } = data.event;
      const task = allTasks.find(({ identifier }) => identifier === id);
      const dueDate = moment(start).toISOString();
      dispatch(updateTaskDueDate(task, dueDate));
    },
    [dispatch, allTasks],
  );

  return (
    <CalendarContainer>
      <FullCalendar
        expandRows
        selectable
        editable
        events={uniqueTasks}
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
      />
    </CalendarContainer>
  );
};

export default Calendar;

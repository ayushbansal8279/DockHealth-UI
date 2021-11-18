import React, { useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import {
  openTaskDrawerToAddTask,
  openDrawer,
} from 'actions/task-drawer-actions';
import { useDispatch } from 'react-redux';
import { storeAsCurrentTask, updateTaskDueDate } from 'actions/task-actions';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { CalendarContainer } from './styled';
import { transformTaskToEvent } from './helpers';

const Calendar = ({
  taskList,
  taskListIdentifier,
  showInCompleteTasksOnly,
}) => {
  const dispatch = useDispatch();
  const { parentTasks } = extractTasksAndSubtasks(taskList);
  const tasks = parentTasks
    .filter(
      ({ dueDate, completedDt }) =>
        !!dueDate &&
        ((showInCompleteTasksOnly && !completedDt) ||
          (!showInCompleteTasksOnly && completedDt)),
    )
    .map(transformTaskToEvent);

  const handleEventClick = useCallback(
    data => {
      const { id } = data.event;
      const task = parentTasks.find(({ identifier }) => identifier === id);
      dispatch(openDrawer());
      dispatch(storeAsCurrentTask(task));
    },
    [dispatch, parentTasks],
  );

  const handleDateSelect = useCallback(
    selectInfo => {
      const calendarApi = selectInfo.view.calendar;
      calendarApi.unselect();
      const dueDate = moment(selectInfo.startStr).toISOString();
      dispatch(
        openTaskDrawerToAddTask({
          dueDate,
          taskList: { taskListIdentifier },
        }),
      );
    },
    [dispatch, taskListIdentifier],
  );

  const handleDropDown = useCallback(
    data => {
      const { id, start } = data.event;
      const task = parentTasks.find(({ identifier }) => identifier === id);
      const dueDate = moment(start).toISOString();
      dispatch(updateTaskDueDate(task, dueDate));
    },
    [dispatch, parentTasks],
  );

  return (
    <CalendarContainer>
      <FullCalendar
        selectable
        editable
        events={tasks}
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
      />
    </CalendarContainer>
  );
};

export default Calendar;

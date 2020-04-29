/* eslint-disable react-hooks/rules-of-hooks */
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useMount, useUpdate } from 'react-use';
import {
  getCalendarFormattedMonth,
  renderDayLabels,
} from './NewTaskDrawer.Calendar.Utilities';

const initializeCalendarHooks = ({ dateFieldName, setDate }) => {
  const { watch } = useFormContext();
  const [currentMonthMoment, setCurrentMonthMoment] = useState(null);
  const [currentDueDate, setCurrentDueDate] = useState(null);

  const dateFieldValue = watch(dateFieldName);

  const forceUpdate = useUpdate();

  // undefined value is used in here due to null value resulting in invalid date object - we want to
  // show current month's calendar if no due date is set yet
  const selectedTaskDueDate = useSelector(
    store => store.taskState.selectedTask?.dueDate ?? undefined,
  );

  useMount(() => {
    setCurrentMonthMoment(moment(selectedTaskDueDate).startOf('month'));
    setCurrentDueDate(dateFieldValue ? moment(dateFieldValue) : null);
  });

  const changeMonth = useCallback(
    value => {
      setCurrentMonthMoment(
        currentMonthMoment?.add(value, 'month')?.startOf('month'),
      );

      // this update is used to due current month label not rerendering on month change
      forceUpdate();
    },
    [currentMonthMoment, forceUpdate],
  );

  const formattedCurrentMonth = getCalendarFormattedMonth(currentMonthMoment);

  const dayLabelsToRender = useMemo(
    () => renderDayLabels({ currentMonthMoment, currentDueDate, setDate }),
    // useEffect work better for primitive values (like strings in here)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formattedCurrentMonth],
  );

  return {
    currentMonthMoment,
    changeMonth,
    formattedCurrentMonth,
    dayLabelsToRender,
  };
};

export default initializeCalendarHooks;

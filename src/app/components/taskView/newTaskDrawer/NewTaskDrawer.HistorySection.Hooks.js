/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import useBoolean from 'hooks/useBoolean';
import { getTaskHistory } from 'actions/task-actions';
import moment from 'moment';

const HISTORY_DATE_FORMAT = 'MM/DD/YYYY @ h:mma';

export const getFormattedEventDate = ({ dateValue }) =>
  moment(dateValue).format(HISTORY_DATE_FORMAT);

const initializeTaskDrawerTopSectionHooks = ({ selectedTask }) => {
  const [isHistoryShown, , hideHistory, toggleHistory] = useBoolean(false);
  const [isHistoryLoading, setHistoryLoading, unsetHistoryLoading] = useBoolean(
    false,
  );
  const [history, setHistory] = useState([]);

  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const currentUser = useSelector(store => store.userState.userProfile);

  const dispatch = useDispatch();

  useMount(() => {
    setHistory([]);
  });

  useEffect(() => {
    if (isHistoryShown) {
      if (selectedTask) {
        getTaskHistory(selectedTask)(dispatch)
          .then(historyDetails => {
            setHistory(historyDetails);
            unsetHistoryLoading();
          })
          .catch(() => {
            unsetHistoryLoading();
          });
      }
    } else {
      setHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHistoryShown]);

  useEffect(() => {
    setHistory([]);
    hideHistory();
    unsetHistoryLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskIdentifier]);

  const onToggleHistoryButtonClicked = useCallback(() => {
    if (!isHistoryShown) {
      setHistoryLoading();
    }
    toggleHistory();
  }, [setHistoryLoading, isHistoryShown, toggleHistory]);

  return {
    currentUser,
    isHistoryShown,
    hideHistory,
    toggleHistory,
    isHistoryLoading,
    setHistoryLoading,
    unsetHistoryLoading,
    history,
    setHistory,
    onToggleHistoryButtonClicked,
    getFormattedEventDate,
  };
};

export default initializeTaskDrawerTopSectionHooks;

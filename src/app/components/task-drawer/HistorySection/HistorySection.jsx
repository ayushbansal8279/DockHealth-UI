import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DrawerSection from 'components/drawer-common/DrawerSection/DrawerSection';
import HistoryItem from 'components/drawer-common/HistoryItem/HistoryItem';
import HistoryItemLoader from 'components/drawer-common/HistoryItemLoader/HistoryItemLoader';
import { useBoolean } from 'hooks/useBoolean';
import * as TaskApi from 'api/task-api';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import EmptyHistoryLabel from 'components/drawer-common/EmptyHistoryLabel/EmptyHistoryLabel';
import { userProfileSelector } from 'selectors/user-selectors';

const HistorySection = () => {
  const [isHistoryLoading, setHistoryLoading, unsetHistoryLoading] =
    useBoolean(false);
  const [history, setHistory] = useState(null);
  const selectedTask = useSelector(selectedTaskSelector);
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;
  const currentUser = useSelector(userProfileSelector);

  useEffect(() => {
    setHistory(null);
  }, [selectedTaskIdentifier]);

  const handleHistoryOpen = () => {
    setHistoryLoading();
    TaskApi.getTaskHistory(selectedTaskIdentifier)
      .then((historyDetails) => {
        setHistory(historyDetails);
        unsetHistoryLoading();
      })
      .catch(() => {
        unsetHistoryLoading();
      });
  };

  return (
    <DrawerSection title="History" collapsable onOpen={handleHistoryOpen}>
      {!selectedTaskIdentifier && (
        <HistoryItem
          description={`${currentUser?.firstName} ${currentUser?.lastName} created the task`}
          date={selectedTask?.createdDateTime}
          type="Task created"
        />
      )}
      <>
        {isHistoryLoading ? (
          <>
            <HistoryItemLoader />
            <HistoryItemLoader />
            <HistoryItemLoader />
            <HistoryItemLoader />
            <HistoryItemLoader />
          </>
        ) : (
          <>
            {history?.length > 0 ? (
              history.map(
                ({
                  auditId,
                  taskHistoryDetails,
                  taskHistoryType,
                  createdDateTime,
                  user,
                }) => (
                  <HistoryItem
                    key={auditId}
                    description={`${
                      user?.userName ?? ''
                    } ${taskHistoryDetails}`}
                    date={createdDateTime}
                    type={taskHistoryType}
                  />
                ),
              )
            ) : (
              <EmptyHistoryLabel>No history available</EmptyHistoryLabel>
            )}
          </>
        )}
      </>
    </DrawerSection>
  );
};

export default HistorySection;

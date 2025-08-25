import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as WorkflowDrawerActions from 'actions/workflow-drawer-actions';
import {
  isFetchingHistorySelector,
  historySelector,
} from 'selectors/workflow-drawer-selectors';
import DrawerSection from 'components/drawer-common/DrawerSection/DrawerSection';
import HistoryItem from 'components/drawer-common/HistoryItem/HistoryItem';
import HistoryItemLoader from 'components/drawer-common/HistoryItemLoader/HistoryItemLoader';
import EmptyHistoryLabel from 'components/drawer-common/EmptyHistoryLabel/EmptyHistoryLabel';

const HistorySection = () => {
  const dispatch = useDispatch();
  const isFetching = useSelector(isFetchingHistorySelector);
  const history = useSelector(historySelector);

  const handleOpen = () => {
    dispatch(WorkflowDrawerActions.getHistory());
  };

  return (
    <DrawerSection title="History" collapsable onOpen={handleOpen}>
      {isFetching ? (
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
                currentState,
                previousState,
                auditEventType,
              }) => (
                <HistoryItem
                  key={auditId}
                  date={createdDateTime}
                  type={taskHistoryType}
                  currentState={currentState}
                  previousState={previousState}
                  auditEventType={auditEventType}
                  userName={user?.userName || 'DOCK ADMIN'}
                  taskHistoryDetails={taskHistoryDetails || ''}
                />
              ),
            )
          ) : (
            <EmptyHistoryLabel>No history available</EmptyHistoryLabel>
          )}
        </>
      )}
    </DrawerSection>
  );
};

export default HistorySection;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable func-names */
import React, { useState, useEffect } from 'react';
import { ActivityAlertsToastContainer } from 'components/activity-alerts/ActivityAlertsToast/styled';
import ChatActivityAlertsItem from './ChatActivityAlertsItem';
// import ActivityAlertsItem from '../ActivityAlertsItem/ActivityAlertsItem';
// import { ActivityAlertsToastContainer } from './styled';

const ChatActivityAlertsToast = ({
  message,
  channel,
  positionInQueue,
  onClear,
  itemAlert,
}) => {
  const [isCleared, setIsCleared] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (isCleared) {
      setTimeout(function() {
        setShouldRender(false);
        onClear(itemAlert);
        // onClear(itemAlert?.activityAlertIdentifier);
      }, 600);
    }

    if (shouldRender) {
      setTimeout(function() {
        setIsCleared(true);
      }, 5000);
    }
  }, [isCleared, shouldRender]);

  const topSpacing =
    positionInQueue === 1 ? 36 : 36 + (positionInQueue - 1) * 178; // positionInQueue is from 1 to X - it incomes from ActivityAlerts component - it's necessary for correct calculating spacings

  return (
    <>
      {shouldRender && (
        <ActivityAlertsToastContainer
          isCleared={isCleared}
          topSpacing={topSpacing}
        >
          <ChatActivityAlertsItem
            // onClearAlert={() => setIsCleared(true)}
            closeAlerts={() => setIsCleared(true)}
            itemAlert={itemAlert}
            message={message}
            channel={channel}
            withCrossIcon
          />
        </ActivityAlertsToastContainer>
      )}
    </>
  );
};

export default ChatActivityAlertsToast;

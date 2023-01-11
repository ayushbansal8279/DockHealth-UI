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
      setTimeout(() => {
        setShouldRender(false);
        onClear(itemAlert);
        // onClear(itemAlert?.activityAlertIdentifier);
      }, 600);
    }

    if (shouldRender) {
      setTimeout(() => {
        setIsCleared(true);
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {/* <ActivityAlertsItem
            onClearAlert={() => setIsCleared(true)}
            itemAlert={itemAlert}
            withCrossIcon
          /> */}
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

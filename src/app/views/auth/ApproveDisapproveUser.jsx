import React, { useState, useEffect } from 'react';
import { getUserById } from 'api/people-api';

const getPageContent = decisionType => {
  switch (decisionType) {
    case 'APPROVE_MEMBER':
    case 'APPROVE_GUEST': {
      return {
        title: 'Invitation successfully sent.',
        description: userName =>
          ` ${userName}  has successfully been invited to your organization and will now be part of your organization and subscription. If you denied this person by error you can still`,
        RevertOption: () => (
          <span onClick={() => {}} style={{ cursor: 'pointer', color: 'blue' }}>
            deny the invite.
          </span>
        ),
      };
    }

    case 'DENY': {
      return {
        title: 'Invitation denied',
        description: userName =>
          `You have denied access to inviting ${userName} to your organization. If you denied this person by error you can still accept the invite.`,
        RevertOption: () => (
          <span onClick={() => {}} style={{ cursor: 'pointer', color: 'blue' }}>
            accept the invite.
          </span>
        ),
      };
    }

    default: {
      return { title: '', description: () => {}, revertOption: () => {} };
    }
  }
};

const ApproveDisapproveUser = ({ match }) => {
  const { params } = match;
  const { userIdentifier, decisionType } = params;

  const [user, setUser] = useState({});

  useEffect(() => {
    if (userIdentifier) {
      getUserById(userIdentifier).then(setUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { userName } = user;

  const { title, description, RevertOption } = getPageContent(decisionType);

  return (
    <div>
      <h2>{title}</h2>
      <div>
        {description(userName)} <RevertOption />
      </div>
    </div>
  );
};

export default ApproveDisapproveUser;

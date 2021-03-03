import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { approveOrDenyInvitation } from 'actions/user-actions';

const getPageContent = decisionType => {
  switch (decisionType) {
    case 'APPROVE_MEMBER':
    case 'APPROVE_GUEST': {
      return {
        title: 'Invitation successfully sent.',
        description: userName =>
          ` ${userName} has successfully been invited to your organization and will now be part of your organization and subscription. If you denied this person by error you can still`,
        RevertOption: () => (
          <Link to="/settings/subscriptions">deny the invite.</Link>
        ),
      };
    }

    case 'DENY': {
      return {
        title: 'Invitation denied',
        description: userName =>
          `You have denied access to inviting ${userName} to your organization. If you denied this person by error you can still accept the invite.`,
        RevertOption: () => (
          <Link to="/settings/subscriptions">accept the invite.</Link>
        ),
      };
    }

    default: {
      return { title: '', description: () => {}, revertOption: () => {} };
    }
  }
};

const ApproveDisapproveUser = ({ match }) => {
  const dispatch = useDispatch();
  const { params } = match;
  const { requestIdentifier, decisionType, userIdentifier } = params;

  useEffect(() => {
    approveOrDenyInvitation({
      requestIdentifier,
      decisionType,
      userIdentifier,
      dispatch,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { title, description, RevertOption } = getPageContent(decisionType);

  return (
    <div>
      <h2>{title}</h2>
      <div>
        {description('')} <RevertOption />
      </div>
    </div>
  );
};

export default ApproveDisapproveUser;

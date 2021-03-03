import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { MontserratTypography } from 'styles/theme-montserrat';
import { approveOrDenyInvitation } from 'actions/user-actions';
import Spacing from 'components/common/Spacing';

const TitleContent = styled(MontserratTypography)`
  font-size: 36px !important;
`;

const Container = styled.div`
  min-width: 500px;
`;

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
    <Container>
      <TitleContent>{title}</TitleContent>
      <Spacing vertical={4} />
      <MontserratTypography>
        {description('')} <RevertOption />
      </MontserratTypography>
    </Container>
  );
};

export default ApproveDisapproveUser;

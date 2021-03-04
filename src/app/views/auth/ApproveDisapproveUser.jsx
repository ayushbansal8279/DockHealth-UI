/* eslint-disable unicorn/catch-error-name */
import React, { useEffect, useState } from 'react';
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
  min-width: 550px;
`;

const getPageContent = (decisionType, userName) => {
  switch (decisionType) {
    case 'APPROVE_MEMBER':
    case 'APPROVE_GUEST': {
      return {
        title: 'Invitation successfully sent.',
        description: `${userName} has successfully been invited to your organization and will now be part of your organization and subscription. If you denied this person by error you can still`,
        actionText: 'deny the invite.',
      };
    }

    case 'DENY': {
      return {
        title: 'Invitation denied',
        description: `You have denied access to inviting ${userName} to your organization. If you denied this person by error you can still accept the invite.`,
        actionText: 'accept the invite.',
      };
    }

    case 'ERROR': {
      return {
        description: 'If you want to see this invitation, you have to',
        actionText: 'go to the your organizations subscriptions',
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
  const [pageContent, setPageContent] = useState({});

  useEffect(() => {
    approveOrDenyInvitation({
      requestIdentifier,
      decisionType,
      userIdentifier,
      dispatch,
    })
      .then(({ userName }) => {
        const successPageContent = getPageContent(decisionType, userName);

        setPageContent(successPageContent);
      })
      .catch(({ response }) => {
        const errorPageContent = getPageContent('ERROR');

        setPageContent({
          ...errorPageContent,
          title: response?.data?.errorMessage,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { title, description, actionText } = pageContent;

  return (
    <Container>
      <TitleContent>{title}</TitleContent>
      <Spacing vertical={4} />
      <MontserratTypography>
        {description} <Link to="/settings/subscriptions">{actionText}</Link>
      </MontserratTypography>
    </Container>
  );
};

export default ApproveDisapproveUser;

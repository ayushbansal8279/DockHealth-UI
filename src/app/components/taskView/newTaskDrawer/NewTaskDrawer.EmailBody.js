import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';
import { mentionifyAndLinkifyTaskText } from 'helpers/utility-functions';
import EnvelopeIcon from 'img/envelope.svg';
import palette from 'styles/palette';

const EmailBodyContainer = styled.div`
  background-color: ${palette.coolGrey4};
  margin-top: 0.5rem;
  padding: 1rem;
  width: 100%;
  word-break: break-word;
`;

const EmailMessageContainer = styled.pre`
  font-size: 0.875rem;
  margin-top: 0.25rem;
  min-height: 1rem;
  max-height: 15rem;
`;

export default ({ emailBody, members }) => (
  <EmailBodyContainer>
    <img src={EnvelopeIcon} alt="Email" />
    <EmailMessageContainer>
      {ReactHtmlParser(
        mentionifyAndLinkifyTaskText({ members, value: emailBody }),
      )}
    </EmailMessageContainer>
  </EmailBodyContainer>
);

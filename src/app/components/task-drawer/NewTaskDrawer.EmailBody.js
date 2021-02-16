import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';
import Spacing from 'components/common/Spacing';
import { mentionifyAndLinkifyTaskText } from 'helpers/utility-functions';
import EnvelopeIcon from 'img/envelope.svg';
import palette from 'styles/palette';

const EmailBodyContainer = styled.div`
  background-color: ${palette.blueGrey};
  margin-top: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  word-break: break-word;
`;

const EmailMessageContainer = styled.pre`
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;

  letter-spacing: 0.230769px;
`;

export default ({ emailBody, members }) => (
  <EmailBodyContainer>
    <img src={EnvelopeIcon} alt="Email" />
    <Spacing vertical={4} />
    <EmailMessageContainer>
      {ReactHtmlParser(
        mentionifyAndLinkifyTaskText({ members, value: emailBody }),
      )}
    </EmailMessageContainer>
    <Spacing vertical={4} />
  </EmailBodyContainer>
);

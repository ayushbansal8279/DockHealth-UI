import React from 'react';
import styled from 'styled-components';
import ReactHtmlParser from 'react-html-parser';

import EnvelopeIcon from '../../img/envelope.svg';
import { mentionifyAndLinkifyTaskText } from '../../helpers/utility-functions';

const EmailBodyContainer = styled.div`
  background-color: #f3f5f6;
  margin-top: 0.5rem;
  padding: 1rem;
  width: 100%;
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

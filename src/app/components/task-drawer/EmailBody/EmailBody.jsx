import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import Spacing from 'components/common/Spacing';
import { mentionifyAndLinkifyTaskText } from 'helpers/utility-functions';
import EnvelopeIcon from 'img/envelope.svg';
import { EmailBodyContainer, EmailMessageContainer } from './styled';

const EmailBody = ({ emailBody, members }) => (
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

export default EmailBody;

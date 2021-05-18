import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import * as TaskListApi from 'api/task-list-api';
import Spacing from 'components/common/Spacing';
import { mentionifyAndLinkifyTaskText } from 'helpers/utility-functions';
import EnvelopeIcon from 'img/envelope.svg';
import { EmailBodyContainer, EmailMessageContainer } from './styled';

const EmailBody = ({
  emailBody,
  taskListIdentifier,
  selectedTaskSourceMessage,
}) => {
  const [emailBodyMembers, setEmailBodyMembers] = useState(null);

  useEffect(() => {
    if (taskListIdentifier && selectedTaskSourceMessage) {
      TaskListApi.getMembersByTaskListId(taskListIdentifier, 'ALL').then(
        data => {
          setEmailBodyMembers(data);
        },
      );
    }
  }, [selectedTaskSourceMessage, taskListIdentifier]);

  return (
    <EmailBodyContainer>
      <img src={EnvelopeIcon} alt="Email" />
      <Spacing vertical={4} />
      <EmailMessageContainer>
        {ReactHtmlParser(
          mentionifyAndLinkifyTaskText({ emailBodyMembers, value: emailBody }),
        )}
      </EmailMessageContainer>
      <Spacing vertical={4} />
    </EmailBodyContainer>
  );
};

export default EmailBody;

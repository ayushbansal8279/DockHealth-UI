import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'html-react-parser';
import * as TaskListApi from 'api/task-list-api';
import Spacing from 'components/common/Spacing';
import { mentionifyAndLinkifyTaskText } from 'helpers/utility-functions';
import EnvelopeIcon from 'img/envelope.svg';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { useSelector } from 'react-redux';
import { EmailBodyContainer, EmailMessageContainer } from './styled';

const EmailBody = () => {
  const [emailBodyMembers, setEmailBodyMembers] = useState(null);
  const { sourceMessage: emailBody, taskList } =
    useSelector(selectedTaskSelector) || {};
  const { taskListIdentifier } = taskList;

  useEffect(() => {
    if (taskListIdentifier && emailBody) {
      TaskListApi.getMembersByTaskListId(taskListIdentifier, 'ALL').then(
        (data) => {
          setEmailBodyMembers(data);
        },
      );
    }
  }, [emailBody, taskListIdentifier]);

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

import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OwlWithList from 'img/owl-with-list.png';
import {
  taskListsSelector,
  pendingTaskListsSelector,
} from 'selectors/task-list-selectors';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import {
  Wrapper,
  Picture,
  TextWrapper,
  Title,
  Description,
  ButtonsContainer,
} from './styled';

const DashboardFirstVisitView = ({
  hasInvitedLists,
  onCreateList,
  acceptInvitation,
}) => {
  const history = useHistory();

  const taskLists = useSelector(taskListsSelector);
  const pendingTaskLists = useSelector(pendingTaskListsSelector);

  const allLists = useMemo(
    () => [...(taskLists || []), ...(pendingTaskLists || [])],
    [taskLists, pendingTaskLists],
  );

  const list = allLists?.find(
    l =>
      l.listType !== 'INBOX' &&
      l.listType !== 'PUBLIC' &&
      l.listType !== 'SHARED_SAMPLE',
  );

  const sampleList = allLists?.find(l => l.listType === 'SHARED_SAMPLE');

  return (
    <Wrapper>
      <TextWrapper>
        {hasInvitedLists ? (
          <>
            <Title>
              Welcome to Dock.
              <br /> Your collegue {list?.creator?.firstName || ''} already
              started a list and invited you to it.
            </Title>
            <Spacing vertical={6} />
            <ButtonsContainer>
              <Spacing horizontal={4} />
              <Button
                fullWidth
                variant="text"
                onClick={() => {
                  acceptInvitation(list);
                  if (list) {
                    history.push(`/tasks/${list.taskListIdentifier}`);
                  }
                }}
              >
                Go to this list
              </Button>
            </ButtonsContainer>
          </>
        ) : (
          <>
            <Title>Ready to create your first list?</Title>
            <Description>
              Lists are how you organize all your tasks. Think of a list as a
              folder where tasks related to that folder live. You can create as
              many lists as you&apos;d like. Let’s get started!
            </Description>
            <ButtonsContainer>
              <Button fullWidth onClick={onCreateList}>
                Create a list
              </Button>
              <Spacing horizontal={4} />
              {sampleList && (
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => {
                    if (sampleList) {
                      history.push(`/tasks/${sampleList?.taskListIdentifier}`);
                    }
                  }}
                >
                  Go to the sample list
                </Button>
              )}
            </ButtonsContainer>
          </>
        )}
      </TextWrapper>
      <Picture src={OwlWithList} alt="Create list" />
    </Wrapper>
  );
};

export default DashboardFirstVisitView;

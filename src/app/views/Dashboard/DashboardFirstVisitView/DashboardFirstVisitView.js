import React from 'react';
import { hashHistory } from 'react-router';
import OwlWithList from 'img/owl-with-list.png';
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
  onTakeATour,
  list,
}) => {
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
              <Button fullWidth variant="contained" onClick={onTakeATour}>
                Take tour of Dock
              </Button>
              <Spacing horizontal={4} />
              <Button
                fullWidth
                variant="text"
                onClick={() =>
                  list && hashHistory.push(`tasks/${list.taskListIdentifier}`)
                }
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
              many lists as you like. Let’s get started!
            </Description>
            <ButtonsContainer>
              <Button fullWidth variant="contained" onClick={onCreateList}>
                Create a list
              </Button>
              <Spacing horizontal={4} />
              <Button fullWidth variant="text" onClick={onTakeATour}>
                Take tour of Dock
              </Button>
            </ButtonsContainer>
          </>
        )}
      </TextWrapper>
      <Picture src={OwlWithList} alt="Create list" />
    </Wrapper>
  );
};

export default DashboardFirstVisitView;

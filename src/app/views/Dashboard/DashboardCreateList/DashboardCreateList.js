import React from 'react';
import OwlWithList from 'img/owl-with-list.png';
import {
  Wrapper,
  Picture,
  TextWrapper,
  Title,
  Description,
  ButtonsContainer,
  TourButton,
  CreateListButton,
} from './styled';

const DashboardCreateList = () => {
  return (
    <Wrapper>
      <TextWrapper>
        <Title>Ready to create your first list?</Title>
        <Description>
          Lists are how you organize all your tasks. Think of a list as a folder
          where tasks related to that folder live. You can create as many lists
          as you like. Let’s get started!
        </Description>
        <ButtonsContainer>
          <CreateListButton variant="contained" size="small" onClick={() => {}}>
            Create a list
          </CreateListButton>
          <TourButton variant="text" size="small" onClick={() => {}}>
            Take tour of Dock
          </TourButton>
        </ButtonsContainer>
      </TextWrapper>
      <Picture src={OwlWithList} alt="Create list" />
    </Wrapper>
  );
};

export default DashboardCreateList;

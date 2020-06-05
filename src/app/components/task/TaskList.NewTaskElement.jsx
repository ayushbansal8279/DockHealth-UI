import React from 'react';
import styled from 'styled-components';
import palette from 'styles/palette';
import Loader from '../common/Loader/Loader';
import TaskCheckbox from './TaskCheckbox';

const NewTaskContainer = styled.div`
  align-items: center;
  background-color: ${palette.white};
  display: flex;
  height: ${props => (props.addingNewTask ? 85 : 0)};
  margin-top: ${props => (props.addingNewTask ? 0.5 : 0)}rem;
  overflow: hidden;
  transition: all ${props => (props.addingNewTask ? 0.25 : 0)}s ease-out;
  width: 100%;
`;

const NewTaskCheckboxContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 60px;
`;

const NewTaskLoaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-left: 1rem;
`;

export default props => {
  return (
    <NewTaskContainer {...props}>
      <NewTaskCheckboxContainer>
        <TaskCheckbox />
      </NewTaskCheckboxContainer>
      <NewTaskLoaderContainer>
        <Loader size={32} />
      </NewTaskLoaderContainer>
    </NewTaskContainer>
  );
};

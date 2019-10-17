import React from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

const StyledButton = styled(Button)`
  && {
    border-radius: 4px;
    background: #e6ecf0;
    font-size: 16px;
    color: #303538;
    text-transform: none;
    padding: 3px 9px;
  }
`;

const StyledImage = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 6px;
`;

const TaskListAction = ({
  children, icon, alt, onClick,
}) => (
  <StyledButton onClick={onClick}>
    {icon && <StyledImage src={icon} alt={alt} />}
    {children}
  </StyledButton>
);

export default TaskListAction;

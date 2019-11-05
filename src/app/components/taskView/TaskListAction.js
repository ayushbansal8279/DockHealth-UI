import React from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

const StyledButton = styled(Button)`
  && {
    border-radius: 0.25rem;
    background-color: ${props =>
      props.active ? '#007cab' : props.backgroundColor ?? '#E6ECF0'};
    color: ${props => (props.active ? '#fff' : '#303538')};
    height: 2rem;
    font-size: 0.875rem;
    padding: 0 0.5rem;
    text-transform: none;
    transition: all 0.2s ease-out;

    &:hover {
      background-color: ${props =>
        props.active ? '#007cab' : props.backgroundColor ?? '#E6ECF0'};
      filter: brightness(${props => (props.active ? 1.1 : 0.9)});
    }
  }
`;

const StyledImage = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.375rem;
`;

const TaskListAction = React.forwardRef(
  (
    { active, children, icon, activeIcon, alt, onClick, ...otherProps },
    ref,
  ) => {
    const currentIcon = active ? activeIcon ?? icon : icon;

    return (
      <StyledButton
        buttonRef={ref}
        onClick={onClick}
        active={active}
        {...otherProps}
      >
        {currentIcon && <StyledImage src={currentIcon} alt={alt} />}
        {children}
      </StyledButton>
    );
  },
);

export default TaskListAction;

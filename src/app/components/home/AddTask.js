import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Toolbar from '@material-ui/core/Toolbar';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddIcon from '@material-ui/icons/Add';

const StyledToolbar = styled(Toolbar)`
  && {
    padding: 0 38px 0 48px;
  }
`;

const StyledButton = styled(ButtonBase)`
  && {
    background: #e6ecf0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    height: 40px;
    width: 100%;
  }
`;

const StyledAddIcon = styled(AddIcon)`
  && {
    color: #d9036b;
    width: 40px;
    height: 40px;
    padding: 5px;
  }
`;

const StyledAddIconRight = styled(StyledAddIcon)`
  && {
    color: #fff;
    background: #d9036b;
  }
`;

const StyledButtonLabel = styled.span`
  font-size: 14px;
  flex-grow: 1;
  text-align: left;
`;

const AddTask = ({ onClick }) => (
  <StyledToolbar>
    <StyledButton focusRipple onClick={onClick}>
      <StyledAddIcon />
      <StyledButtonLabel>Add a task</StyledButtonLabel>
      <StyledAddIconRight />
    </StyledButton>
  </StyledToolbar>
);

AddTask.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddTask;

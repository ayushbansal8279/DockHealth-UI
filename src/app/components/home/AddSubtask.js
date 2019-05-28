import React from 'react';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddIcon from '@material-ui/icons/Add';

const AddSubtaskContainer = styled(ButtonBase)`
  && {
    padding: 8px;
    margin-left: -8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
`;

const AddButton = styled.div`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background: #0ca1c7;
    color: #fff;
    font-weight: bold;
  }
`;

const StyledAddIcon = styled(AddIcon)`
  && {
    width: 17px;
    height: 17px;
  }
`;

const AddLabel = styled.div`
  margin-left: 4px;
  color: #0ca1c7;
  font-size: 14px;
  line-height: 16px;
`;

const AddSubtask = () => {
    return <AddSubtaskContainer><AddButton><StyledAddIcon /></AddButton><AddLabel>Add a subtask</AddLabel></AddSubtaskContainer>;
};

export default AddSubtask;

import React from 'react';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import IncompleteIcon from '../img/checkbox-incomplete.svg';
import CompleteIcon from '../img/checkbox-complete.svg';

const StyledImg = styled.img`
  width: 30px;
  height: 30px;
`;

const icon = () => <StyledImg src={IncompleteIcon} />;

const checkedIcon = () => <StyledImg src={CompleteIcon} />;

const StyledCheckbox = styled(Checkbox).attrs({
  classes: { checked: 'checked' },
  icon,
  checkedIcon,
  // disableRipple: true,
})`
  //&& {
  //  width: 50px;
  //  height: 50px;
  //  img {
  //    max-width: initial;
  //  }
  //}
  &&.checked {
    color: #00a73c;
  }
`;

const TaskCheckbox = ({ checked, onChange, disabled, style }) => (
  <StyledCheckbox
    checked={checked}
    onChange={onChange}
    disabled={disabled}
    style={style}
  />
);

export default TaskCheckbox;

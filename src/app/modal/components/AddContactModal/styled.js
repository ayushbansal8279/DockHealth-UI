import { withStyles } from '@material-ui/core/styles';
import { ButtonGroup } from '@material-ui/core';
import styled from 'styled-components';

export const ButtonGroupFlexStyled = withStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    gap: '50px',
  },
})(ButtonGroup);

export const ContactStepFormStyled = styled.form`
  width: 100%;
`;

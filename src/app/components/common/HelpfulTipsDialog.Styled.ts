import { Button, Dialog } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette from 'app/palette';

export const DialogComponent = withStyles({
  paper: {
    background: 'linear-gradient(180deg, #01A1E4 0%, #0171AD 100%)',
    border: 0,
    borderRadius: '0.75rem',
    maxWidth: '45rem',
    overflowY: 'hidden',
    paddingBottom: '0.375rem',
    width: '45rem',
  },
})(Dialog);

export const HeaderContainer = styled.div`
  align-items: center;
  color: white;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: auto 1fr auto;
  height: 2.25rem;
  padding: 0 0.5rem;
  width: 100%;
`;

export const TitleContainer = styled.div`
  background-color: ${palette.brightBlue};
  box-shadow: 0px 0px 21px rgba(0, 0, 0, 0.07);
  color: ${palette.white};
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
  width: 100%;
`;

export const ChildrenContainer = styled.div`
  border-radius: 0.75rem;
  padding: 0.25rem;
  width: 100%;

  > * {
    border-radius: inherit;
    object-fit: cover;
    width: 100%;
  }
`;

export const StepperContainer = styled.div`
  align-items: center;
  display: flex;
  height: 2rem;
  justify-content: center;
  width: 100%;
`;

export const StepperDot = styled.div<{ active: boolean }>`
  background-color: ${props => (props.active ? palette.white : 'transparent')};
  border: 0.0625rem solid ${palette.white};
  border-radius: 0.5rem;
  cursor: pointer;
  height: 0.5rem;
  margin: 0 0.25rem;
  transition: all 0.25s ease-out;
  width: 0.5rem;
`;

export const FooterContainer = styled.div`
  align-items: flex-start;
  color: white;
  display: flex;
  height: 3rem;
  justify-content: flex-end;
  padding: 0 1.5rem;
  width: 100%;
`;

export const NextButton = withStyles({
  root: {
    minHeight: 'unset',
    padding: '0.5rem',
  },
  contained: {
    minWidth: '8.25rem',
  },
})(Button);

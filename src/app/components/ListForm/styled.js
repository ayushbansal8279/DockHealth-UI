import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const FormContainer = styled.form`
  align-items: flex-start;
  background-color: ${palette.white};
  display: flex;
  flex-basis: auto;
  flex-flow: column wrap;
  font-family: 'Roboto Condensed', sans-serif;
  min-width: 592px; // per design
  padding: 1.5rem;
  width: 100%;

  & > * {
    margin: 0.25rem 0;
  }
`;

export const FormLabel = styled.h1`
  color: ${palette.brightBlue};
  font-size: 1.25rem;
  margin: 0;
`;

export const FormDivider = styled.hr`
  && {
    border-bottom: 0.125rem solid ${palette.unknownGrey6};
    left: -1.5rem;
    margin: 1rem 0;
    position: relative;
    width: calc(100% + 3rem);
  }
`;

export const StyledButton = withStyles({
  root: {
    minWidth: 'unset',
  },
  contained: {
    minWidth: '12rem',
  },
})(Button);

export const CancelButton = styled.button`
  color: ${palette.lightGray};
  cursor: pointer;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.bold};
  margin-right: ${spacing.large};
  text-decoration: underline;
  text-transform: uppercase;

  &:hover {
    color: ${palette.mediumGrey};
  }
`;

export const FormIconContainer = styled.div`
  color: ${palette.coolGrey1};
`;

export const TickIconContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  min-width: 1rem;
  width: 1rem;

  & svg {
    object-fit: contain;
    width: 100%;
  }
`;

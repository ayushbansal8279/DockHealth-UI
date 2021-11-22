import styled from 'styled-components';
import { Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const FilterButtonWrapper = styled(Button)`
  && {
    border-radius: 0;
    background-color: ${props =>
      props.active ? palette.blueOcean : 'transparent'};
    :hover {
      background-color: ${props =>
        props.active ? palette.blueOcean : 'transparent'};
    }
  }
`;

export const FilterButtonLabel = withStyles({
  root: {
    fontFamily: 'Montserrat, sans-serif',
    color: props => (props.active ? palette.white : palette.coolGrey1),
    fontWeight: props =>
      props.active ? fontWeights.bold : fontWeights.regular,
    display: 'inline-block',
    marginRight: spacing.tiny,
  },
})(Typography);

export const FilterClearButtonWrapper = styled(Button)`
  && {
    border-radius: 0;
    background-color: ${palette.darkBlue};
    :hover {
      background-color: ${palette.darkBlue};
    }
  }
`;

export const FilterClearButtonLabel = withStyles({
  root: {
    fontFamily: 'Montserrat, sans-serif',
    color: palette.white,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.regular,
    display: 'inline-block',
    marginRight: spacing.tiny,
  },
})(Typography);

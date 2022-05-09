import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const ProgressText = styled.p`
  display: block;
  margin: 0;
  margin-left: 16px;
  font-size: ${fontSizes.smallPlus};
  color: ${palette.coolGrey2};
`;

export const useLinearProgressStyles = makeStyles({
  barColorPrimary: {
    backgroundColor: palette.midnightBlue,
  },
  colorPrimary: {
    backgroundColor: palette.coolGrey2,
  },
});

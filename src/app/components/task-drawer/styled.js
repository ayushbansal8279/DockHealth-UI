import styled from 'styled-components';
import palette from 'styles/palette';
import { Close } from '@material-ui/icons';
import { fontWeights, fontSizes } from 'styles/font';

export const EndAdornmentContainer = styled.div`
  align-items: center;
  align-self: flex-end;
  color: ${palette.orange};
  display: flex;
  justify-content: center;
  margin-bottom: 0.7rem;
  width: 2ch;
  position: relative;
  top: -14px;
`;

export const AdornmentClear = styled(Close)`
  && {
    width: 20px;
    height: 20px;
    color: ${palette.coolGrey2};
    cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};
  }
`;

export const HorizontalLabel = styled.span`
  font-family: 'Roboto Condensed', sans-serif;
  margin-right: 5px;
  font-weight: ${fontWeights.bold};
  & > * {
    font-size: 1rem;
    margin-right: 5px;
  }
`;

export const PatientLinkText = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  color: ${palette.brightBlue};
  white-space: nowrap;
`;

import styled from 'styled-components';
import palette from 'styles/palette';
import { Close } from '@material-ui/icons';

export const AdornmentContainer = styled.div`
  align-items: center;
  align-self: flex-end;
  color: ${palette.orange};
  display: flex;
  justify-content: center;
  margin-bottom: 0.3rem;
  width: 2ch;
  position: relative;
  top: -6px;
`;

export const CustomAdornmentContainer = styled(AdornmentContainer)`
  display: inline;
  top: -0px;
`;

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
  color: ${palette.coolGrey1};
  font-family: 'Roboto Condensed', sans-serif;
  margin-right: 5px;
  & > * {
    font-size: 1rem;
    margin-right: 5px;
  }
`;

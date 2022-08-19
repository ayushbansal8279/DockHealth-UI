import styled from 'styled-components';
import palette from 'styles/palette';
import { Close } from '@material-ui/icons';

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

export const FiledInListName = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 250px;
`;

export const TopSectionFiledIn = styled.div`
  @media screen and (max-width: 800px) {
    display: none;
  }
`;

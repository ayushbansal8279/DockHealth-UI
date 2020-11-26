import styled from 'styled-components';
import { Close } from '@material-ui/icons';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const ListContainer = styled.ul`
  width: ${({ width }) => width}px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${palette.white};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
}`;

export const ListItem = styled.li`
  width: 100%;
`;

export const ListItemButton = styled.button`
  width: 100%;
  cursor: pointer;
  font-family: 'Roboto Condensed', sans-serif;

  ${({ isHovered }) => isHovered && `background: ${palette.blueGrey};`}
`;

export const AdornmentClear = styled(Close)`
  && {
    width: 20px;
    height: 20px;
    color: ${palette.coolGrey2};
    cursor: pointer;
  }
`;

export const AddItemButton = styled.button`
  color: ${palette.blueOcean};
  font-size: ${fontSizes.smallPlus};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

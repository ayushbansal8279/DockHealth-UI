import styled from 'styled-components';
import palette, { typography } from 'styles/palette';

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
  font-family: inherit;

  ${({ isHovered }) => isHovered && `background: ${palette.blueGrey};`}
  ${({ readOnly }) => readOnly && `pointer-events: none;`}
`;

export const ListItemRefineButton = styled.button`
  width: 100%;
  font-family: inherit;
  color: ${palette.oPlusRed};
  height: 42px;

  ${({ isHovered }) => isHovered && `background: ${palette.blueGrey};`}
`;

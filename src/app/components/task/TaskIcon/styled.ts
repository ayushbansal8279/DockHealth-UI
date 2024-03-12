import styled from 'styled-components';
import palette from 'styles/palette';

const ICON_HOVERED_COLOR = palette.brightBlue;

export const Wrapper = styled.div<{
  isActive?: boolean;
}>`
  position: relative;
  color: ${palette.coolGrey3};
  transition: color 0.3s ease-out;
  &:hover {
    color: ${ICON_HOVERED_COLOR};
  }

  ${({ isActive }) =>
    isActive
      ? `color: ${palette.lightGrey};`
      : `
          &:hover {
            color: ${ICON_HOVERED_COLOR};
          }
  `}
`;

export const NewLabel = styled.div<{ isHidden?: boolean }>`
  position: absolute;
  top: -4px;
  right: -6px;
  width: 12px;
  height: 12px;
  border: 2px solid ${palette.white};
  border-radius: 6px;
  background-color: ${palette.oPlusRed};
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  transition: opacity 0.3s ease-out;
`;

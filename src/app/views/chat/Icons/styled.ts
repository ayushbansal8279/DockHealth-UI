import styled from 'styled-components';
import palette from 'styles/palette';

const ICON_HOVERED_COLOR = palette.coolGrey2;

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
  top: 2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 6px;
  background-color: #feb52b;
  border: 1px solid #ffffff;
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  transition: opacity 0.3s ease-out;
`;

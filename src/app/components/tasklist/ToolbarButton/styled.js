import styled from 'styled-components';
import palette from 'styles/palette';

export const CustomizeButton = styled.button`
  display: flex;
  padding: 4px 12px;
  align-items: center;
  background: ${palette.newDarkBlue};
  color: ${({ color }) => color || palette.white};
  ${({ disableButton }) => `opacity: ${disableButton ? 0.5 : 1};`}
  height: 40px;
  width: auto;
  border-radius: 4px;

  &:hover {
    background: ${palette.newBrightBlueShaded};
  }

  & .switchIcon > path {
    fill: ${palette.white || palette.white};
  }
  @media print {
    display: none;
  }
  @media (max-width: 867px) {
    display: ${({ wide }) => {
      if (wide) return 'none';
    }};
  }
`;

export const SelectIcon = styled.span`
  border-right: 2px solid ${palette.white};
  height: 40px;
  display: flex;
  align-items: center;
  padding-right: 10px;
  filter: brightness(0) invert(1);
`;

export const ImageContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  filter: brightness(0) invert(1);
`;

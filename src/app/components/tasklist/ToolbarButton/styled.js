import styled from 'styled-components';
import palette from 'styles/palette';

export const CustomizeButton = styled.button`
  display: flex;
  height: 46px;
  padding: 4px 12px;
  align-items: center;
  border-radius: 5px;
  color: ${({ color }) => color || palette.darkGrey};
  ${({ disableButton }) => `opacity: ${disableButton ? 0.5 : 1};`}

  &:hover {
    background: ${palette.coolGrey3};
  }
  @media print {
    display: none;
  }
`;

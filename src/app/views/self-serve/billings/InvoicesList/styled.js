import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';

export const InvoicesListContainer = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ChargeDetailsLink = styled.a`
  color: ${palette.cyanBlue};
  cursor: pointer;
  filter: brightness(1);
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.cyanBlue};
    filter: brightness(1.35);
  }
`;

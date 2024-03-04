import styled from 'styled-components';
import { fontWeights } from 'styles/font';

export const HorizontalLabel = styled.span`
  font-family: inherit;
  margin-right: 5px;
  font-weight: ${fontWeights.bold};
  & > * {
    font-size: 1rem;
    margin-right: 5px;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 50%;
  width: 100%;

  &:hover {
    background-color: #f5f5f5;
  }
`;

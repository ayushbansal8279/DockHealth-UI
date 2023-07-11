import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const EmptyListContainer = styled.div`
  padding: 2rem;
  text-align: center;
  flex: 1;
`;

export const EmptyListIcon = styled.div`
  display: inline-block;
  margin-bottom: 21px;
  height: 71px;
  width: 47px;
`;

export const ActionButton = styled.button`
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regular};

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

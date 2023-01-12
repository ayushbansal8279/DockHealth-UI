import styled from 'styled-components';
import { fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const StyledAddButton = styled.button`
  color: ${palette.coolGrey1};
  outline: none;
  border: none;
  border-radius: 9px;
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: ${fontWeights.bold};
  padding: ${spacing.tiny} 10px;
  transition: background-color 0.3s linear;

  & > span {
    color: ${palette.orange};
  }

  &:hover {
    background-color: #f9fafc;
    cursor: pointer;
  }
`;

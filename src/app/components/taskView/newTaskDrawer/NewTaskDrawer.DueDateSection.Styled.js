/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';

export const DueDateLabelContainer = styled.div`
  align-items: center;
  color: ${palette.coolGrey1};
  cursor: pointer;
  display: flex;
  padding: 0.5rem;

  &:hover {
    background-color: ${palette.coolGrey4};

    && > * {
      font-weight: bold;
    }
  }
`;

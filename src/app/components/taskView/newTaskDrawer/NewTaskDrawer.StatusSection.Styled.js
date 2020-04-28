import { prop } from 'ramda';
import styled from 'styled-components';
import palette from 'styles/palette';

export const StatusLabelContainer = styled.div`
  align-items: center;
  color: ${palette.coolGrey1};
  cursor: pointer;
  display: grid;
  grid-gap: 0.75rem;
  grid-template-columns: 0.25rem 1fr;
  padding: 0.5rem 0.75rem;

  &:hover {
    background-color: ${palette.coolGrey4};

    && > * {
      font-weight: bold;
    }
  }
`;

export const StatusFlag = styled.div`
  background-color: ${prop('color')};
  height: 100%;
  width: 0.25rem;
`;

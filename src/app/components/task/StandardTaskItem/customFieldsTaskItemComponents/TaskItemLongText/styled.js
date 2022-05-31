/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';

export const Text = styled.p`
  margin-bottom: 0;
  color: ${palette.mediumGrey};
  text-overflow: ellipsis;
  @media not print {
    overflow: hidden;
    white-space: nowrap;
  }
  @media print {
    overflow: auto;
    white-space: wrap;
  }
`;

export const LongTextBox = styled.div`
  width: 100%;
  height: 28px;
  margin-bottom: 0;
  color: ${palette.mediumGrey};
  cursor: pointer;
`;

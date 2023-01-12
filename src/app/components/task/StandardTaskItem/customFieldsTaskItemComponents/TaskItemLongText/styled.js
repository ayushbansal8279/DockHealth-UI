import styled from 'styled-components';
import palette from 'styles/palette';

export const Text = styled.p`
  margin-bottom: 0;
  color: ${palette.mediumGrey};
  @media not print {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  @media print {
    text-overflow: auto;
    overflow: auto;
    white-space: wrap;
  }
`;

export const LongTextBox = styled.div`
  width: 100%;
  margin-bottom: 0;
  color: ${palette.mediumGrey};
  cursor: pointer;
  @media not print {
    height: 28px;
  }
`;

export const Divider = styled.hr`
  width: 100%;
  margin: 0;
  border-color: ${palette.coolGrey3};
`;

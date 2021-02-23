import styled from 'styled-components';
import palette from 'styles/palette';

export const EmailBodyContainer = styled.div`
  background-color: ${palette.blueGrey};
  margin-top: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  word-break: break-word;
`;

export const EmailMessageContainer = styled.pre`
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;

  letter-spacing: 0.230769px;
`;

import styled from 'styled-components';
import spacing from 'styles/spacing';

export const ReminderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-top: -22px;
  margin-bottom: ${spacing.regular};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.4 : 1)};
  transition: opacity 0.4s ease-out;
  font-family: 'Roboto Condensed', sans-serif;
`;

export const Description = styled.p`
  display: inline-block;
  margin-bottom: 0;
`;

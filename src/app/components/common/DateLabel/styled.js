import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const DueDateBasicLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px ${spacing.tiny};
  border-radius: 6px;
  background: ${({ isOverdue }) => (isOverdue ? '#e84739' : '#949aa4')};
  color: ${palette.white};
  font-size: ${fontSizes.small};
`;

export const DateText = styled.p`
  margin-bottom: 0;
`;

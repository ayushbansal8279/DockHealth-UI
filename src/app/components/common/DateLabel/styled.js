import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const DueDateBasicLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: ${fontSizes.small};
`;

export const DateText = styled.p`
  margin-bottom: 0;
`;

export const DateTextContainer = styled.div`
  align-items: center;
  border-radius: 2px;
  background: ${({ isOverdue }) =>
    isOverdue ? `${palette.oPlusRed}` : `${palette.white}`};
  padding: 3px ${spacing.small};
  color: ${({ isOverdue }) =>
    isOverdue ? `${palette.white}` : `${palette.black}`};
`;

export const ReminderIconContainer = styled.div`
  background: ${({ isOverdue }) =>
    isOverdue ? `${palette.oPlusRed}` : `${palette.coolGrey1}`};
  padding-left: ${spacing.small};
`;

export const RecurringIconContainer = styled.div`
  color: ${({ isOverdue }) => (isOverdue ? '#ec4f3e' : '#8492A4')};
  padding-left: ${spacing.small};
`;

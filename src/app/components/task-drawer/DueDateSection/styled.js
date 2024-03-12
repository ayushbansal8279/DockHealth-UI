import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { Popover } from '@mui/material';

export const DueDateContentWrapper = styled.div`
  width: 100%;
  padding: ${spacing.tiny} 0;
  text-align: left;
  border-bottom: 1px solid ${palette.coolGrey1};
  padding: 25px 10px 6px 10px;
`;

export const DueDateSectionWrapper = styled.div`
  display: flex;
  align-items: center;
  font-family: Outfit;
  margin-left: 10px;

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    
  `}
`;

export const Title = styled.div`
  margin-right: 40px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  display: flex;
  align-items: center;
`;

export const SubTitle = styled.div`
  margin-left: 10px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
`;

export const AddDateButton = styled.button`
  color: black;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DateViewContainer = styled.div`
  margin-left: 5px;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 4px 8px;
  border-radius: 8px;
  color: ${({ isOverdue }) =>
    isOverdue ? `${palette.white}` : `${palette.black}`};
  background: ${({ isOverdue }) =>
    isOverdue ? `${palette.oPlusRed}` : '#F8F8F9'};
`;

export const DateViewText = styled.div`
  font-family: Outfit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
`;

export const ReminderIconContainer = styled.div`
  color: ${({ isOverdue }) =>
    isOverdue ? `${palette.oPlusRed}` : `${palette.coolGrey1}`};
  padding-left: ${spacing.small};
`;

export const RecurringIconContainer = styled.div`
  color: ${({ isOverdue }) =>
    isOverdue ? `${palette.oPlusRed}` : `${palette.coolGrey1}`};
  padding-left: ${spacing.small};
`;

export const StyledPopover = styled(Popover)`
  .MuiPopover-paper {
    border: none;
    box-shadow: none;
    width: ${({ width }) => width};
    overflow: visible;
  }
`;

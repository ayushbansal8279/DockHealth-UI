import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { Popover } from '@mui/material';


export const ReminderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: ${spacing.tiny};
  transition: opacity 0.4s ease-out;
  font-family: inherit;
  margin-left: 135px;
`;

export const Description = styled.p`
  display: inline-block;
  margin-bottom: 0;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.4 : 1)};
`;

export const ReminderTypeSelectOption = styled.div`
  width: 100%;
  padding: ${spacing.smallPlus};
  text-align: left;
  font-family: inherit;
  color: ${palette.coolGrey1};
  background-color: ${({ isActive }) =>
    isActive ? palette.coolGrey4 : 'transparent'};
  font-weight: ${({ isActive }) =>
    isActive ? fontWeights.bold : fontWeights.light};
`;

export const SelectArrowImg = styled.img`
  height: 7px;
  cursor: pointer;
  pointer-events: none;
`;

export const StyledPopover = styled(Popover)`
  .MuiPopover-paper {
    border: none;
    box-shadow: none;
    width: ${({ width }) => width};
    overflow: visible;
  }
`;

export const DateViewContainer = styled.div`
  margin-left: 7px;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 4px 8px;
  border-radius: 8px;
  color: ${palette.black};
  background: #F8F8F9;
`;

export const DateViewText = styled.div`
  font-family: Outfit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
`;

export const ContentWrapper = styled.div`
  padding-top: ${spacing.tiny};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 320px;
  border: none;
  font-family: inherit;
`;

export const Divider = styled.hr`
  width: 100%;
  margin: 0;
  border-color: ${palette.coolGrey3};
`;

export const QuickAddSectionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${spacing.small};
`;

export const AddSectionWrapper = styled.div`
  align-items: center;
  display: flex;
`;

export const QuickSelectButton = styled.button`
  width: 100%;
  padding: ${spacing.tiny} ${spacing.regular};
  background: ${palette.coolGrey4};
  border-radius: 13px;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};

  ${({ isSelected }) =>
    isSelected &&
    `
    background: ${palette.brightBlue};
    color: ${palette.white};
  `}
`;

export const Label = styled.div`
  padding: 0 ${spacing.small};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
`;

export const BottomBar = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 ${spacing.regular};
  background-color: ${palette.coolGrey4};
`;

export const ActionButton = styled.button`
  width: auto;
  padding: ${spacing.tiny} ${spacing.small};
  color: ${({ textColor }) => textColor || palette.midnightBlue};
`;

export const SectionWrapper = styled.div`
  width: 100%;
  padding: ${spacing.regularPlus} ${spacing.regular};
`;

export const PlusButton = styled(ActionButton)`
  color: ${palette.coolGrey1};

  &:before {
    display: inline-block;
    margin-right: ${spacing.tiny};
    content: '+';
    vertical-align: middle;
    color: ${palette.orange};
  }
`;

export const RecurringForm = styled.form`
  width: 100%;
`;

export const FormRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const RowLabel = styled.label`
  color: ${palette.darkGrey};
  font-family: inherit;
  font-weight: ${fontWeights.bold};
`;

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;


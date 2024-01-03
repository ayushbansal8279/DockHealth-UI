import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette, { typography } from 'styles/palette';
import { fontSizes } from 'styles/font';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export const ListPickerModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 384px; // per design
  width: 100%;
`;

export const AddListForm = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

export const AddListInputWrapper = styled.div`
  position: relative;
  width: 100%;
  font-size: ${fontSizes.smallPlus};

  ${({ isFocused }) =>
    !isFocused &&
    `&:before {
    position: absolute;
    top: 50%;
    left: ${spacing.regularPlus};
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.orange};
    font-size: ${fontSizes.regular};
  }`}
`;

export const AddListInput = styled.input`
  height: auto;
  padding: ${spacing.smallPlus} ${spacing.huge};
  margin-bottom: 0;
  border-color: ${palette.coolGrey2};
  border-top: none;
  font-size: ${fontSizes.regular};
  box-shadow: none;

  &:focus {
    border-top: none;
    border-color: ${palette.coolGrey2};
    box-shadow: none;
    padding-left: ${spacing.regularPlus};
  }
`;

export const Title = styled.h2`
  margin-bottom: ${spacing.small};
  font-size: ${fontSizes.regularPlus};
  text-transform: uppercase;
  color: ${palette.brightBlue};
  font-family: ${typography.text};
`;

export const Description = styled.p`
  margin-bottom: 0;
  color: ${palette.darkGrey};
  font-size: ${fontSizes.regular};
`;

export const ListsWrapper = styled.div`
  flex: 1;
  width: 100%;
  border: 1px solid ${palette.coolGrey2};
  overflow: auto;
`;

export const ListItemTextButton = styled.button`
  flex: 1;
  margin: 0;
  padding: ${spacing.smallPlus} ${spacing.regularPlus};
  font-size: ${fontSizes.regular};
  text-align: left;
  outline: none;
  cursor: ${({ isSelected }) => (isSelected ? 'initial' : 'pointer')};
`;

export const NextArrow = styled(ChevronRightIcon)`
  color: ${palette.lightGrey};
`;

export const ListItem = styled.div`
  display: block;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  appearance: none;
  border-radius: 0;
  background-color: ${({ isSelected }) =>
    isSelected ? palette.darkBlue : 'transparent'};

  &:hover {
    background-color: ${({ isSelected }) =>
      isSelected ? palette.darkBlue : palette.brightBlueWithAlpha};
  }

  & ${ListItemTextButton} {
    color: ${({ isSelected }) =>
      isSelected ? palette.white : palette.darkGrey};
  }

  & ${NextArrow} {
    color: ${({ isSelected }) =>
      isSelected ? palette.white : palette.lightGrey};
  }
`;

export const EmptyMessage = styled.p`
  color: ${palette.coolGrey2};
  margin-top: ${spacing.huge};
  text-align: center;
`;

export const TitleWithButtonWrapper = styled.div`
  position: relative;
  padding-left: ${spacing.giga};
  overflow: visible;

  & > button {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    color: ${palette.brightBlue};
    cursor: pointer;
  }
`;

export const QuickAddInputWrapper = styled.div`
  position: relative;
  width: 100%;
  font-size: ${fontSizes.smallPlus};

  &:before {
    position: absolute;
    top: 50%;
    left: ${spacing.regularPlus};
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.orange};
    font-size: ${fontSizes.regular};
  }

  ${({ isFocused }) =>
    isFocused &&
    `
      &:before {
        opacity: 0;
      }
    `}
`;

export const QuickAddInput = styled.input`
  height: auto;
  padding: ${spacing.smallPlus} ${spacing.huge};
  margin-bottom: 0;
  border-color: ${palette.coolGrey2};
  border-top: none;
  font-size: ${fontSizes.regular};
  box-shadow: none;

  &:disabled {
    background-color: transparent;
  }

  &:focus {
    border-top: none;
    border-color: ${palette.coolGrey2};
    box-shadow: none;
  }
`;

export const Step = styled.div`
  height: 100%;
  flex: 384px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

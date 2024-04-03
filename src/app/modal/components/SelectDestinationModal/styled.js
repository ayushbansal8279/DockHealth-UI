import styled from 'styled-components';
import spacing from 'styles/spacing';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import palette, { typography } from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const StepsContainer = styled.div`
  display: flex;
  height: 100%;
  widht: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  transform: translateX(-${({ stepIndex }) => stepIndex * 384 || 0}px);
  transition: transform 0.3s ease-out;
`;

export const Step = styled.div`
  height: 100%;
  flex: 384px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Container = styled.div`
  height: 384px;
  width: 384px;
  overflow: hidden;
`;

export const QuickAddInputWrapper = styled.div`
  position: relative;
  width: 100%;
  font-size: ${fontSizes.smallPlus};

  &:before {
    position: absolute;
    top: 50%;
    left: 115px;
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.blueOcean};
    font-size: ${fontSizes.large};
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
  text-align: center;

  &:disabled {
    background-color: transparent;
  }

  &:focus {
    border-top: none;
    border-color: ${palette.coolGrey2};
    box-shadow: none;
  }
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

export const Title = styled.h2`
  margin: 0;
  font-size: ${fontSizes.regularPlus};
  color: ${palette.offBlack};
  font-family: inherit;
  text-align: Center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  gap: 8px;
  align-self: stretch;
  text-align: center;
  font-family: Outfit;
  font-size: 22px;
  font-style: normal;
  font-weight: ${fontWeights.regularPlus};
  line-height: 25px; /* 113.636% */
  text-transform: capitalize;
`;

export const Description = styled.p`
  margin-bottom: 0;
  color: ${palette.darkGrey};
  font-size: ${fontSizes.regular};
  text-align: center;
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
  color: ${palette.offBlack} !important;
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
    isSelected ? palette.brightBlueWithAlpha : 'transparent'};

  &:hover {
    background-color: ${palette.brightBlueWithAlpha};
  }
`;

export const EmptyMessage = styled.p`
  color: ${palette.coolGrey2};
  margin-top: ${spacing.huge};
  text-align: center;
`;

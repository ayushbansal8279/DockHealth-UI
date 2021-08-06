import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const Option = styled.span`
  color: ${({ hasSelectedOption }) =>
    hasSelectedOption ? palette.brightBlue : 'gray'};
  border-width: 5px;
  border-color: ${palette.brightBlue};
  border-bottom-style: dotted;
  opacity: ${({ hasSelectedOption }) => (hasSelectedOption ? 1 : 0.4)};
  cursor: pointer;
  &:hover {
    opacity: 1;
    color: ${palette.brightBlue};
  }
`;

export const TutorialOptionsContainer = styled.span`
  color: rgba(128, 128, 128, 0.4);
`;

export const OptionInput = styled.input`
  min-width: 270px;
  color: ${({ hasSelectedOption }) =>
    hasSelectedOption ? palette.brightBlue : 'gray'};
  border-top: none;
  border-left: none;
  border-right: none;
  border-width: 5px;
  border-color: ${palette.brightBlue}
  border-bottom-style: dotted;
  opacity: ${({ hasSelectedOption }) => (hasSelectedOption ? 1 : 0.4)};
  cursor: pointer;
  outline: none;

  &:hover,
  &:focus {
    opacity: 1;
    color: ${palette.brightBlue}
  }
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 48px;
`;

export const QuestionContainer = styled.div`
  font-size: 48px;
  font-weight: 700;
  font-family: Montserrat;
  color: #0f1c2e;
`;

export const PickerItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 4px;
  cursor: pointer;
  width: 300px;

  & > span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const StyledInput = styled.input`
  width: 320px;
  padding: ${spacing.regular};
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid ${palette.coolGrey3};
  background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%),
    #ffffff;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.mediumGrey};

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${palette.coolGrey2};
    text-transform: uppercase;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const ShadowWrapper = styled.div`
  border: 2px solid black;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`;

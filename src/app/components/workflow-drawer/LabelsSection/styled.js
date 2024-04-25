import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const OptionButtonsContainer = styled.div`
  display: flex;
`;

export const OptionButton = styled.button`
  display: flex;
  padding: 0;
  outline: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
  margin-right: ${spacing.small};
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.small};
  opacity: 0;
  &:hover {
    color: ${palette.darkGrey};
  }
`;

export const OptionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: ${spacing.small};
  background-color: ${({ disabled }) =>
    disabled ? palette.coolGrey4 : 'transparent'};

  &:hover {
    ${OptionButton} {
      opacity: 1;
    }
  }
`;

export const OptionButtonsInput = styled.input`
  border: 0;
  padding: 0;
  outline: none;
  width: 550px;
  background-color: transparent;
  cursor: pointer;
  color: ${({ greyed }) => (greyed ? palette.coolGrey2 : palette.mediumGrey)};
  border: none;
  outline: none;
  box-shadow: none;

  &:focus {
    cursor: text;
  }
`;

export const NoOptionTextLabel = styled.span`
  cursor: pointer;
  color: ${palette.brightBlue};
  font-weight: 600;
`;

export const NoOptionContainer = styled.div`
  padding: ${spacing.small};

  &:hover {
    background-color: #f1f1f1;
    color: black;
  }
`;

export const LableContainer = styled.div`
  display: Grid;
  grid-template-columns: 10% auto;
  margin-left: 10px;
  Gap: 30px;
  padding-top: 10px;
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
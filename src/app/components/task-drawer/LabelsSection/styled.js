import Chip from '@material-ui/core/Chip';
import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const OptionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

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
  margin-right: ${spacing.tiny};
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.smallPlus};

  &:hover {
    color: ${palette.darkGrey};
  }
`;

export const OptionButtonsInput = styled.input`
  border: 0;
  padding: 0;
  outline: none;
  width: fit-content;
  background-color: transparent;
  cursor: pointer;
  color: ${palette.mediumGrey};
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

export const LabelChip = styled(Chip)`
  && {
    height: ${spacing.large};
    margin-right: ${spacing.tiny};
  }
`;

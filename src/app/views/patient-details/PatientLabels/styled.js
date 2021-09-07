import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const PatientLabelsContainer = styled.div`
  display: flex;
  padding: ${spacing.small} ${spacing.huge};
  justify-content: space-between;
  width: 100%;
  background-color: white;
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

export const NoOptionContainer = styled.div`
  padding: ${spacing.small};

  &:hover {
    background-color: #f1f1f1;
    color: black;
  }
`;

export const ReadOnlyLabelsContainer = styled.div`
  display: inline-flex;
  padding: 8px 0;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
`;

export const ReadOnlyLabelContainer = styled.div`
  padding: 1px 0;
`;

export const useAutocompleteStyles = makeStyles({
  inputRoot: {
    paddingTop: '0 !important',
  },
});

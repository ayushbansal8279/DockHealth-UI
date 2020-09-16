import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import { Grid } from '@material-ui/core';

export const FormWrapper = styled.form`
  width: 100%;
`;

export const UserDetailsFormWrapper = styled.div`
  width: 100%;
  padding: ${spacing.regularPlus};
`;

export const InfoContainer = styled.div`
  width: 100%;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
`;

export const InfoHeader = styled.h4`
  margin-bottom: 0;
  color: ${palette.brightBlue};
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
`;

export const InfoText = styled.p`
  margin-bottom: 0;
  color: ${palette.coolGrey1};
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
`;

export const Step = styled.button`
  display: inline-block;
  height: 8px;
  width: 8px;
  border: 1px solid ${palette.coolGrey2};
  border-radius: 4px;
  outline: none;
  ${({ isCurrent }) => isCurrent && `background: ${palette.coolGrey2};`}
  ${({ isDisabled }) => !isDisabled && 'cursor: pointer;'}

  &:not(:last-child) {
    margin-right: ${spacing.tiny};
  }
`;

export const RoleFormWrapper = styled(Grid)`
  height: 310px;
  padding: ${spacing.regular} 0 ${spacing.regularPlus} 0;
  font-family: 'Roboto', sans-serif;
  color: ${palette.mediumGrey};
`;

export const RoleSelectionHeader = styled.h3`
  margin-bottom: 0;
  padding: 0 ${spacing.regularPlus} ${spacing.smallPlus};
  font-family: inherit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
`;

export const Divider = styled.hr`
  height: 0.5px;
  margin: 0;
  color: ${palette.coolGrey1};
`;

export const RoleSelectionWrapper = styled.div`
  flex: 1;
  flex-direction: column;
  padding-bottom: ${spacing.regular};

  & > input {
    display: none;
  }
`;

export const RoleOptionLabel = styled.label`
  display: flex !important;
  flex-direction: column;
  justify-content: center;
  padding: ${spacing.small} ${spacing.regularPlus};
  margin: 0 !important;

  ${({ isSelected }) => isSelected && `background: ${palette.coolGrey3};`}
`;

export const RoleOptionHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`;

export const RoleOptionHeader = styled.h4`
  margin: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
  color: ${palette.mediumGrey};
`;

export const RoleOptionHeaderAdditionalInfo = styled.p`
  margin: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  font-family: 'Roboto Condensed', sans-serif;
  color: ${palette.orange};
  font-style: italic;
`;

export const RoleOptionDescription = styled.p`
  margin: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  font-family: 'Roboto Condensed', sans-serif;
  color: ${palette.coolGrey1};
`;

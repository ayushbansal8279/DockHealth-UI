import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import { Grid } from '@mui/material';

export const FormWrapper = styled.form`
  width: 100%;
`;

export const UserDetailsFormWrapper = styled.div`
  width: 100%;
  padding: ${spacing.regularPlus};
`;

export const InfoContainer = styled.div`
  display: flex;
  width: 100%;
  font-family: inherit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
`;

export const Header = styled.p`
  color: ${palette.offBlack};
  text-align: center;
  font-family: Outfit;
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  line-height: 25px;
  text-transform: capitalize;
`;

export const InfoText = styled.p`
  margin-bottom: 0;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  margin-left: 8px;
`;

export const Step = styled.button`
  display: inline-block;
  height: 8px;
  width: 8px;
  border: 1px solid ${palette.coolGrey2};
  border-radius: 4px;
  outline: none;
  ${({ isCurrent }) => isCurrent && `background: ${palette.coolGrey2};`}
  ${({ isDisabled }) => (isDisabled ? '' : 'cursor: pointer;')}

  &:not(:last-child) {
    margin-right: ${spacing.tiny};
  }
`;

export const RoleFormWrapper = styled(Grid)`
  height: 425px;
  padding: ${spacing.small} 0 0 0;
  font-family: inherit;
  color: ${palette.mediumGrey};
  flex-wrap: nowrap !important;
`;

export const RoleSelectionHeader = styled.p`
  padding: 0 ${spacing.regularPlus} ${spacing.smallPlus};
  font-family: inherit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.offBlack};
  text-align: center;
  font-family: Outfit;
  font-size: 22px;
  font-style: normal;
  line-height: 25px;
  margin-bottom: 0px;
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

  ${({ isSelected }) =>
    isSelected && `background: ${palette.brightBlueWithAlpha};`}
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
  font-family: inherit;
  color: ${palette.orange};
  font-style: italic;
`;

export const RoleOptionDescription = styled.p`
  margin: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  font-family: inherit;
  color: ${palette.coolGrey1};
`;

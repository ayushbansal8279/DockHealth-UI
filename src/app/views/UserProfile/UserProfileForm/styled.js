import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import palette, { typography } from 'styles/palette';

export const SectionSubtypography = styled.div`
  font-size: ${fontSizes.regular};
`;

export const SectionTypography = styled(SectionSubtypography)`
  font-weight: ${fontWeights.bold};
`;

export const FormInfoText = styled.p`
  margin-bottom: 0;
  padding: 0 ${spacing.regularPlus};
  font-family: Outfit, sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
`;

export const InputActionButton = styled.button`
  margin-right: ${spacing.regularPlus};
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  font-family: inherit;
  cursor: pointer;
`;

export const OuterAvatarContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

export const UserAvatarSupplement = styled.div`
  color: ${palette.unknownGrey5};
  cursor: pointer;
  margin-left: 0.6rem;
  padding: ${spacing.regular};
  padding-right: 4rem;
`;

export const SectionTitle = styled.p`
  margin-bottom: 4px;
  font-family: 'Outfit', sans-serif;
  font-weight: ${fontWeights.bold};
  width: 100%;
`;

export const StyledForm = styled.form`
  position: relative;
  width: 100%;
`;

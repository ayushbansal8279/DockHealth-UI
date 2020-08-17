import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const ProfileSettingsWrapper = styled.div`
  max-width: 758px;
  margin: 0 auto;
  padding: 140px 0;
  color: ${palette.mediumGrey};
  font-family: 'Montserrat', sans-serif;
`;

export const ViewHeader = styled.h2`
  margin-bottom: 0;
  font-size: 2.625rem;
  font-weight: ${fontWeights.bold};
  font-family: inherit;
`;

export const ViewDescription = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
`;

export const Divider = styled.hr`
  margin: 0;
  color: ${palette.coolGrey2};
`;

export const SectionHeader = styled.h3`
  margin-bottom: 0;
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
`;

export const OrganizationDetails = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
`;

export const DetailsText = styled.p`
  width: 100%;
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
`;

export const ActionButton = styled.button`
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regular};

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const SettingsSection = styled.section`
  &:not(:first-of-type) {
    margin-top: ${spacing.giga};
  }

  &:not(:last-of-type) {
    margin-bottom: ${spacing.largePlus};
  }
`;

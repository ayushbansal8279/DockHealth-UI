import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const ViewContainer = styled.div`
  background-color: ${palette.white};
  position: relative;
`;

export const ProfileSettingsWrapper = styled.div`
  max-width: 798px;
  width: 100%;
  margin: 0 auto;
  padding: 140px 20px;
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
  font-weight: ${fontWeights.regularPlus};
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
  ${({ noMarginTop }) => !noMarginTop && `margin-top: ${spacing.giga};`}
  ${({ noMarginBottom }) =>
    !noMarginBottom && `margin-bottom: ${spacing.largePlus};`}
`;

export const AppVersionInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 55px ${spacing.large};
  background-color: ${palette.lightGrey2};
`;

export const AppVersionInfoIcon = styled.img`
  display: block;
  width: 183px;
`;

export const AppVersionInfoTextWrapper = styled.div`
  flex: 1;
  margin-bottom: 0;
  padding-right: ${spacing.giga};
  padding-left: ${spacing.large};
  font-size: ${fontSizes.regular};
`;

export const AppVersionInfoHeader = styled.h4`
  font-size: inherit;
  font-family: inherit;
  font-weight: ${fontWeights.bold};
`;

export const AppVersionInfoText = styled.p`
  font-family: inherit;
  font-size: inherit;
  font-weight: ${fontWeights.light};
`;

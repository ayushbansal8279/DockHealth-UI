import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

const SKELETON_ELEMENT_COLOR = palette.coolGrey3;

export const MentionItem = styled.span`
  background-color: rgba(7, 74, 134, 0.07);
  color: ${palette.darkBlue};
  cursor: pointer;
`;

export const PersonCardContainer = styled.div`
  width: 252px;
  background-color: ${palette.white};
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15); // per design
  font-family: 'Roboto Condensed', sans-serif;
`;

export const PersonImageContainer = styled.div`
  width: 100%;
  height: 221px;
  overflow: auto;
`;

export const PersonImage = styled.div`
  height: 100%;
  width: 100%;

  ${({ url }) =>
    url &&
    `background: url(${url}) center center no-repeat; background-size: cover;`}
`;

export const RoleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 28px;
  padding: 0 ${spacing.small};
  background-color: ${SKELETON_ELEMENT_COLOR};
  color: ${palette.white};
  font-weight: ${fontWeights.light};
`;

export const Role = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
`;

export const PersonTasksLink = styled.p`
  margin-bottom: 0;
  color: ${palette.white};
  font-size: ${fontSizes.regular};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProfileInfoSection = styled.div`
  padding: ${spacing.small};
  overflow: hidden;
`;

export const ProfileInfoText = styled.p`
  margin-bottom: 0;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserNameText = styled(ProfileInfoText)`
  font-weight: ${fontWeights.bold};
`;

export const EmailLink = styled.a`
  display: block;
  width: 100%;
  margin-bottom: 0;
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
`;

export const PersonInitialsContainer = styled.div`
  margin: 44px auto 0;
  width: 154px;
  height: 154px;
  border-radius: 77px;
  background-color: ${({ color }) => color || palette.memberGreen};
  overflow: auto;
`;

export const InitialsBorder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  width: 144px;
  height: 144px;
  border: 5px solid ${palette.white};
  border-radius: 72px;
`;

export const Initials = styled.p`
  margin-bottom: 0;
  color: ${palette.white};
  font-family: 'Montserrat', sans-serif;
  font-size: 54px;
  font-weight: ${fontWeights.regular};
`;

// skeleton loader
export const SkeletonLoaderImage = styled.div`
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  margin: 8px;
  background: ${SKELETON_ELEMENT_COLOR};
`;

export const SkeletonLoaderDataContainer = styled.div`
  width: 100%;
  padding: ${spacing.small} ${spacing.tiny};
`;

export const SkeletonLoaderRoleSection = styled.div`
  width: 100%;
  height: 28px;
  background-color: ${SKELETON_ELEMENT_COLOR};
`;

export const SkeletonLoaderText = styled.div`
  height: 19px;
  width: ${({ widthPercentage }) => widthPercentage || 75}%;
  background-color: ${SKELETON_ELEMENT_COLOR};
`;

export const Divider = styled.hr`
  width: 100%;
  margin: 0;
  border-color: ${palette.coolGrey3};
`;

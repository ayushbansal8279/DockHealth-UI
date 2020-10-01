import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

const SKELETON_ELEMENT_COLOR = palette.coolGrey3;

export const MentionItem = styled.span`
  background-color: rgba(7, 74, 134, 0.07);
  color: ${palette.brightBlue};
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

export const RoleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 28px;
  padding: 0 ${spacing.small};
  background-color: ${palette.darkBlue};
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

export const AvatarCircle = styled.div`
  margin: 44px auto 0;
  width: 154px;
  height: 154px;
  border-radius: 77px;
  background-color: ${({ color }) => color || SKELETON_ELEMENT_COLOR};
  overflow: auto;
`;

export const AvatarBorder = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  width: 144px;
  height: 144px;
  border: 5px solid ${palette.white};
  border-radius: 72px;
  overflow: hidden;
`;

export const AvatarImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

export const Initials = styled.p`
  margin-bottom: 0;
  color: ${palette.white};
  font-family: 'Montserrat', sans-serif;
  font-size: 54px;
  font-weight: ${fontWeights.regular};
`;

// skeleton loader
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

export const NameSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const StatusIndicatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: ${spacing.small};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.extraLight};
  color: ${palette.coolGrey1};
`;

export const OnlineIndicator = styled.div`
  background-color: #219653;
  border: 1px solid white;
  border-radius: 50%;
  height: 10px;
  width: 10px;
  margin-right: 5px;
`;

export const IdleIndicator = styled.div`
  background-color: ${palette.blueOcean};
  border: 1px solid white;
  border-radius: 50%;
  height: 10px;
  width: 10px;
  margin-right: 5px;
`;

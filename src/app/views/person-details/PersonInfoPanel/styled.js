import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const InfoPanelContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: ${spacing.large} ${spacing.largePlus};
  font-size: ${fontSizes.regular};
  line-height: 1.2;
  font-weight: ${fontWeights.light};
  background: ${palette.white};
  flex-wrap: wrap;
`;

export const PersonTitle = styled.p`
  display: block;
  margin-bottom: 0;
  padding-left: ${spacing.regular};
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.black};
  text-transform: uppercase;
`;

export const ContactContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const CustomFieldsContainer = styled.div`
  flex-basis: 100%;
  display: flex;
  padding-top: 12px;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  left: -20px;
`;

export const UserInfo = styled.div`
  padding: 0 ${spacing.large};
  color: ${palette.mediumGrey};
  display: flex;
  align-items: center;
`;

export const UserInfoDivider = styled.div`
  height: 13px;
  width: 2px;
  background-color: ${palette.coolGrey3};

  &:last-child {
    visibility: hidden;
  }
`;

export const IconWrapper = styled.a`
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
  align-items: center;
  display: flex;
`;

export const HeaderActionButton = styled.button`
  flex-shrink: 0;
  color: ${palette.lighterCyanBlue};
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    filter: brightness(1.25);
  }

  @media print {
    display: none;
  }
`;

// loader
export const TextLoader = styled.div`
  height: 19px;
  width: 169px;
  margin-right: ${spacing.smallExtraPlus};
  background: ${palette.coolGrey3};
`;

export const AvatarLoader = styled(TextLoader)`
  width: 40px;
  height: 40px;
  border-radius: 40px;
`;

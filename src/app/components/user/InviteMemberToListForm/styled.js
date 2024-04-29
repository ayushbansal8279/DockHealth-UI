import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 286px;
`;

export const LoaderWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ListItem = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  padding: ${spacing.smallPlus};
`;

export const UserOrGroupListWrapper = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  &::-webkit-scrollbar:vertical {
    width: 11px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${palette.white};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid ${palette.white};
    background-color: ${palette.coolGrey1};
  }
`;

export const ItemFullNameWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  ${({ isPending }) => (isPending ? 'opacity: 0.7;' : '')}
`;

export const ItemAvatarWrapper = styled.div`
  ${({ isPending }) => (isPending ? 'opacity: 0.7;' : '')}
`;

export const ItemFullName = styled.p`
  margin-bottom: 0;
  margin-left: ${spacing.regularPlus};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  font-size: ${fontSizes.smallPlus};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${palette.coolGrey1};
  font-family: "Outfit";
  text-transform: capitalize;
`;

export const ItemStatusLabel = styled.p`
  padding: 5px 10px;
  margin-left: ${spacing.small};
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  border-radius: 4px;
  background: ${palette.whiteSmoke};
`;

export const OptionMenuWrapper = styled.div`
  border-radius: 0px 4px 4px 0px;
  background: ${palette.whiteSmoke};
`;

export const ExternalUserInviteFormWrapper = styled.div`
  position: absolute;
  bottom: ${({ externalInvitePosition }) =>
    externalInvitePosition?.bottom || 0}px;
  left: ${({ externalInvitePosition }) => externalInvitePosition?.left || 0}px;
  background: ${palette.white};
  left: -28px;
  width: 110%;
  top: -72px;
  height: 480px;
  z-index: 2;
`;

export const OptionContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding-right: 2px;
`;

export const IconContainer = styled.img`
  transform: rotate(90deg);
  margin:5px;
`

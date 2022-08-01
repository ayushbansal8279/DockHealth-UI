import styled from 'styled-components';
import palette from 'styles/palette';
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
  padding: ${spacing.tiny} ${spacing.smallPlus};
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

  ${({ isPending }) => isPending && 'opacity: 0.7;'}
`;

export const ItemAvatarWrapper = styled.div`
  ${({ isPending }) => isPending && 'opacity: 0.7;'}
`;

export const ItemFullName = styled.p`
  margin-bottom: 0;
  margin-left: ${spacing.smallPlus};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  font-family: 'Roboto Condensed', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemStatusLabel = styled.p`
  margin-left: ${spacing.smallPlus};
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
`;

export const ExternalUserInviteFormWrapper = styled.div`
  position: absolute;
  bottom: ${({ externalInvitePosition }) =>
    externalInvitePosition?.bottom || 0}px;
  left: ${({ externalInvitePosition }) => externalInvitePosition?.left || 0}px;
  background: ${palette.white};
  width: 100%;
  z-index: 2;
`;

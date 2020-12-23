import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import { Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

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
  alignitems: center;
`;

export const MemberListItem = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  padding: ${spacing.tiny} ${spacing.smallPlus};
`;

export const MembersListWrapper = styled.div`
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

export const MemberFullNameWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  ${({ isPending }) => isPending && 'opacity: 0.7;'}
`;

export const MemberAvatarWrapper = styled.div`
  ${({ isPending }) => isPending && 'opacity: 0.7;'}
`;

export const MemberFullName = styled.p`
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

export const MemberMenuWrapper = styled.div`
  width: 210px;
  background: ${palette.white};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export const MemberMenuButton = styled.button`
  width: 100%;
  padding: ${spacing.smallPlus};
  text-align: left;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.coolGrey3};
  }

  &:hover {
    cursor: pointer;
    background: ${palette.coolGrey4};
  }
`;

export const MemberMenuButtonTitle = styled.p`
  margin-bottom: 0;
  font-family: 'Roboto', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  color: ${palette.mediumGrey};
`;

export const MemberMenuButtonDescription = styled.p`
  margin-bottom: 0;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  color: ${palette.coolGrey1};
`;

export const MemberStatusLabel = styled.p`
  margin-left: ${spacing.smallPlus};
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
`;

export const MenuPopover = withStyles({
  root: {
    zIndex: '5006 !important',
  },
  paper: {
    border: 'none',
    overflow: 'visible',
  },
  backdrop: {
    zIndex: '5005 !important',
  },
})(Popover);

export const ExternalUserInviteFormWrapper = styled.div`
  position: absolute;
  bottom: ${({ externalInvitePosition }) =>
    externalInvitePosition?.bottom || 0}px;
  left: ${({ externalInvitePosition }) => externalInvitePosition?.left || 0}px;
  padding-right: 110px;
  background: ${palette.white};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  z-index: 2;
`;

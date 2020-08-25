import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import { Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export const InviteInitialViewWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const InviteInitialViewContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const NavigationActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 222px;
  height: 224px;
  border: 1px solid ${palette.coolGrey1};
  transition: background 0.3s ease-out;

  &:hover {
    background: ${palette.coolGrey4};
    cursor: pointer;
  }
`;

export const NavigationIcon = styled.img`
  display: block;
  height: 46px;
`;

export const NavigationText = styled.p`
  margin-bottom: 0;
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.regular};
  font-family: 'Roboto Condensed', sans-serif;
`;

export const SkipButton = styled.button`
  margin: 0 auto;
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.bold};
  color: ${palette.darkBlue};
  cursor: pointer;
  text-decoration: underline;
  text-transform: uppercase;
`;

export const LoaderWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  alignitems: center;
`;

export const MembersListWrapper = styled.div`
  width: 100%;
  height: 138px;
  overflow-y: scroll;
`;

export const MemberListItem = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  padding: ${spacing.tiny} ${spacing.smallPlus};
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

export const MemberStatusLabel = styled.p`
  margin-left: ${spacing.smallPlus};
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
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

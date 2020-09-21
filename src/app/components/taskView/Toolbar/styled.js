import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

// LEGACY STYLES - REFACTOR REQUIRED
export const ToolbarLabel = withStyles({
  root: {
    color: palette.coolGrey1,
    display: 'inline-block',
  },
})(Typography);

export const ToolbarAvatarContainer = styled.div`
  align-items: center;
  border: 0.125rem solid ${palette.white};
  border-radius: 100%;
  display: flex;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  width: 100%;
`;

export const MoreMembersButtonContainer = styled.div`
  align-items: center;
  border: 0.125rem solid ${palette.brightBlue};
  border-radius: 2.5rem;
  color: ${palette.brightBlue};
  display: flex;
  font-size: 0.875rem;
  font-weight: 300;
  height: 2.5rem;
  justify-content: center;
  line-height: 1;
  min-height: 2.5rem;
  min-width: 2.5rem;
  padding: 0;
  width: 2.5rem;
`;

export const HeaderActionButtonsGrid = styled(Grid)`
  padding-right: ${spacing.huge};
`;

export const ToolbarBottomGrid = styled(Grid)`
  padding-left: ${spacing.giga};
  padding-top: ${spacing.regular};
  padding-bottom: ${spacing.regular};
  background-color: ${palette.coolGrey4};
`;

export const SearchWrapper = styled.div`
  width: ${({ fullWidth }) => (fullWidth ? 374 : 115)}px;
  transition: width 0.25s ease-out;
`;

export const MemberWrapper = styled.div`
  display: flex;
  flex-direction: row;

  ${({ isPending }) => isPending && `opacity: 0.7;`}
`;

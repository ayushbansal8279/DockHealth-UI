import styled from 'styled-components';
import { Button, Popover, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import palette, { opacify } from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const AvatarImageContainer = styled.img`
  && {
    cursor: inherit;
    height: 100%;
    width: 100%;
  }
`;

export const OuterAvatarContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

export const PlainLink = styled.a`
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  ${props => props.topPadded && 'margin-top: 4rem;'}
  text-decoration: none;
  transition: filter 0.2s ease;

  &:hover {
    color: ${palette.lighterCyanBlue};
    filter: brightness(1.25);
  }
`;

export const SmallButton = styled(Button)`
  && {
    align-items: center;
    background-color: ${palette.darkGreyBlue};
    border-radius: 0;
    color: white;
    cursor: pointer;
    display: flex;
    filter: brightness(1);
    font-size: 20px;
    font-weight: bold;
    height: 55px;
    padding: 0 1rem;
    justify-content: center;
    text-transform: initial;
    transition: filter 0.2s ease-out;
    width: 200px;

    &:hover {
      background-color: ${palette.darkGreyBlue};
      filter: brightness(1.25);
    }

    &[disabled] {
      cursor: progress;
      filter: brightness(0.75);
    }

    & input[type='file'] {
      height: 1px;
      position: absolute;
      left: 1px;
      opacity: 0.1;
      overflow: hidden;
      top: 1px;
      width: 1px;
    }
  }
`;

export const UploadImagePopover = withStyles({
  paper: {
    alignItems: 'center',
    boxShadow: `0px 4px 4px ${opacify(palette.black, 0.25)}`,
    display: 'flex',
    minHeight: 380,
    overflow: 'hidden',
    position: 'relative',
    width: 460,
  },
})(Popover);

export const UploadImagePopoverGrid = styled(Grid)`
  && {
    overflow: hidden;

    & > * {
      transition: all 0.2s ease-out;
    }
  }
`;

export const UploadImagePopoverLabel = styled.div`
  color: ${palette.unknownGrey1};
  font-size: 20px;
`;

export const UploadImagePopoverClose = styled.div`
  color: ${palette.unknownGrey5};
  cursor: pointer;
  font-size: 24px;
  line-height: 24px;
  top: 1rem;
  position: absolute;
  right: 1rem;
`;

export const UserAvatarSupplement = styled.div`
  color: ${palette.unknownGrey5};
  cursor: pointer;
  margin-left: 0.6rem;
  padding: ${spacing.regular};
  padding-right: 4rem;
`;

export const PaddedButtonLabel = styled.span`
  margin-left: ${spacing.small};
`;

export const EditButton = styled.button`
  position: absolute;
  bottom: 0;
  right: -20px;
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  cursor: pointer;

  &:hover {
    color: ${palette.lighterCyanBlue};
    filter: brightness(1.25);
  }
`;

export const PictureInput = styled.input`
  display: none;
`;

export const AvatarContainer = styled.div`
  position: relative;
`;

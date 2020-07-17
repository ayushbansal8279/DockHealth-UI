import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { MontserratTypography } from 'styles/theme-montserrat';
import Spacing from 'components/common/Spacing';
import Avatar from 'components/common/Avatar';
import AppLogo from 'img/logo/dock-logo';
import { getUserAvatar } from 'api/people-api';
import { noop } from 'helpers/utility-functions';
import palette from 'styles/palette';

import {
  HeaderLogo,
  HeaderTitle,
  PersonImage,
  HeaderTextContainer,
} from './styled';

const DashboardHeader = ({ currentUser, isUserFirstTime }) => {
  const [avatarContent, setAvatarContent] = useState('');

  useEffect(() => {
    const { firstName, lastName, profileThumbnailPictureHash } = currentUser;
    if (profileThumbnailPictureHash) {
      getUserAvatar(currentUser)
        .then(image => {
          if (image?.byteLength !== 0) {
            setAvatarContent(<PersonImage alt="avatar" src={image} />);
          }
        })
        .catch(noop);
    }

    if (firstName && lastName)
      setAvatarContent(
        `${firstName.charAt(0)}${lastName.charAt(0)}`.trim().toUpperCase(),
      );
  }, [currentUser, setAvatarContent]);

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <Grid container item sm={10}>
          <Avatar color={palette.coolGrey1} size={60}>
            {avatarContent}
          </Avatar>
          <Spacing horizontal={4} />
          <HeaderTextContainer>
            <HeaderTitle variant="h1">
              Hello {currentUser.firstName}
            </HeaderTitle>
            <Spacing vertical={3} />
            <MontserratTypography>{`Welcome${
              !isUserFirstTime ? ' back' : ''
            }!`}</MontserratTypography>
          </HeaderTextContainer>
        </Grid>
        <Grid container item sm={2} justify="flex-end" alignItems="flex-start">
          <HeaderLogo src={AppLogo} />
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardHeader;

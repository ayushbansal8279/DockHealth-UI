import { Grid } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import Spacing from 'components/common/Spacing';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import { MontserratTypography } from 'app/theme-montserrat';

const DockLogoImage = styled.img.attrs({
  src: DockHeaderLogo,
  alt: 'Dock Health logo',
})`
  object-fit: contain;
  height: 195px;
`;

const StyledGrid = styled(Grid)`
  && {
    height: 100%;
  }
`;

const TemplateAuthBaseDefaultContent = () => {
  return (
    <StyledGrid
      container
      justify="center"
      alignItems="center"
      direction="column"
    >
      <a href="/#/">
        <DockLogoImage />
      </a>
      <Spacing vertical={5} />
      <MontserratTypography weight="normal" variant="h3" color="inherit">
        A simple, HIPAA compliant task management and collaboration platform
        built specifically for healthcare.
      </MontserratTypography>
    </StyledGrid>
  );
};

export default TemplateAuthBaseDefaultContent;

import { Grid } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import Spacing from 'components/common/Spacing';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import { MontserratTypography } from 'styles/theme-montserrat';

const StyledGrid = styled(Grid)`
  && {
    height: 100%;
  }
`;

const DockLogoImage = styled.img.attrs({
  src: DockHeaderLogo,
  alt: 'Dock Health logo',
})`
  object-fit: contain;
  width: 244px;
`;

const TemplateAuthBaseRegainControlContent = () => {
  return (
    <StyledGrid
      container
      direction="column"
      justify="center"
      alignItems="flex-start"
    >
      <a href="/#/core/home/my-tasks">
        <DockLogoImage />
      </a>
      <Spacing vertical={4} />
      <MontserratTypography variant="h3" weight="bold">
        <span style={{ color: '#939AA4' }}> It&apos;s time to</span>
      </MontserratTypography>
      <MontserratTypography variant="h1" weight="bold">
        Regain Control
      </MontserratTypography>
      <Spacing vertical={5} />
      <MontserratTypography variant="h3" weight="600">
        Consolidate
      </MontserratTypography>
      <MontserratTypography variant="h4" weight="500">
        Prioritize and delegate. Assign tasks to the right people and know the
        status of each important step. Stay on top of the moving parts and
        pieces.
      </MontserratTypography>
      <Spacing vertical={5} />
      <MontserratTypography variant="h3" weight="600">
        Simplify
      </MontserratTypography>
      <MontserratTypography variant="h4" weight="500">
        Healthcare is complicated and a team sport. Dock is how to concentrate
        on the things that matter most.
      </MontserratTypography>
      <Spacing vertical={5} />
      <MontserratTypography variant="h3" weight="600">
        Care
      </MontserratTypography>
      <MontserratTypography variant="h4" weight="500">
        Dock puts what’s important front and center and keeps track of the
        millions of small but important details. Dock makes it easier to do what
        you love.
      </MontserratTypography>
    </StyledGrid>
  );
};

export default TemplateAuthBaseRegainControlContent;

import React from 'react';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import { MontserratTypography } from 'styles/theme-montserrat';
// import {
// DockHeaderImage,
// Title,
// } from 'components/template/LayoutHeader/styled';
import Spacing from 'components/common/Spacing';

const PageLoader = () => {
  return (
    <div style={{ marginTop: '200px', marginLeft: '100px' }}>
      {/* <DockHeaderImage /> */}
      <Spacing vertical={5} />
      <div style={{ display: 'flex', flexDirection: 'columns' }}>
        <MontserratTypography variant="h3">Loading</MontserratTypography>
        <div>
          <Spacing vertical={4} />
          <Loader size={LoaderSizes.big} />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;

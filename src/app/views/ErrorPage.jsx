import Spacing from 'components/common/Spacing';
import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';

const ErrorPage = () => (
  <div>
    <section className="hero is-medium is-bold">
      <div className="hero-body container">
        <div id="errorPage">
          <MontserratTypography variant="h1" align="center" weight="bold">
            Oops!
          </MontserratTypography>
          <Spacing vertical={4} />
          <MontserratTypography variant="h3" align="center">
            Looks like you haven&apos;t been invited to join Dock.
          </MontserratTypography>
          <Spacing vertical={5} />
          <MontserratTypography variant="h3" align="center">
            Contact an admin to join the fun!
          </MontserratTypography>
        </div>
      </div>
    </section>
  </div>
);

export default ErrorPage;

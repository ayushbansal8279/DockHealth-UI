import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';

const ConfirmRegistrationSuccess = () => {
  const branchAppLink = import.meta.env.VITE_BRANCH_IO_APP_LINK;
  return (
    <div className="columns large-12">
      <div className="row expanded text-center">
        <div className="columns large-12 top-buffer">
          <MontserratTypography variant="h3" weight="bold">
            Registration confirmed. <br /> Please Login.
          </MontserratTypography>
        </div>
      </div>

      <div className="row expanded">
        <div className="columns large-12 top-buffer text-center">
          <MontserratTypography variant="h4" weight="bold">
            <a href={branchAppLink} className="button secondary expand">
              Login
            </a>
          </MontserratTypography>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRegistrationSuccess;

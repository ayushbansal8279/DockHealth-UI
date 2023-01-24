import React from 'react';

const ConfirmRegistrationSuccess = () => {
  const branchAppLink = process.env.BRANCH_IO_APP_LINK;
  return (
    <div className="columns large-12">
      <div className="row expanded text-center">
        <div className="columns large-12 top-buffer">
          <h5>Registration confirmed. Please Login.</h5>
        </div>
      </div>

      <div className="row expanded">
        <div className="columns large-12 top-buffer text-center">
          <a href={branchAppLink} className="button secondary expand">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRegistrationSuccess;

import React, { useCallback } from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import { useHistory } from 'react-router-dom';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';

const ConfirmRegistrationSuccess = () => {
  const branchAppLink = import.meta.env.VITE_BRANCH_IO_APP_LINK;
  const history = useHistory();

  const handleSubmit = useCallback(() => {
    history.push(branchAppLink);
    window.location.href = branchAppLink;
  }, [branchAppLink, history]);

  return (
    <div className="columns large-12">
      <div className="row expanded text-center">
        <div className="columns large-12 top-buffer">
          <MontserratTypography variant="h3" weight="bold">
            Registration confirmed. <br /> Please Login.
          </MontserratTypography>
        </div>
      </div>
      <Spacing vertical={4} />
      <div className="row expanded">
        <div className="columns large-12 top-buffer text-center">
          <Button
            type="submit"
            fullWidth
            size="large"
            color={palette.brightOrange}
            secondaryColor={palette.oPlusRed}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRegistrationSuccess;

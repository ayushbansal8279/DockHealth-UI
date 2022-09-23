import React, { useCallback } from 'react';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Box, Typography, Button } from '@material-ui/core';
import BlueButton from 'components/common/Button/Button';
import { useHistory } from 'react-router-dom';
import { HOME_PATH } from 'routing/helpers/paths';
import { SingleTaskHeaderNav } from '../styled';

const SingleTaskHeader = () => {
  const history = useHistory();

  const goBack = useCallback(() => {
    if (history.length > 1) {
      history.goBack();
    }
  }, [history]);

  const goToDashboard = useCallback(() => {
    history.push(HOME_PATH);
  }, [history]);

  return (
    <LayoutHeader horizontalSticky>
      <SingleTaskHeaderNav>
        <LayoutHeader.Title
          title={
            <Box width="100px" onClick={goBack}>
              <Button disabled={history.length === 0} variant="text" fullWidth>
                <Box display="flex" alignItems="centes" p="0 10px">
                  <ArrowBackIcon />
                  <Box ml={1} />
                  <Typography>BACK</Typography>
                </Box>
              </Button>
            </Box>
          }
        />
        <LayoutHeader.Spacer />
        <Box>
          <BlueButton onClick={goToDashboard}>view my dashboard</BlueButton>
        </Box>
        <LayoutHeader.Spacer />
      </SingleTaskHeaderNav>
    </LayoutHeader>
  );
};

export default SingleTaskHeader;

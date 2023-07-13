/* eslint-disable no-console */
import { Box, Grid } from '@mui/material';
import React from 'react';
import { useMount } from 'react-use';
// import { hashHistory } from 'react-router';
import queryString from 'query-string';
import Loader from 'components/common/Loader/Loader';
// import * as UserApi from 'api/user-api';
import * as UserAuthApi from 'api/user-auth-api';
import { useHistory } from 'react-router-dom';

const processLaunchContext = (history, queryValues) => {
  if (typeof queryValues.jwt !== 'undefined') {
    const {
      user_id: userId,
      doctor_id: doctorId,
      patient_id: patientId,
      practice_id: practiceId,
      jwt,
      iat,
    } = queryValues;

    console.log('*******************************************************');
    console.log('Received patient_id....', patientId);
    console.log('*******************************************************');

    const data = `user_id=${userId}&doctor_id=${doctorId}&patient_id=${patientId}&practice_id=${practiceId}&jwt=${jwt}&iat=${iat}`;

    const requestAuthTokenURL = `${
      import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
    }auth/custom/token/drchrono`;
    console.log(`requestAuthTokenURL: ${requestAuthTokenURL}`);

    console.log('Exchanging temporary code and requesting Access token...');
    console.log(data);
    console.log('Requesting Access Token from URL -', requestAuthTokenURL);

    UserAuthApi.getCustomLaunchEnterpriseAccessTokensByAuthCode(
      data,
      requestAuthTokenURL,
    )
      .then(() => {
        window.location.href = `/#/core/patient/${sessionStorage.getItem(
          'patientIdentifier',
        )}`;
      })
      .catch((error) => {
        // toggleAlert(error.message, 'error');
        // eslint-disable-next-line no-alert
        alert(error.message);
      });
  } else {
    console.log('redirecting to home');
    history.push('/');
  }
};

const DrChronoLaunch = () => {
  const history = useHistory();

  useMount(() => {
    console.log(`href= ${window.location.href}`);
    if (window.location.href) {
      const index = window.location.href.indexOf('?');
      // eslint-disable-next-line unicorn/prevent-abbreviations, unicorn/prefer-string-slice
      const queryStringVal = window.location.href.substr(
        index + 1,
        window.location.href.length - 1,
      );
      const queryValues = queryString.parse(queryStringVal);
      console.log(queryValues);
      processLaunchContext(history, queryValues);
    }
  });

  return (
    <Grid container direction="column">
      <span>Welcome to Dock Health</span>
      <Box m={2} />
      <h4>Launching ...</h4>
      <Box m={2} />
      <Loader />
    </Grid>
  );
};

export default DrChronoLaunch;

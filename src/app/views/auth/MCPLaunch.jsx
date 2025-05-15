/* eslint-disable no-console */
import { Box, Grid } from '@mui/material';
import React from 'react';
import { useEffect, useState } from 'react';
import { useMount } from 'react-use';
// import { hashHistory } from 'react-router';
import queryString from 'query-string';
import Loader from 'components/common/Loader/Loader';
// import * as UserApi from 'api/user-api';
import * as UserAuthApi from 'api/user-auth-api';
import { useHistory } from 'react-router-dom';

const processLaunchContext = (history, messageEvent) => {
  console.log('processing launch context');
  console.log(messageEvent);
  if (typeof messageEvent.sdJwt !== 'undefined') {
    const {
      emr,
      parentFrameUrl,
      tokenId,
      idToken,
      username,
      userFirstName,
      userLastName,
      fhirPatient,
      patientFirstName,
      patientLastName,
      sdJwt,
      gatewayUrl,
    } = messageEvent;

    console.log('*******************************************************');
    console.log(
      `Received emr: ${emr} username: ${username} fhirPatient: ${fhirPatient}`,
    );
    console.log('*******************************************************');

    const data = messageEvent;

    const requestAuthTokenURL = `${
      import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
    }auth/custom/token/mcp?redirectUri=dock.health`;
    console.log(`requestAuthTokenURL: ${requestAuthTokenURL}`);

    console.log('Exchanging temporary code and requesting access token...');
    console.log(data);
    console.log('Requesting Access Token from URL -', requestAuthTokenURL);

    UserAuthApi.getCustomLaunchEnterpriseAccessTokensByAuthCode(
      data,
      requestAuthTokenURL,
    )
      .then(() => {
        const patientIdentifier = sessionStorage.getItem('patientIdentifier');
        console.log(`patientIdentifier: ${patientIdentifier}`);
        if (patientIdentifier && patientIdentifier !== 'null') {
          console.log(`redirecting to patient view`);
          window.location.href = `/#/core/patient/${patientIdentifier}`;
        } else {
          console.log(`redirecting to home view`);
          window.location.href = `/#/core/home`;
        }
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

const MCPLaunch = () => {
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
    }
  });

  useEffect(() => {
    const handleMessage = async (event) => {
      console.log(event);

      const contextItems = event.data;
      processLaunchContext(history, contextItems);
    };
    const loadData = async () => {
      window.addEventListener('message', handleMessage, { once: true });
    };
    const initiatePage = async () => {
      await loadData();
    };

    initiatePage();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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

export default MCPLaunch;

/* eslint-disable no-console */
import { Box, Grid } from '@mui/material';
import React from 'react';
import { useMount } from 'react-use';
// import { hashHistory } from 'react-router';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import Loader from 'components/common/Loader/Loader';
import * as UserAuthApi from 'api/user-auth-api';

const processLaunchContext = (queryValues, history) => {
  console.log('SMART APP RESPONSE:', queryValues);
  /*
    iss 	-   Identifies the EHR's FHIR endpoint, which the app can use to obtain additional details about the EHR, including its authorization URL.
    launch 	-   Opaque identifier for this specific launch, and any EHR context associated with it.
                This parameter must be communicated back to the EHR at authorization time by passing along a launch=123 parameter.

    Location: https://app/launch?iss=https%3A%2F%2Fehr%2Ffhir&launch=xyz123

  */

  if (typeof queryValues.launch !== 'undefined') {
    const issUriVal = queryValues.iss;
    sessionStorage.setItem('issUri', issUriVal);
    const redirectUriVal =
      queryValues.redirectUri !== undefined ? queryValues.redirectUri : '';
    sessionStorage.setItem('redirectUri', redirectUriVal);

    // var conformanceUri = issUri + "/metadata";

    let launchContextId = queryValues.launch;
    launchContextId = launchContextId.replace('#/', '');
    sessionStorage.setItem('launchContextId', launchContextId);

    // console.log('Getting Conformance Information ....');
    /*
      Authorization Workflow

      1. The end user begins a workflow in the SMART application that requires access to FHIR® resources. The SMART application has either been pre-configured to work with a specific FHIR® resource server, or the user has instructed the SMART application as to the location of the FHIR® resource server, or the application is accessing a record it had previously accessed.
      2. The SMART application performs discovery by requesting the FHIR® server’s conformance statement.
      3. The FHIR® server returns the conformance statement, which provides the needed endpoints for steps 4 and 8.
      4. The SMART application creates an OAuth 2.0 authorization grant request, then directs the end user to the authorization server’s authorization endpoint via a browser with said request. This request contains a request for the appropriate scopes necessary to access the FHIR® resource.
      5. The authorization server interacts with the resource owner to verify identity or other information required by the authorization server.
      6. The end user provides any information needed by the authorization server to proceed.
      7. An authorization grant is sent via the OAuth 2.0 framework back to the SMART application.
      8. The SMART application requests an access token using the authorization code.
      9. The authorization server returns the access token.
      10. The SMART application utilizes the access token to request a FHIR® resource.
      11. The FHIR® resource server returns the desired resource.
    */

    const authorizationUrl = `${
      import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
    }fhir/authorize?iss=${issUriVal}&launch=${launchContextId}&redirectUri=${redirectUriVal}`;
    console.log('authorizationUrl:', authorizationUrl);
    window.location.href = authorizationUrl;
  } else if (queryValues.code && queryValues.code !== 'undefined') {
    // Extract code from the string
    const authorizationCodeFromServer = queryValues.code;

    console.log('*******************************************************');
    console.log('Received Temporary Code....', authorizationCodeFromServer);
    console.log('*******************************************************');

    const issUriVal = sessionStorage.getItem('issUri');
    const redirectUriVal = sessionStorage.getItem('redirectUri');

    const data = `grant_type=authorization_code&code=${authorizationCodeFromServer}`;

    // Make sure to sent in the Content-Type as it will fail without this specific type
    // const optionsToFetchAccessToken = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     Accept: 'application/json',
    //   },
    //   body: data,
    // };
    const requestAuthTokenURL = `${
      import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
    }fhir/token?iss=${issUriVal}&redirectUri=${redirectUriVal}`;
    console.log(`requestAuthTokenURL: ${requestAuthTokenURL}`);

    console.log('Exchanging temporary code and requesting Access token...');
    console.log(data);
    console.log('Requesting Access Token from URL -', requestAuthTokenURL);

    UserAuthApi.getFHIREnterpriseAccessTokensByAuthCode(
      authorizationCodeFromServer,
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
  } else if (
    queryValues.refreshToken &&
    queryValues.refreshToken !== 'undefined'
  ) {
    const issUriVal = queryValues.iss;
    const redirectUriVal = queryValues.redirectUri;

    const requestAuthTokenURL = `${
      import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
    }fhir/token?iss=${issUriVal}&redirectUri=${redirectUriVal}`;
    console.log(`requestAuthTokenURL: ${requestAuthTokenURL}`);

    UserAuthApi.getFHIREnterpriseAccessTokensByRefreshToken(
      queryValues.refreshToken,
      requestAuthTokenURL,
    )
      .then(() => {
        window.location.href = `/patient/${sessionStorage.getItem(
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

const SMARTLaunch = () => {
  const history = useHistory();

  useMount(() => {
    console.log(`href= ${window.location.href}`);
    if (window.location.href) {
      const index = window.location.href.indexOf('?');
      const queryStringVal = window.location.href.substr(
        index + 1,
        window.location.href.length - 1,
      );
      const queryValues = queryString.parse(queryStringVal);
      console.log(queryValues);
      processLaunchContext(queryValues, history);
    }
  });

  return (
    <Grid container direction="column">
      <h2>Welcome to Dock Health</h2>
      <Box m={2} />
      <h4>Launching ...</h4>
      <Box m={2} />
      <Loader />
    </Grid>
  );
};

export default SMARTLaunch;

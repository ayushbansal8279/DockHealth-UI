/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import loadScript from 'load-script';
import moment from 'moment';

const GOOGLE_SDK_URL1 = 'https://apis.google.com/js/api.js';
const GOOGLE_SDK_URL2 = 'https://accounts.google.com/gsi/client';

let scriptLoadingStarted = false;

const GoogleDrivePicker = ({
  children,
  clientId,
  developerKey,
  scope,
  viewId,
  origin,
  onChange,
  onAuthenticate,
  onAuthFailed,
  multiselect,
  navHidden,
  disabled,
}) => {
  const isGoogleReady = useCallback(() => {
    return !!window.gapi;
  }, []);

  //   const isGoogleAuthReady = useCallback(() => {
  //     return !!window.gapi.auth;
  //   }, []);

  const isGooglePickerReady = useCallback(() => {
    return !!window.google.picker;
  }, []);

  const intializePicker = useCallback(() => {
    window.gapi.client.load(
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    );
  }, []);

  const onApiLoad = useCallback(() => {
    window.gapi.load('client:picker', intializePicker);
  }, [intializePicker]);

  const gisLoaded = useCallback(() => {
    // Use Google Identity Services to request an access token
    window.googleAPITokenClient = window.google.accounts.oauth2.initTokenClient(
      {
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_id: clientId,
        scope,
        callback: '',
      },
    );
  }, [clientId, scope]);

  const doAuth = useCallback((callback) => {
    window.googleAPITokenClient.callback = callback;

    const oauthToken = localStorage.getItem('GAPI_ACCESS_TOKEN');

    if (!oauthToken || oauthToken === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      window.googleAPITokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      window.googleAPITokenClient.requestAccessToken({ prompt: '' });
    }
  }, []);

  const createPicker = useCallback(
    // eslint-disable-next-line consistent-return
    (oauthToken) => {
      onAuthenticate(oauthToken);

      const googleViewId = window.google.picker.ViewId[viewId];
      const view = new window.google.picker.View(googleViewId);

      //   if (this.props.mimeTypes) {
      //     view.setMimeTypes(this.props.mimeTypes.join(','));
      //   }
      //   if (this.props.query) {
      //     view.setQuery(this.props.query);
      //   }

      if (!view) {
        throw new Error("Can't find view by viewId");
      }

      const picker = new window.google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(oauthToken)
        .setDeveloperKey(developerKey)
        .setCallback(onChange);

      if (origin) {
        picker.setOrigin(origin);
      }

      if (navHidden) {
        picker.enableFeature(window.google.picker.Feature.NAV_HIDDEN);
      }

      if (multiselect) {
        picker.enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED);
      }

      picker.build().setVisible(true);
    },
    [
      developerKey,
      multiselect,
      navHidden,
      onAuthenticate,
      onChange,
      origin,
      viewId,
    ],
  );

  // eslint-disable-next-line consistent-return
  const onChoose = useCallback(() => {
    if (
      !isGoogleReady() ||
      // !isGoogleAuthReady() ||
      !isGooglePickerReady() ||
      disabled
    ) {
      return null;
    }

    // const oauthToken = window.gapiAccessToken;
    const oauthToken = localStorage.getItem('GAPI_ACCESS_TOKEN');
    const accessTokenExpirationDateTimeString = localStorage.getItem(
      'GAPI_ACCESS_TOKEN_EXPIRATION',
    );
    const accessTokenExpirationDateTime = moment(
      accessTokenExpirationDateTimeString,
    );

    if (
      accessTokenExpirationDateTime &&
      moment().isBefore(accessTokenExpirationDateTime)
    ) {
      createPicker(oauthToken);
    } else {
      localStorage.removeItem('GAPI_ACCESS_TOKEN');
      localStorage.removeItem('GAPI_ACCESS_TOKEN_EXPIRATION');
      doAuth((response) => {
        if (response.access_token) {
          const accessTokenExpirationDT = moment().add(50, 'minutes');
          localStorage.setItem('GAPI_ACCESS_TOKEN', response.access_token);
          localStorage.setItem(
            'GAPI_ACCESS_TOKEN_EXPIRATION',
            accessTokenExpirationDT.format(),
          );
          createPicker(response.access_token);
        } else {
          onAuthFailed(response);
        }
      });
    }
  }, [
    createPicker,
    disabled,
    doAuth,
    isGooglePickerReady,
    isGoogleReady,
    onAuthFailed,
  ]);

  useEffect(() => {
    if (isGoogleReady()) {
      // google api is already exists
      // init immediately
      onApiLoad();
    } else if (!scriptLoadingStarted) {
      // load google api and the init
      scriptLoadingStarted = true;
      loadScript(GOOGLE_SDK_URL1, onApiLoad);
      loadScript(GOOGLE_SDK_URL2, gisLoaded);
    } else {
      // is loading
    }
  }, [gisLoaded, isGoogleReady, onApiLoad]);

  return (
    <div onClick={onChoose}>
      {children || <button>Open google chooser</button>}
    </div>
  );
};

GoogleDrivePicker.propTypes = {
  children: PropTypes.node,
  clientId: PropTypes.string.isRequired,
  developerKey: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  // scope: PropTypes.array,
  scope: PropTypes.string,
  viewId: PropTypes.string,
  origin: PropTypes.string,
  onChange: PropTypes.func,
  onAuthenticate: PropTypes.func,
  onAuthFailed: PropTypes.func,
  multiselect: PropTypes.bool,
  navHidden: PropTypes.bool,
  disabled: PropTypes.bool,
};

GoogleDrivePicker.defaultProps = {
  onChange: () => {},
  onAuthenticate: () => {},
  onAuthFailed: () => {},
  scope: 'https://www.googleapis.com/auth/drive.readonly',
  viewId: 'DOCS',
  multiselect: false,
  navHidden: false,
  disabled: false,
};

export default GoogleDrivePicker;

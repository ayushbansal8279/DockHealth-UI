/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useEffect, useState } from 'react';

import { log } from 'helpers/log';
import { ProfileWidgetsWrapper } from './styled';
import initializeWidgetSectionHooks from './hooks';

// import ImportWidgetScript from 'components/common/ImportWidgetScript/ImportWidgetScript';

const ProfileWidget = ({ url, height, width }) => {
  const { userProfile, patient } = initializeWidgetSectionHooks();

  const [widgetReady, setWidgetReady] = useState(false);

  // var widgetScript = ImportWidgetScript(
  //   'script/dockhealth-widget-sdk-internal.js',
  // );

  const widgetUrl = url;
  const widgetDomain = widgetUrl
    ? widgetUrl.slice(0, Math.max(0, widgetUrl.indexOf('/', 8)))
    : '';
  log(`widgetDomain: ${widgetDomain}`);

  const frameReference = useRef(null);

  const sdk = useRef(null);

  const handleOnReady = (parameters) => {
    log(`handleOnReady: ${JSON.stringify(parameters, null, 2)}`);
    setWidgetReady(true);
  };

  const handleOnNavigate = (location) => {
    log(`handleOnNavigate: ${JSON.stringify(location, null, 2)}`);
  };

  // const onStateChangeClicked = () => {
  //   console.log('onStateChangeClicked');
  //   sdk.current.fireStateChanged({ name: 'state name', value: 'state value' });
  // };

  // const onItemChangeClicked = () => {
  //   console.log('onItemChangeClicked');
  //   sdk.current.fireItemChanged({ name: 'item name', value: 'item value' });
  // };

  useEffect(() => {
    const widget = frameReference.current.contentWindow;

    sdk.current = window.dockHealthWidgetSdkInternal({
      target: widget,
      targetOrigin: widgetDomain,
    });

    sdk.current.onReady(handleOnReady);
    sdk.current.onNavigate(handleOnNavigate);
  }, [widgetDomain]);

  useEffect(() => {
    if (widgetReady) {
      log('firing state change for userIdentifier and patientIdentifier');
      if (userProfile?.userIdentifier) {
        sdk.current.fireStateChanged({
          name: 'userIdentifier',
          value: userProfile?.userIdentifier,
        });
      }
      if (patient?.patientIdentifier) {
        sdk.current.fireStateChanged({
          name: 'patientIdentifier',
          value: patient?.patientIdentifier,
        });
      }
    }
  }, [patient, userProfile, widgetReady]);

  return (
    <ProfileWidgetsWrapper>
      <iframe
        ref={frameReference}
        title="Widget"
        id="widgetId"
        height={Number.isNaN(height) ? `${height}` : `${height}px`}
        width={Number.isNaN(width) ? `${width}` : `${width}px`}
        style={{ border: 'none' }}
        src={widgetUrl}
      />
    </ProfileWidgetsWrapper>
  );
};

export default ProfileWidget;

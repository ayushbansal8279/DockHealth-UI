/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useEffect } from 'react';

import { isNumber } from '@material-ui/data-grid';
import { PatientWidgetsWrapper } from './styled';
import initializeWidgetSectionHooks from './hooks';

// import ImportWidgetScript from 'components/common/ImportWidgetScript/ImportWidgetScript';

const PatientWidget = ({ url, height, width }) => {
  const { userProfile, patient } = initializeWidgetSectionHooks();

  // var widgetScript = ImportWidgetScript(
  //   'script/dockhealth-widget-sdk-internal.js',
  // );

  const widgetUrl = url;
  const widgetDomain = widgetUrl
    ? widgetUrl.slice(0, Math.max(0, widgetUrl.indexOf('/', 8)))
    : '';
  console.log(`widgetDomain: ${widgetDomain}`);

  const frameReference = useRef(null);

  const sdk = useRef(null);

  const handleOnReady = parameters => {
    console.log(`handleOnReady: ${JSON.stringify(parameters, null, 2)}`);
  };

  const handleOnNavigate = location => {
    console.log(`handleOnNavigate: ${JSON.stringify(location, null, 2)}`);
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

  setTimeout(() => {
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
  }, 1000);

  return (
    <PatientWidgetsWrapper>
      <iframe
        ref={frameReference}
        title="Widget"
        id="widgetId"
        height={isNumber(height) ? `${height}px` : `${height}`}
        width={isNumber(width) ? `${width}px` : `${width}`}
        style={{ border: 'none' }}
        src={widgetUrl}
      />
    </PatientWidgetsWrapper>
  );
};

export default PatientWidget;

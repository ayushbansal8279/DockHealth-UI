/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useEffect } from 'react';

import { PatientWidgetsWrapper } from './styled';
import initializeWidgetSectionHooks from './hooks';

// import ImportWidgetScript from 'components/common/ImportWidgetScript/ImportWidgetScript';

const PatientWidget = () => {
  const { userProfile, patient, widgets } = initializeWidgetSectionHooks();

  // var widgetScript = ImportWidgetScript(
  //   'script/dockhealth-widget-sdk-internal.js',
  // );

  const widgetDomain = 'https://c507-72-70-58-22.ngrok.io';
  const widgetUrl = `${widgetDomain}/examples/echo/widget.html`;

  const frameReference = useRef(null);

  const sdk = useRef(null);

  // eslint-disable-next-line unicorn/consistent-function-scoping
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

    sdk.current.onNavigate(handleOnNavigate);
  }, []);

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
        height="500px"
        width="900px"
        style={{ border: 'none' }}
        src={widgetUrl}
      />
    </PatientWidgetsWrapper>
  );
};

export default PatientWidget;

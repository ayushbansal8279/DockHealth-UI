import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import queryString from 'query-string';
import * as UserAuthApi from 'api/user-auth-api';
import { showAlert } from 'helpers/utility-functions';
import { MontserratTypography } from 'styles/theme-montserrat';
import Spacing from 'components/common/Spacing';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';

const EmbeddedSso = props => {
  const history = useHistory();

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useMount(() => {
    if (window.location.href) {
      let queryValues = queryString.parse(window.location.search);

      if (!queryValues?.authToken) {
        const { location } = props;
        queryValues = queryString.parse(location.search);
      }
      if (!queryValues?.authToken) {
        queryValues = queryString.parse(history?.location?.search);
      }

      if (queryValues?.authToken !== undefined) {
        // setShowLoginMessage(true);

        const authToken = queryValues.authToken.replace('#/auth/login', '');
        let userIdentifier = '';
        if (queryValues.dockUserId) {
          userIdentifier = queryValues.dockUserId.replace('#/', '');
        }
        let viewType = '';
        if (queryValues.viewType) {
          viewType = queryValues.viewType.replace('#/', '');
        }
        let targetType = '';
        if (queryValues.targetType) {
          targetType = queryValues.targetType.replace('#/', '');
        }
        let targetIdentifier = '';
        if (queryValues.targetId) {
          targetIdentifier = queryValues.targetId.replace('#/', '');
        }

        UserAuthApi.getEnterpriseAccessTokensForEmbeddedSSO(
          authToken,
          userIdentifier,
          targetType,
          targetIdentifier,
        )
          .then(() => {
            sessionStorage.setItem('EmbeddedMode', true);
            if (viewType === 'PATIENT') {
              const patientIdentifier = sessionStorage.getItem(
                'PatientIdentifier',
              );
              if (
                patientIdentifier &&
                patientIdentifier !== '' &&
                patientIdentifier !== 'null'
              ) {
                window.location.href = `/#/core/patient/${patientIdentifier}`;
              }
            } else if (viewType === 'LIST') {
              const taskListIdentifier = sessionStorage.getItem(
                'TaskListIdentifier',
              );
              if (
                taskListIdentifier &&
                taskListIdentifier !== '' &&
                taskListIdentifier !== 'null'
              ) {
                window.location.href = `/#/core/tasks/${taskListIdentifier}`;
              }
            } else if (viewType === 'TASK') {
              const taskIdentifier = sessionStorage.getItem('TaskIdentifier');
              if (
                taskIdentifier &&
                taskIdentifier !== '' &&
                taskIdentifier !== 'null'
              ) {
                window.location.href = `/#/core/task/${taskIdentifier}`;
              }
            } else {
              window.location.href = '/#/core/home';
            }
            // setShowLoginMessage(false);
          })
          .catch(error => {
            showAlert({
              status: 'error',
              title: 'Error',
              text: error?.response?.data?.errorMessage || error?.message,
            });
          });
      }
    }
  });

  return (
    <div style={{ marginLeft: '100px' }}>
      <Spacing vertical={8} />
      <MontserratTypography variant="h3">Signing you in</MontserratTypography>
      <Spacing vertical={4} />
      <Loader size={LoaderSizes.big} />
      <Spacing vertical={6} />
    </div>
  );
};

export default EmbeddedSso;

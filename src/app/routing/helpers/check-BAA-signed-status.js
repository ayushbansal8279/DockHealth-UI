/* eslint-disable unicorn/filename-case */
import { REQUEST_GET_ORGANIZATION } from 'actions/action-types';
import { handleOrganizationResponse } from 'actions/organization-actions';
import {
  checkBAASignedStatusWithMemo as checkBAASignedStatusWithMemoApi,
  checkBAASignedStatus as checkBAASignedStatusApi,
} from 'api/organization-api';
import { DEFAULT_REDIRECT_PATH } from './paths';

const checkBAASignedStatus = async ({ dispatch, organizationIdentifier }) => {
  try {
    await dispatch({
      type: REQUEST_GET_ORGANIZATION,
    });

    const refreshOrgMemo = sessionStorage.getItem('refreshOrgMemo');
    sessionStorage.removeItem('refreshOrgMemo');

    return await handleOrganizationResponse({
      fetchMethod: () =>
        refreshOrgMemo
          ? checkBAASignedStatusApi(organizationIdentifier)
          : checkBAASignedStatusWithMemoApi(organizationIdentifier),
      dispatch,
    });
  } catch (error) {
    return DEFAULT_REDIRECT_PATH;
  }
};

export default checkBAASignedStatus;

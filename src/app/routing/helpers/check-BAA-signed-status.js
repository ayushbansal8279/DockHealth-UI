/* eslint-disable unicorn/filename-case */
import { REQUEST_GET_ORGANIZATION } from 'actions/action-types';
import { handleOrganizationResponse } from 'actions/organization-actions';
import { checkBAASignedStatusWithMemo as checkBAASignedStatusWithMemoApi } from 'api/organization-api';
import { DEFAULT_REDIRECT_PATH } from './paths';

const checkBASignedStatusFunction = checkBAASignedStatusWithMemoApi();

const checkBAASignedStatus = async ({ dispatch, organizationIdentifier }) => {
  try {
    await dispatch({
      type: REQUEST_GET_ORGANIZATION,
    });

    const refreshOrgMemo = sessionStorage.getItem('refreshOrgMemo');

    return await handleOrganizationResponse({
      fetchMethod: () =>
        checkBASignedStatusFunction(organizationIdentifier, refreshOrgMemo),
      dispatch,
    });
  } catch {
    return DEFAULT_REDIRECT_PATH;
  }
};
export default checkBAASignedStatus;

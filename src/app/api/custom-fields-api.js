import axios from './axios-heydoc';
import { log } from '../helpers/log';
import { blobFileDownload } from '../helpers/blob-file-download';
import { noop, showAlert } from '../helpers/utility-functions';
import { withWorkspaceHeaders } from '../helpers/api-helpers';


export function getAllCustomFields(workspaceIdentifier) {
  return axios
    .get(`custom/field`, withWorkspaceHeaders(workspaceIdentifier))
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getAllPatientCustomFields(
  active = true,
  patientIdentifier,
  workspaceIdentifier,
) {
  return axios
    .get(`custom/field/getAll/PATIENT`, {
      ...withWorkspaceHeaders(workspaceIdentifier),
      params: { active, targetIdentifier: patientIdentifier },
    })
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getAllTaskListCustomFields(taskListIdentifier) {
  return axios
    .get(`custom/field/getAll/TASK`, {
      params: { taskListIdentifier },
    })
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getAllProviderCustomFields() {
  return axios
    .get(`custom/field/getAll/PROVIDER`)
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getAllProfileCustomFields(
  profileTypeIdentifier,
  active = true,
) {
  return axios
    .get(`profile/type/field/getAll/${profileTypeIdentifier}`, {
      params: { active },
    })
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getAllTaskCustomFields(targetIdentifier, taskListIdentifier) {
  return axios
    .get(`custom/field/getAll/TASK`, {
      params: { targetIdentifier, taskListIdentifier },
    })
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function addCustomField(
  customField,
  targetType,
  taskListIdentifier,
  workspaceIdentifier,
) {
  return axios
    .post(
      `custom/field`,
      {
        ...customField,
        contextType: 'CUSTOM',
        targetType,
        taskListIdentifier,
      },
      withWorkspaceHeaders(workspaceIdentifier),
    )
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function updateCustomField(
  customField,
  targetType,
  taskListIdentifier,
  workspaceIdentifier,
) {
  return axios
    .put(
      `custom/field`,
      {
        ...customField,
        contextType: 'CUSTOM',
        targetType,
        taskListIdentifier,
      },
      withWorkspaceHeaders(workspaceIdentifier),
    )
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function deleteCustomField(identifier, workspaceIdentifier) {
  return axios
    .delete(
      `custom/field/${identifier}`,
      withWorkspaceHeaders(workspaceIdentifier),
    )
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function sortPatientCustomFields(identifiers) {
  return axios
    .put(`custom/field/sortCustomFields/PATIENT`, {
      customFieldIdentifiers: identifiers,
    })
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function sortProfileCustomFields(identifiers, profileTypeIdentifier) {
  return axios.put(`custom/field/sortCustomFields/PROFILE`, {
    customFieldIdentifiers: identifiers
  }, {
    params: { profileTypeIdentifier }
  });
}

export function sortTaskCustomFields(identifiers, taskListIdentifier) {
  const taskListParameter = `?taskListIdentifier=${taskListIdentifier}`;
  return axios
    .put(
      `custom/field/sortCustomFields/TASK${
        taskListIdentifier ? taskListParameter : ''
      }`,
      {
        customFieldIdentifiers: identifiers,
      },
    )
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}
export function sortUserCustomFields(identifiers) {
  return axios.put(`custom/field/sortCustomFields/PROVIDER`, {
    customFieldIdentifiers: identifiers,
  });
}

export function saveCustomFiledGroup(customFiledGroup) {
  return axios
    .post('/customFieldGroup', customFiledGroup)
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function updateCustomFiledGroup(customFiledGroupIdentifier, payload) {
  return axios
    .patch(`/customFieldGroup/${customFiledGroupIdentifier}`, payload)
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function deleteCustomFiledGroup(customFiledGroupIdentifier) {
  return axios
    .delete(`/customFieldGroup/${customFiledGroupIdentifier}`)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function searchCustomFiledGroups(context, profileTypeIdentifier) {
  if (
    context === 'PATIENT' ||
    context === 'PROVIDER' ||
    context === 'TASK' ||
    context === 'WORKFLOW'
  ) {
    return axios
      .get(`/customFieldGroup/search?context=${context}`)
      .then(({ data }) => data)
      .catch((error) => {
        log(error);
        throw new Error(error?.response?.data?.errorMessage);
      });
  }
  if (context === 'PROFILETYPE') {
    return axios
      .get(
        `/customFieldGroup/search?context=${context}&profileTypeIdentifier=${profileTypeIdentifier}`,
      )
      .then(({ data }) => data)
      .catch((error) => {
        log(error);
        throw new Error(error?.response?.data?.errorMessage);
      });
  }
}

export function getDefauldFields(context) {
  return axios
    .get(
      `/fieldReference/findDefaultsByContext?isDefault=true&context=${context}`,
    )
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function downloadCustomFieldImportTemplate() {
  return axios({
    url: `/custom/field/downloadCustomFieldImportTemplate`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  })
    .then((response) => {
        blobFileDownload(new Blob([response.data]), 'Custom_Field_Options_Template.csv');
    })
    .catch(noop);
}

export function uploadCustomFieldOptions(fileData, additionalConfig = {}, customFieldIdentifier, targetType) {
  const formData = new FormData();
  formData.append('file', fileData, encodeURIComponent(fileData.name));

  return axios
    .post(`/custom/field/upload/${targetType}`,  formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        customFieldIdentifier,
      },
      ...additionalConfig,
    })
    .then((response) => {
      const res = response.data;

      if (res?.statusCode !== 'SUCCESS') {
        showAlert({
          status: 'error',
          title: 'Upload Failed',
          text: res?.errorMessage ?? 'Something went wrong during file upload.',
        });
        throw new Error(res?.errorMessage ?? 'Upload failed with unknown error');
      }

      showAlert({
        status: 'success',
        title: 'Upload Complete',
        html: 'Custom field options uploaded successfully.',
      });      

      return res;
    })
    .catch((error) => {
      if (error.response && error.response.status === 413) {
        showAlert({
          status: 'error',
          title: 'Error',
          text: 'File exceeded the allowed size of 100 MB',
        });
      } else {
        showAlert({
          status: 'error',
          title: 'Error',
          text:
            error?.response?.data?.errorMessage ?? 
            error?.message ??
            'Something went wrong, please try again later.',
        });
      }
      throw error;
    });
}

export function updateCustomFieldScope(customFieldIdentifier, payload) {
  return axios
    .patch(`custom/field/updateScope/${customFieldIdentifier}`, payload)
    .then(({ data }) => {
      if (data.statusCode === 'SUCCESS') {
        return data;
      } else {
        throw new Error(
          data.errorMessage || 'Failed to update custom field scope',
        );
      }
    })
    .catch((error) => {
      log(error);
      throw new Error(
        error?.response?.data?.errorMessage ||
          error?.message ||
          'Failed to update custom field scope',
      );
    });
}

export function duplicateCustomField(customFieldIdentifier) {
  return axios
    .post(`custom/field/duplicate/${customFieldIdentifier}`)
    .then(({ data }) => {
      if (data.statusCode === 'SUCCESS') {
        return data;
      } else {
        throw new Error(
          data.errorMessage || 'Failed to duplicate custom field',
        );
      }
    })
    .catch((error) => {
      log(error);
      throw new Error(
        error?.response?.data?.errorMessage ||
          error?.message ||
          'Failed to duplicate custom field',
      );
    });
}
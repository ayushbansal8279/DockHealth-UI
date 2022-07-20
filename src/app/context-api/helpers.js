import { CUSTOM_FIELD_TYPES } from 'helpers/custom-fields-helpers';

/* eslint-disable import/prefer-default-export */
export const translateInitialColumnsConfig = config =>
  Object.entries(config)
    .filter(([, value]) => value)
    .map(([key]) => ({
      identifier: key,
      _customFieldType: CUSTOM_FIELD_TYPES.REGULAR,
    }));

export const translateStateToApi = state =>
  state.filter(c => c.isChecked).map(c => c.identifier);

import { CUSTOM_FIELD_TYPES } from 'helpers/custom-fields-helpers';
import { CustomFieldWidthConfig } from 'helpers/field-type-helpers';
import { TaskItemColumnWidth } from 'helpers/task-helpers';

export const translateInitialColumnsConfig = config =>
  Object.entries(config)
    .filter(([, value]) => value)
    .map(([key]) => ({
      identifier: key,
      _customFieldType: CUSTOM_FIELD_TYPES.REGULAR,
    }));

export const translateStateToApi = state =>
  state.filter(c => c.isChecked).map(c => c.identifier);

export const getInitialColumnWidth = column => {
  const isCustomField =
    column?.contextType === 'CUSTOM' || column?.contextType === 'PREDEFINED';
  if (isCustomField) {
    return CustomFieldWidthConfig[column.fieldType];
  }
  if (typeof TaskItemColumnWidth[column.identifier] === 'number')
    return TaskItemColumnWidth[column.identifier];
  return TaskItemColumnWidth[column.identifier]?.DEFAULT;
};

export const translateWidthToApi = state =>
  state.map(c => ({
    displayColumn: c.identifier,
    width: c.columnWidth?.toString(),
  }));

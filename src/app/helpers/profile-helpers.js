import { normalizeHyperlink } from "./custom-fields-helpers";
import { calculateDateTimeIntent } from "./date-intent-helpers";
import { FieldType } from "./field-type-helpers";

export const getTransformedProfileFields = (profileMetaData, types) => {
  return Object.entries(profileMetaData || {}).map(([identifier, value]) => {
    const type = types.find((fieldType) => fieldType.identifier === identifier);

    const transformValue = (val) => {
      if (type.fieldType === FieldType.HYPERLINK) {
        return { value: normalizeHyperlink(val) };
      }

      if (type.fieldType === FieldType.DATE) {
        const dateTimeIntent = calculateDateTimeIntent(val);
        return {
          value: val,
          dateTimeIntent,
        };
      }

      return { value: val };
    };

    return {
      profileTypeField: { identifier },
      values: Array.isArray(value)
        ? value.map((selectedValue) => ({ value: selectedValue }))
        : [transformValue(value)],
    };
  });
};

export const ProfileAttachmentType = {
  FOLDER : 'FOLDER',
  FILE_LOCAL : 'FILE_LOCAL',
  FILE_GDRIVE : 'FILE_GDRIVE',
};

export const ProfileStatus = {
  ALL: 'ALL',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
};
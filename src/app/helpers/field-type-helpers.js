import FieldTypeToggleImg from 'img/patient/field-type-toggle';
import FieldTypeNumberImg from 'img/patient/field-type-number';
import FieldTypeDateImg from 'img/patient/field-type-date';
import FieldTypeTextImg from 'img/patient/field-type-text';
import FieldTypeDropdownImg from 'img/patient/field-type-dropdown';
import FieldTypeLink from 'img/patient/field-type-link';

export const FieldType = {
  DATE: 'DATE',
  DROPDOWN: 'PICK_LIST',
  TEXT: 'TEXT',
  LONG_TEXT: 'LONG_TEXT',
  BOOL: 'BOOLEAN',
  NUMBER: 'NUMBER',
  HYPERLINK: 'HYPERLINK',
};

export const CustomFieldWidthConfig = {
  [FieldType.DATE]: '120',
  [FieldType.DROPDOWN]: '164',
  [FieldType.TEXT]: '164',
  [FieldType.LONG_TEXT]: '164',
  [FieldType.BOOL]: '164',
  [FieldType.NUMBER]: '164',
  [FieldType.HYPERLINK]: '164',
};

export const FieldTypeLabel = {
  [FieldType.DATE]: 'Calendar Date',
  [FieldType.DROPDOWN]: 'Dropdown Selection',
  [FieldType.TEXT]: 'Open Text Field',
  [FieldType.LONG_TEXT]: 'Long Text Field',
  [FieldType.BOOL]: 'Yes/No',
  [FieldType.NUMBER]: 'Number',
  [FieldType.HYPERLINK]: 'Link',
};

export const FIELD_TYPE_OPTIONS = [
  {
    value: FieldType.DROPDOWN,
    label: FieldTypeLabel[FieldType.DROPDOWN],
  },
  {
    value: FieldType.DATE,
    label: FieldTypeLabel[FieldType.DATE],
  },
  {
    value: FieldType.TEXT,
    label: FieldTypeLabel[FieldType.TEXT],
  },
  {
    value: FieldType.LONG_TEXT,
    label: FieldTypeLabel[FieldType.LONG_TEXT],
  },
  {
    value: FieldType.NUMBER,
    label: FieldTypeLabel[FieldType.NUMBER],
  },
  {
    value: FieldType.BOOL,
    label: FieldTypeLabel[FieldType.BOOL],
  },
  {
    value: FieldType.HYPERLINK,
    label: FieldTypeLabel[FieldType.HYPERLINK],
  },
];

export const FIELD_TYPES = [
  {
    key: FieldType.DROPDOWN,
    image: FieldTypeDropdownImg,
    title: FieldTypeLabel[FieldType.DROPDOWN],
    description: 'Create your own selections to choose from in a dropdown',
  },
  {
    key: FieldType.DATE,
    image: FieldTypeDateImg,
    title: FieldTypeLabel[FieldType.DATE],
    description: 'Choose a date from a calendar selection',
  },
  {
    key: FieldType.TEXT,
    image: FieldTypeTextImg,
    title: FieldTypeLabel[FieldType.TEXT],
    description: 'Allow free form text in an open text field',
  },
  {
    key: FieldType.LONG_TEXT,
    image: FieldTypeTextImg,
    title: FieldTypeLabel[FieldType.LONG_TEXT],
    description: 'Allow long text in an open text field',
  },
  {
    key: FieldType.NUMBER,
    image: FieldTypeNumberImg,
    title: FieldTypeLabel[FieldType.NUMBER],
    description: 'Choose from a selection of numbers',
  },
  {
    key: FieldType.BOOL,
    image: FieldTypeToggleImg,
    title: FieldTypeLabel[FieldType.BOOL],
    description: 'Choose from two options yes or no',
  },
  {
    key: FieldType.HYPERLINK,
    image: FieldTypeLink,
    title: FieldTypeLabel[FieldType.HYPERLINK],
    description: 'Add a named link for a website',
  },
];

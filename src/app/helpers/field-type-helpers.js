import FieldTypeToggleImg from 'img/patient/field-type-toggle.svg';
import FieldTypeNumberImg from 'img/patient/field-type-number.svg';
import FieldTypeDateImg from 'img/patient/field-type-date.svg';
import FieldTypeTextImg from 'img/patient/field-type-text.svg';
import FieldTypeDropdownImg from 'img/patient/field-type-dropdown.svg';
import FieldTypeLink from 'img/patient/field-type-link.svg';

export const FieldType = {
  DATE: 'DATE',
  DROPDOWN: 'PICK_LIST',
  TEXT: 'TEXT',
  LONG_TEXT: 'LONG_TEXT',
  BOOL: 'BOOLEAN',
  NUMBER: 'NUMBER',
  DROPDOWN_MULTI: 'MULTI_SELECT',
  HYPERLINK: 'HYPERLINK',
  RELATIONSHIP: 'RELATIONSHIP',
};

export const FieldCharakterLimit = {
  TEXT: 500,
  LONG_TEXT: 5000,
  RICH_TEXT: 5000,
};

export const CustomFieldWidthConfig = {
  [FieldType.DATE]: '120',
  [FieldType.DROPDOWN]: '164',
  [FieldType.TEXT]: '164',
  [FieldType.LONG_TEXT]: '164',
  [FieldType.BOOL]: '164',
  [FieldType.NUMBER]: '164',
  [FieldType.DROPDOWN_MULTI]: '164',
  [FieldType.HYPERLINK]: '164',
  [FieldType.RELATIONSHIP]: '164',
};

export const FieldTypeLabel = {
  [FieldType.DATE]: 'Calendar Date',
  [FieldType.DROPDOWN]: 'Dropdown Selection',
  [FieldType.TEXT]: 'Short Text Field',
  [FieldType.LONG_TEXT]: 'Rich Text Field',
  [FieldType.BOOL]: 'Yes/No',
  [FieldType.NUMBER]: 'Number',
  [FieldType.DROPDOWN_MULTI]: 'Dropdown Multi-Selection',
  [FieldType.HYPERLINK]: 'Link',
  [FieldType.RELATIONSHIP]: 'Relationship',
};

export const FIELD_TYPE_OPTIONS = [
  {
    value: FieldType.TEXT,
    label: FieldTypeLabel[FieldType.TEXT],
  },
  {
    value: FieldType.DATE,
    label: FieldTypeLabel[FieldType.DATE],
  },
  {
    value: FieldType.HYPERLINK,
    label: FieldTypeLabel[FieldType.HYPERLINK],
  },
  {
    value: FieldType.LONG_TEXT,
    label: FieldTypeLabel[FieldType.LONG_TEXT],
  },
  {
    value: FieldType.DROPDOWN,
    label: FieldTypeLabel[FieldType.DROPDOWN],
  },
  {
    value: FieldType.DROPDOWN_MULTI,
    label: FieldTypeLabel[FieldType.DROPDOWN_MULTI],
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
    value: FieldType.RELATIONSHIP,
    label: FieldTypeLabel[FieldType.RELATIONSHIP],
  },
];

export const FIELD_TYPES = [
  {
    key: FieldType.TEXT,
    image: FieldTypeTextImg,
    title: FieldTypeLabel[FieldType.TEXT],
    description: 'Capture short, simple text such as a name',
  },
  {
    key: FieldType.DATE,
    title: FieldTypeLabel[FieldType.DATE],
    image: FieldTypeDateImg,
    description: 'Choose a date from a calendar selection',
  },
  {
    key: FieldType.HYPERLINK,
    image: FieldTypeLink,
    title: FieldTypeLabel[FieldType.HYPERLINK],
    description: 'Add a named link for a website',
  },
  {
    key: FieldType.LONG_TEXT,
    image: FieldTypeTextImg,
    title: FieldTypeLabel[FieldType.LONG_TEXT],
    description:
      'Capture long text with formatting options like bold, bullet points, multi-lines and hyperlinks',
  },
  {
    key: FieldType.DROPDOWN,
    image: FieldTypeDropdownImg,
    title: FieldTypeLabel[FieldType.DROPDOWN],
    description:
      'Create your own selections to choose a single option from a dropdown',
  },
  {
    key: FieldType.DROPDOWN_MULTI,
    image: FieldTypeDropdownImg,
    title: FieldTypeLabel[FieldType.DROPDOWN_MULTI],
    description: 'Create selections to choose multiple from a dropdown',
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
    key: FieldType.RELATIONSHIP,
    image: FieldTypeLink,
    title: FieldTypeLabel[FieldType.RELATIONSHIP],
    description: 'Link to other custom profiles',
  },
];

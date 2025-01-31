import ShortText from 'img/profile-builder/shortText.svg';
import RichText from 'img/profile-builder/RichText.svg';
import Calender from 'img/profile-builder/Calender.svg';
import Hash from 'img/profile-builder/Hash.svg';
import Boolean from 'img/profile-builder/Boolean.svg';
import Link from 'img/profile-builder/Link.svg';
import DropDown from 'img/profile-builder/DropDown.svg';
import Profile from 'img/profile-builder/Profile.svg';

export interface Field {
  name: string;
  dragId: string;
  fieldType: string;
  img: string;
  index: number;
}
export interface Category {
  name: string;
  fieldDropId: string;
  index: number;
  fields: Field[];
}

export const FieldType = {
  TEXT: 'TEXT',
  LONG_TEXT: 'LONG_TEXT',
  DATE: 'DATE',
  NUMBER: 'NUMBER',
  BOOL: 'BOOLEAN',
  HYPERLINK: 'HYPERLINK',
  DROPDOWN: 'PICK_LIST',
  DROPDOWN_MULTI: 'MULTI_SELECT',
  RELATIONSHIP: 'RELATIONSHIP',
};

export const dummyFields: Field[] = [
  {
    name: 'Short Filed',
    dragId: FieldType.TEXT,
    fieldType: FieldType.TEXT,
    img: ShortText,
    index: 1,
  },
  {
    name: 'Rich Text Paragraph',
    dragId: FieldType.LONG_TEXT,
    fieldType: FieldType.LONG_TEXT,
    img: RichText,
    index: 2,
  },
  {
    name: 'Date',
    dragId: FieldType.DATE,
    fieldType: FieldType.DATE,
    img: Calender,
    index: 3,
  },
  {
    name: 'Numeric Input',
    dragId: FieldType.NUMBER,
    fieldType: FieldType.NUMBER,
    img: Hash,
    index: 4,
  },
  {
    name: 'Boolean',
    dragId: FieldType.BOOL,
    fieldType: FieldType.BOOL,
    img: Boolean,
    index: 5,
  },
  {
    name: 'Link Field',
    dragId: FieldType.HYPERLINK,
    fieldType: FieldType.HYPERLINK,
    img: Link,
    index: 6,
  },
  {
    name: 'Single Select',
    dragId: FieldType.DROPDOWN,
    fieldType: FieldType.DROPDOWN,
    img: DropDown,
    index: 7,
  },
  {
    name: 'Multi-Selection',
    dragId: FieldType.DROPDOWN_MULTI,
    fieldType: FieldType.DROPDOWN_MULTI,
    img: DropDown,
    index: 8,
  },
  {
    name: 'Link Profile',
    dragId: FieldType.RELATIONSHIP,
    fieldType: FieldType.RELATIONSHIP,
    img: Profile,
    index: 9,
  },
];

export const dummyCategories: Category[] = [
  {
    name: 'Default',
    fieldDropId: 'default-drop',
    index: 1,
    fields: dummyFields,
  },
];

export const DROPTYPE = {
  AddCategory: 'add-category-area-source',
  AddField: 'add-fields-area-source',
};

// active: true;
// contextType: 'CUSTOM';
// createdDateTime: '2023-12-04T22:48:37.000+00:00';
// fieldCategoryType: 'PROFILE';
// fieldType: 'LONG_TEXT';
// identifier: '83a07aaa-3630-4fd1-840a-6530afdcdb2b';
// name: 'Working Hours';
// targetType: 'PROFILE';
// updatedDateTime: '2023-12-11T21:00:51.000+00:00';

// active: true;
// contextType: 'CUSTOM';
// createdDateTime: '2025-01-31T08:14:35.246+00:00';
// fieldCategoryType: 'PROFILE';
// fieldType: 'TEXT';
// identifier: '101c9da1-9b2b-4bce-95e5-f5858487455e';
// name: 'Testing';
// targetType: 'PROFILE';
// updatedDateTime: '2025-01-31T08:14:35.246+00:00';

contextType: 'CUSTOM';
displayOptions: [];
fieldCategoryType: 'PROFILE';
fieldType: 'TEXT';
name: 'Testing';
options: null;
profileType: {
  identifier: '3de8dc3e-75d9-4e52-9e2f-f1ff6d975b76';
}
relatedProfileType: {
}
targetType: 'PROFILE';

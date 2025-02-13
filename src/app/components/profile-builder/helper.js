import ShortText from 'img/profile-builder/shortText.svg';
import RichText from 'img/profile-builder/RichText.svg';
import Calender from 'img/profile-builder/Calender.svg';
import Hash from 'img/profile-builder/Hash.svg';
import Boolean from 'img/profile-builder/Boolean.svg';
import Link from 'img/profile-builder/Link.svg';
import DropDown from 'img/profile-builder/DropDown.svg';
import Profile from 'img/profile-builder/Profile.svg';

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

export const fieldTypes = [
  {
    placeholder: 'Short Filed',
    dragId: FieldType.TEXT,
    fieldType: FieldType.TEXT,
    img: ShortText,
    index: 1,
  },
  {
    placeholder: 'Rich Text Paragraph',
    dragId: FieldType.LONG_TEXT,
    fieldType: FieldType.LONG_TEXT,
    img: RichText,
    index: 2,
  },
  {
    placeholder: 'Date',
    dragId: FieldType.DATE,
    fieldType: FieldType.DATE,
    img: Calender,
    index: 3,
  },
  {
    placeholder: 'Numeric Input',
    dragId: FieldType.NUMBER,
    fieldType: FieldType.NUMBER,
    img: Hash,
    index: 4,
  },
  {
    placeholder: 'Boolean',
    dragId: FieldType.BOOL,
    fieldType: FieldType.BOOL,
    img: Boolean,
    index: 5,
  },
  {
    placeholder: 'Link Field',
    dragId: FieldType.HYPERLINK,
    fieldType: FieldType.HYPERLINK,
    img: Link,
    index: 6,
  },
  {
    placeholder: 'Single Select',
    dragId: FieldType.DROPDOWN,
    fieldType: FieldType.DROPDOWN,
    img: DropDown,
    index: 7,
  },
  {
    placeholder: 'Multi-Selection',
    dragId: FieldType.DROPDOWN_MULTI,
    fieldType: FieldType.DROPDOWN_MULTI,
    img: DropDown,
    index: 8,
  },
  {
    placeholder: 'Link Profile',
    dragId: FieldType.RELATIONSHIP,
    fieldType: FieldType.RELATIONSHIP,
    img: Profile,
    index: 9,
  },
];

export const DROPTYPE = {
  AddCategory: 'add-category-area-source',
  AddField: 'add-fields-area-source',
};

import ShortText from 'img/profile-builder/shortText.svg';
import RichText from 'img/profile-builder/RichText.svg';
import Hash from 'img/profile-builder/Hash.svg';
import Calender from 'img/profile-builder/Calender.svg';
import Phone from 'img/profile-builder/Phone.svg';
import Email from 'img/profile-builder/Email.svg';

export interface Field {
  name: string;
  dragId: string;
  img: string;
  index: number;
}
export interface Category {
  name: string;
  fieldDropId: string;
  index: number;
  fields: Field[];
}

export const dummyFields: Field[] = [
  {
    name: 'Short Filed',
    dragId: 'short-field',
    img: ShortText,
    index: 1,
  },
  {
    name: 'Rich Text Paragraph',
    dragId: 'rich-text-field',
    img: RichText,
    index: 2,
  },
  {
    name: 'Date',
    dragId: 'date-field',
    img: Calender,
    index: 3,
  },
  {
    name: 'Numeric Input',
    dragId: 'number-field',
    img: Hash,
    index: 4,
  },
  {
    name: 'Phone Field',
    dragId: 'phone-field',
    img: Phone,
    index: 5,
  },
  {
    name: 'Email Field',
    dragId: 'email-field',
    img: Email,
    index: 6,
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

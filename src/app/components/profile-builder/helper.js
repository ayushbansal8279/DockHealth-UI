import ShortText from 'img/profile-builder/ShortText.svg';
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
    placeholder: 'Short Text Field',
    dragId: FieldType.TEXT,
    fieldType: FieldType.TEXT,
    img: ShortText,
    index: 1,
  },
  {
    placeholder: 'Rich Text Field',
    dragId: FieldType.LONG_TEXT,
    fieldType: FieldType.LONG_TEXT,
    img: RichText,
    index: 2,
  },
  {
    placeholder: 'Calendar Date',
    dragId: FieldType.DATE,
    fieldType: FieldType.DATE,
    img: Calender,
    index: 3,
  },
  {
    placeholder: 'Number',
    dragId: FieldType.NUMBER,
    fieldType: FieldType.NUMBER,
    img: Hash,
    index: 4,
  },
  {
    placeholder: 'Yes/No',
    dragId: FieldType.BOOL,
    fieldType: FieldType.BOOL,
    img: Boolean,
    index: 5,
  },
  {
    placeholder: 'Link',
    dragId: FieldType.HYPERLINK,
    fieldType: FieldType.HYPERLINK,
    img: Link,
    index: 6,
  },
  {
    placeholder: 'Dropdown Selection',
    dragId: FieldType.DROPDOWN,
    fieldType: FieldType.DROPDOWN,
    img: DropDown,
    index: 7,
  },
  {
    placeholder: 'Dropdown Multi-Selection',
    dragId: FieldType.DROPDOWN_MULTI,
    fieldType: FieldType.DROPDOWN_MULTI,
    img: DropDown,
    index: 8,
  },
  {
    placeholder: 'Relationship',
    dragId: FieldType.RELATIONSHIP,
    fieldType: FieldType.RELATIONSHIP,
    img: Profile,
    index: 9,
  },
];

export const DROPTYPE = {
  AddCategory: 'add-category-area-source',
  AddField: 'add-fields-area-source',
  ExistingField: 'add-existing-fields-area-source',
};

const desiredPatientFieldsOrder = [
  'FIRST_NAME',
  'MIDDLE_NAME',
  'LAST_NAME',
  'GENDER',
  'GENDER_IDENTITY',
  'DOB',
  'MRN',
  'PHONE_MOBILE',
  'PHONE_HOME',
];

const desiredTaskFieldsOrder = [
  'DESCRIPTION',
  'DETAILS',
  'DUE_DATE',
  'START_DT',
];

const desiredProviderFieldsOrder = [
  'ACCOUNT_PHONE',
  'CREDENTIALS',
  'DEPARTMENT',
  'EMAIL',
  'FAX_NUMBER',
  'FIRST_NAME',
  'LAST_NAME',
  'NOTES',
  'USERNAME',
  'WORK_PHONE_NUMBER',
];

const desiredWorkflowFieldsOrder = [
  'ANCHOR_DT',
  'DESCRIPTION',
  'DUE_DATE',
  'GROUP_NAME',
  'PATIENT_ID',
  'PRIORITY',
  'START_DT',
  'STATUS',
];

const getFieldOrderForContext = (context) => {
  if (context === 'PATIENT') {
    return desiredPatientFieldsOrder;
  }
  if (context === 'TASK') {
    return desiredTaskFieldsOrder;
  }
  if (context === 'PROVIDER') {
    return desiredProviderFieldsOrder;
  }
  if (context === 'WORKFLOW') {
    return desiredWorkflowFieldsOrder;
  }
  return [];
};

export const getDefaultsRefrenceIds = (defaulFields, context) => {
  const desiredOrder = getFieldOrderForContext(context);

  if (desiredOrder.length === 0) {
    return [];
  }

  const rearrangedArray = desiredOrder.map((columnName) => {
    const field = defaulFields.find((f) => f.columnName === columnName);
    return field ? { fieldReferenceId: field.identifier } : null;
  });
  return rearrangedArray;
};

const toCamelCaseWithSpaces = (fieldName) => {
  if (!fieldName) return '';

  const nameMap = {
    firstName: 'First Name',
    lastName: 'Last Name',
    middleName: 'Middle Name',
    gender: 'Sex at Birth',
    genderIdentity: 'Gender Identity',
    dob: 'Date of Birth',
    mrn: 'MRN',
    phoneMobile: 'Mobile Phone',
    phoneHome: 'Home Phone',
    description: 'Description',
    details: 'Details',
    dueDate: 'Due Date',
    startDate: 'Start Date',
    mobileNumber: 'Mobile Number',
    credentials: 'Credentials',
    department: 'Department',
    email: 'Email',
    faxNumber: 'Fax Number',
    notes: 'Notes',
    username: 'Username',
    workNumber: 'Work Number',
    anchorDate: 'Anchor Date',
    AnchorDate: 'Anchor Date',
    name: 'Name',
    patient: 'Patient',
    priority: 'Priority',
    status: 'Status',
  };

  if (nameMap[fieldName]) {
    return nameMap[fieldName];
  }
};

export const convertDefaultFields = (defaultFields) => {
  const updatedGroups = defaultFields.map((field) => {
    let fieldType = FieldType.TEXT;

    if (field.fieldName === 'dob') {
      fieldType = FieldType.DATE;
    } else if (
      field.fieldName === 'genderIdentity' ||
      field.fieldName === 'gender'
    ) {
      fieldType = FieldType.DROPDOWN;
    }

    if (
      field.fieldName === 'dueDate' ||
      field.fieldName === 'startDt' ||
      field.fieldName === 'startDate' ||
      field.fieldName === 'anchorDate' ||
      field.fieldName === 'AnchorDate'
    ) {
      fieldType = FieldType.DATE;
    }

    if (field.fieldName === 'status' || field.fieldName === 'priority') {
      fieldType = FieldType.DROPDOWN;
    }

    return {
      identifier: field.identifier,
      targetType: field.context,
      fieldType,
      name: toCamelCaseWithSpaces(field.fieldName),
      contextType: 'DEFAULT',
    };
  });

  return updatedGroups;
};

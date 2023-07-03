export const Category = {
  PERSONAL_INFO: 'PATIENT_PERSONAL',
  CONTACT_INFO: 'PATIENT_CONTACT',
  OTHER_INFO: 'PATIENT_OTHER',
  PROFILE: 'PROFILE',
};

export const CategoryLabel = {
  [Category.PERSONAL_INFO]: 'Personal Info',
  [Category.CONTACT_INFO]: 'Contact Info',
  [Category.OTHER_INFO]: 'Other Info',
};

export const CATEGORY_OPTIONS = [
  {
    label: CategoryLabel[Category.PERSONAL_INFO],
    value: Category.PERSONAL_INFO,
  },
  {
    label: CategoryLabel[Category.CONTACT_INFO],
    value: Category.CONTACT_INFO,
  },
  {
    label: CategoryLabel[Category.OTHER_INFO],
    value: Category.OTHER_INFO,
  },
];

export const PatientAttachmentType = {
  FOLDER: 'FOLDER',
  FILE_LOCAL: 'FILE_LOCAL',
  FILE_GDRIVE: 'FILE_GDRIVE',
};

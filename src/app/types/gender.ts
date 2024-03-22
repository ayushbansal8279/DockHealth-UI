export interface ISelectOption {
  value: string;
  label: string;
}

export const GENDER_OPTIONS_BIRTH: ISelectOption[] = [
  {
    value: 'male',
    label: 'Male',
  },
  {
    value: 'female',
    label: 'Female',
  },
  {
    value: 'decline',
    label: 'Decline to state',
  },
];

export interface GenderIdentityOption {
  genderIdentityType: string;
  description: string;
}

export const convertGenderIdentitiesToSelectOptions = (
  genderIdentityOptions: GenderIdentityOption[],
) =>
  genderIdentityOptions?.map((o) => ({
    value: o.genderIdentityType,
    label: o.description,
  }));

import { fontSizes } from "@/app/styles/font";
import palette from "@/app/styles/palette";

export const TextFieldSX = {
  backgroundColor: palette.whiteSmoke,
  '& .MuiOutlinedInput-root': {
    '& .MuiOutlinedInput-notchedOutline': {
      border: `2px solid ${palette.crystalBlue}`,
    },
  },
  '& .MuiAutocomplete-tag': {
    height: '40px',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    fontSize: fontSizes.regular,
    '& .MuiChip-deleteIcon': {
      backgroundColor: palette.lightGrey,
      borderRadius: '50%',
      color: 'white',
    },
    '&:hover': {
      '& .MuiChip-deleteIcon': {
        color: '#daefff',
      },
      backgroundColor: '#daefff',
    },
  },
  '& .MuiAutocomplete-endAdornment .MuiAutocomplete-clearIndicator': {
    display: 'none',
  },
};

export const mapPatientsToOptions = (patients) =>
  patients.map(
    ({ patientIdentifier, firstName, middleName, lastName, dob, mrn }) => ({
      key: patientIdentifier,
      displayValue: middleName
        ? `${lastName}, ${firstName} ${middleName?.slice(0, 1)}`
        : `${lastName}, ${firstName}`,
      dob,
      mrn,
    }),
  );